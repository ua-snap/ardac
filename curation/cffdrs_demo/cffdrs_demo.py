#!/usr/bin/env python3
"""
Regenerate the CFFDRS demo JSON files in assets/cffdrs_demo/.

For each fire management Predictive Service Area (PSA) polygon below, this
"cookie-cuts" the SNAP Rasdaman CMIP6 BUI and ISI coverages (axes: model,
time, lat, lon), then averages:

  * spatially over every grid cell whose center falls inside the polygon,
  * over model-axis positions 0-3,
  * over every year 2070-2099,

for each calendar day from Apr 1 to Oct 31. The time axis is an integer
index of days on a 365-day calendar starting 1980-04-01; see
DATA_FIRST_YEAR / DAYS_PER_YEAR below. Output is one JSON file per
polygon and index, keyed "MM-DD", values rounded to 4 decimals:

  tanana_zone_south_bui_2070_2099.json   {"04-01": 5.8961, ...}

By default it downloads each year's fire season with GetCoverage (60 requests
in total, cached between runs) and averages locally. --server-side instead
tries to run the whole calculation inside Rasdaman with one WCPS query per
polygon and index (experimental).

Before writing, the script compares its results against the JSON files
already in the output directory and prints the largest difference, so you
can confirm it reproduces the earlier numbers.

Requirements (Python 3.9+):
  pip install requests numpy pandas xarray netCDF4 geopandas shapely

It needs network access to zeus.snap.uaf.edu (UAF network / VPN).

Usage (run from the repo root):
  python scripts/cffdrs_demo.py --dry-run     # compare only, write nothing
  python scripts/cffdrs_demo.py               # compare, then overwrite
  python scripts/cffdrs_demo.py --describe    # print coverage axes and exit
  python scripts/cffdrs_demo.py --server-side # experimental WCPS route
"""

import argparse
import hashlib
import io
import json
import time
import re
import sys
import tempfile
import xml.etree.ElementTree as ET
from pathlib import Path

import numpy as np
import pandas as pd
import requests
import xarray as xr

WCS_URL = "https://zeus.snap.uaf.edu/rasdaman/ows"
COVERAGES = {"bui": "cmip6_bui", "isi": "cmip6_isi"}

# PSANAME in alaska_allPSAs.shp -> output file slug
PSAS = {
    "Tanana Zone-South": "tanana_zone_south",
    "Tanana Valley-West": "tanana_valley_west",
    "Tanana Valley-East": "tanana_valley_east",
}

SEASON_START = "04-01"
SEASON_END = "10-31"
MODEL_POSITIONS = (0, 3)  # inclusive

# The coverages' time axis is a plain integer index, not timestamps. Per the
# coverage metadata it counts every day on a 365-day (noleap) calendar from
# 1980-04-01, and its 43649 steps end exactly on 2099-10-31:
#   index 0 = 1980-04-01, 213 = 1980-10-31, 365 = 1981-04-01, ...
# (Nov-Mar steps exist on the axis but aren't used here.)
DATA_FIRST_YEAR = 1980
DATA_LAST_YEAR = 2099
DAYS_PER_YEAR = 365     # noleap
DAYS_PER_SEASON = 214   # Apr 1 - Oct 31
BBOX_PAD_DEG = 0.5  # margin of cells fetched around the polygons
SIMPLIFY_DEG = 0.01  # polygon simplification for WCPS clip (keeps queries small)

HERE = Path(__file__).resolve().parent
DEFAULT_POLYGONS = HERE / "cffdrs_demo_psas.geojson"
DEFAULT_OUT = HERE.parent.parent / "explorer" / "assets" / "cffdrs_demo"
DEFAULT_CACHE = Path(tempfile.gettempdir()) / "cffdrs_demo_cache"

AXES = {"model": "model", "time": "time", "lat": "lat", "lon": "lon"}


# --------------------------------------------------------------------------
# Coverage description
# --------------------------------------------------------------------------

def local(tag):
    return tag.rsplit("}", 1)[-1]


def describe(coverage_id):
    """Axis extents, SRS and nil values from a CIS 1.1 DescribeCoverage."""
    r = requests.get(
        WCS_URL,
        params={
            "SERVICE": "WCS",
            "VERSION": "2.1.0",
            "REQUEST": "DescribeCoverage",
            "COVERAGEID": coverage_id,
            "outputType": "GeneralGridCoverage",
        },
        timeout=120,
    )
    r.raise_for_status()
    root = ET.fromstring(r.content)

    info = {"axes": {}, "labels": [], "srs": None, "nil": []}
    for el in root.iter():
        name = local(el.tag)
        if name == "Envelope":
            info["srs"] = el.get("srsName")
            if el.get("axisLabels"):
                info["labels"] = el.get("axisLabels").split()
        elif name == "AxisExtent":
            info["axes"][el.get("axisLabel")] = (el.get("lowerBound"), el.get("upperBound"))
        elif name == "nilValue" and el.text:
            try:
                info["nil"].append(float(el.text))
            except ValueError:
                pass

    missing = set(AXES.values()) - set(info["axes"])
    if missing:
        sys.exit(f"{coverage_id}: expected axes {sorted(AXES.values())}, "
                 f"got {sorted(info['axes'])}")
    return info


def print_description(coverage_id, info):
    print(f"\n=== {coverage_id} ===")
    print("srs:", info["srs"])
    print("nil values:", info["nil"])
    for label, (lo, hi) in info["axes"].items():
        print(f"  {label:6s} {lo} .. {hi}")


def uses_0_360(info):
    lo, hi = (float(v) for v in info["axes"][AXES["lon"]])
    return hi > 180


def season_index_range(year):
    """First and last time-axis index of the given year's Apr 1 - Oct 31 season."""
    i0 = (year - DATA_FIRST_YEAR) * DAYS_PER_YEAR
    return i0, i0 + DAYS_PER_SEASON - 1


# --------------------------------------------------------------------------
# Data download
# --------------------------------------------------------------------------

def get_year(coverage_id, year, bbox, cache_dir, time_subset):
    """Download one fire season of one coverage for the bbox, as a Dataset."""
    tag = re.sub(r"[^0-9,-]", "", time_subset(year)).replace(",", "_")
    cache = cache_dir / f"{coverage_id}_{year}_{tag}.nc"
    if cache.exists():
        return xr.open_dataset(cache).load()

    minlon, minlat, maxlon, maxlat = bbox
    subsets = [
        f"{AXES['lon']}({minlon},{maxlon})",
        f"{AXES['lat']}({minlat},{maxlat})",
        f'{AXES["time"]}({time_subset(year)})',
        f"{AXES['model']}({MODEL_POSITIONS[0]},{MODEL_POSITIONS[1]})",
    ]
    params = [
        ("SERVICE", "WCS"),
        ("VERSION", "2.1.0"),
        ("REQUEST", "GetCoverage"),
        ("COVERAGEID", coverage_id),
        ("FORMAT", "application/netcdf"),
    ] + [("SUBSET", s) for s in subsets]
    r = requests.get(WCS_URL, params=params, timeout=600)
    if r.status_code != 200 or r.content[:4] not in (b"CDF\x01", b"CDF\x02", b"\x89HDF"):
        sys.exit(f"GetCoverage failed ({r.status_code}) for {r.url}\n{r.text[:2000]}")
    cache.write_bytes(r.content)
    return xr.open_dataset(io.BytesIO(r.content)).load()


# --------------------------------------------------------------------------
# Zonal statistics
# --------------------------------------------------------------------------

def polygon_masks(polys, ds):
    import shapely

    lat, lon = AXES["lat"], AXES["lon"]
    lons = ds[lon].values
    lats = ds[lat].values
    xx, yy = np.meshgrid(lons, lats)
    masks = {}
    for name, geom in polys.items():
        inside = shapely.contains_xy(geom, xx, yy)
        if not inside.any():
            sys.exit(f"No grid-cell centers fall inside {name}")
        print(f"  {name}: {int(inside.sum())} grid cells")
        masks[name] = xr.DataArray(inside, dims=(lat, lon), coords={lat: lats, lon: lons})
    return masks


def pick_data_var(ds):
    """The numeric (model, time, lat, lon) variable; skips CRS/metadata vars."""
    want = {AXES["model"], AXES["time"], AXES["lat"], AXES["lon"]}
    for name, var in ds.data_vars.items():
        if np.issubdtype(var.dtype, np.number) and want <= set(var.dims):
            return var
    sys.exit("No numeric model/time/lat/lon variable in the netCDF. Variables: "
             + ", ".join(f"{n} {v.dims} {v.dtype}" for n, v in ds.data_vars.items()))


def season_means(coverage_id, info, polys, years, bbox, cache_dir, time_subset):
    """{psa_name: pd.Series indexed "MM-DD"} of the multi-year daily mean."""
    lat, lon, t, m = AXES["lat"], AXES["lon"], AXES["time"], AXES["model"]
    days = pd.date_range(f"2001-{SEASON_START}", f"2001-{SEASON_END}").strftime("%m-%d")
    per_year = {psa: [] for psa in polys}
    masks = None

    for year in years:
        print(f"  {coverage_id} {year}", end="\r", flush=True)
        ds = get_year(coverage_id, year, bbox, cache_dir, time_subset)
        da = pick_data_var(ds).astype("float64")
        for nil in info["nil"]:
            da = da.where(da != nil)
        da = da.where(np.isfinite(da))

        if da.sizes[t] != len(days):
            sys.exit(f"{year}: expected {len(days)} days on {t}, got {da.sizes[t]}")
        if masks is None:
            print()
            masks = polygon_masks(polys, ds)

        for psa, mask in masks.items():
            zonal = da.where(mask).mean(dim=[lat, lon], skipna=True)  # (model, time)
            zonal = zonal.mean(dim=m, skipna=True)                     # (time,)
            per_year[psa].append(zonal.values)
    print()

    return {
        psa: pd.Series(np.nanmean(np.vstack(arrs), axis=0), index=days)
        for psa, arrs in per_year.items()
    }


# --------------------------------------------------------------------------
# Server-side (WCPS) calculation
# --------------------------------------------------------------------------

def wkt_rings(geom, lat_first, ndp=4):
    """WKT body for a Polygon/MultiPolygon in the coverage's axis order."""
    def ring(coords):
        pts = []
        for x, y in coords:  # shapely: x = lon, y = lat
            a, b = (y, x) if lat_first else (x, y)
            pts.append(f"{a:.{ndp}f} {b:.{ndp}f}")
        return "(" + ", ".join(pts) + ")"

    def poly(p):
        return "(" + ", ".join([ring(p.exterior.coords)] +
                               [ring(r.coords) for r in p.interiors]) + ")"

    if geom.geom_type == "Polygon":
        return "POLYGON" + poly(geom)
    if geom.geom_type == "MultiPolygon":
        return "MULTIPOLYGON(" + ", ".join(poly(p) for p in geom.geoms) + ")"
    sys.exit(f"Unsupported geometry type {geom.geom_type}")


def wcps_query(coverage_id, polygon_wkt, first_index, n_years):
    """
    Daily (Apr 1 - Oct 31) mean over n_years seasons, model positions 0-3 and
    the grid cells inside the polygon, returned as a 214-value 1-D coverage.
    """
    # clip() needs a 2-D (lat, lon) slice to match the 2-D polygon, so slice
    # one model and one day at a time, take the spatial mean inside the
    # polygon, and sum those over years x models before dividing.
    m0, m1 = MODEL_POSITIONS
    n_models = m1 - m0 + 1
    return f"""for $c in ({coverage_id})
return encode(
  coverage daily_mean
  over $d d(0:{DAYS_PER_SEASON - 1})
  values (
    condense + over $y y(0:{n_years - 1}), $m m({m0}:{m1})
    using avg(
      clip(
        $c[{AXES["model"]}($m), {AXES["time"]}({first_index} + $y * {DAYS_PER_YEAR} + $d)],
        {polygon_wkt}
      )
    )
  ) / {float(n_years * n_models)},
  "application/json")"""


NUM_RE = re.compile(r"[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?|nan|NaN|null", re.I)


def parse_values(text):
    vals = []
    for tok in NUM_RE.findall(text):
        vals.append(np.nan if tok.lower() in ("nan", "null") else float(tok))
    return np.array(vals)


def run_wcps(query, cache_dir):
    key = hashlib.sha1(query.encode()).hexdigest()[:16]
    cache = cache_dir / f"wcps_{key}.json"
    if cache.exists():
        return cache.read_text()
    t0 = time.time()
    r = requests.post(
        WCS_URL,
        data={"SERVICE": "WCS", "VERSION": "2.0.1",
              "REQUEST": "ProcessCoverages", "QUERY": query},
        timeout=3600,
    )
    if r.status_code != 200:
        qfile = cache_dir / f"failed_query_{key}.txt"
        qfile.write_text(query)
        sys.exit(f"WCPS query failed ({r.status_code}); query saved to {qfile}\n"
                 f"{r.text[:3000]}")
    print(f"({time.time() - t0:.0f}s)", end=" ", flush=True)
    cache.write_text(r.text)
    return r.text


def server_side_means(coverage_id, polys, lat_first, first_index, n_years, cache_dir):
    days = pd.date_range(f"2001-{SEASON_START}", f"2001-{SEASON_END}").strftime("%m-%d")
    out = {}
    for psa, geom in polys.items():
        print(f"  {coverage_id} / {psa} ...", end=" ", flush=True)
        q = wcps_query(coverage_id, wkt_rings(geom, lat_first), first_index, n_years)
        text = run_wcps(q, cache_dir)
        vals = parse_values(text)
        if len(vals) != len(days):
            sys.exit(f"\nExpected {len(days)} values from WCPS, got {len(vals)}:\n{text[:2000]}")
        n_nan = int(np.isnan(vals).sum())
        print("done" + (f" (WARNING: {n_nan} NaN days)" if n_nan else ""))
        out[psa] = pd.Series(vals, index=days)
    return out


# --------------------------------------------------------------------------
# Main
# --------------------------------------------------------------------------

def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--start-year", type=int, default=2070)
    ap.add_argument("--end-year", type=int, default=2099)
    ap.add_argument("--polygons", type=Path, default=DEFAULT_POLYGONS,
                    help="GeoJSON/shapefile with a PSANAME field (e.g. alaska_allPSAs.shp)")
    ap.add_argument("--out", type=Path, default=DEFAULT_OUT)
    ap.add_argument("--cache", type=Path, default=DEFAULT_CACHE)
    method = ap.add_mutually_exclusive_group()
    method.add_argument("--server-side", dest="method", action="store_const",
                        const="server", help="compute in Rasdaman via WCPS (experimental)")
    method.add_argument("--download", dest="method", action="store_const",
                        const="download", help="download each year and average locally (default)")
    ap.set_defaults(method="download")
    ap.add_argument("--simplify", type=float, default=SIMPLIFY_DEG,
                    help="server-side only: polygon simplification tolerance in "
                         "degrees (0 = none; default %(default)s)")
    ap.add_argument("--print-query", action="store_true",
                    help="with --server-side: print the WCPS query for the first "
                         "polygon and exit")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--describe", action="store_true")
    args = ap.parse_args()

    import geopandas as gpd

    infos = {var: describe(cov) for var, cov in COVERAGES.items()}
    for var, info in infos.items():
        print_description(COVERAGES[var], info)
    if args.describe:
        return

    for var, info in infos.items():
        n_steps = int(info["axes"][AXES["time"]][1]) + 1
        expected = season_index_range(DATA_LAST_YEAR)[1] + 1
        if n_steps != expected:
            print(f"\nWARNING: {COVERAGES[var]} time axis has {n_steps} steps, but a "
                  f"daily noleap axis from {DATA_FIRST_YEAR}-04-01 to "
                  f"{DATA_LAST_YEAR}-10-31 would have {expected}. Check the dry-run "
                  f"comparison before trusting the output.")

    if not (DATA_FIRST_YEAR <= args.start_year <= args.end_year <= DATA_LAST_YEAR):
        sys.exit(f"Years must be within {DATA_FIRST_YEAR}-{DATA_LAST_YEAR}")

    def time_subset(year):
        return "{},{}".format(*season_index_range(year))

    print(f"\n{args.start_year}-04-01 = time index {season_index_range(args.start_year)[0]}, "
          f"{args.end_year}-10-31 = time index {season_index_range(args.end_year)[1]}")

    gdf = gpd.read_file(args.polygons)
    gdf = gdf[gdf["PSANAME"].isin(PSAS)].to_crs(4326)
    missing = set(PSAS) - set(gdf["PSANAME"])
    if missing:
        sys.exit(f"PSAs not found in {args.polygons}: {missing}")
    if uses_0_360(infos["bui"]):
        gdf = gdf.set_geometry(gdf.geometry.translate(xoff=360))
    polys = dict(zip(gdf["PSANAME"], gdf.geometry))
    minx, miny, maxx, maxy = gdf.total_bounds
    bbox = (minx - BBOX_PAD_DEG, miny - BBOX_PAD_DEG, maxx + BBOX_PAD_DEG, maxy + BBOX_PAD_DEG)

    years = range(args.start_year, args.end_year + 1)
    args.cache.mkdir(parents=True, exist_ok=True)
    tag = f"{args.start_year}_{args.end_year}"

    results = {}
    if args.method == "server":
        labels = infos["bui"].get("labels") or list(infos["bui"]["axes"])
        lat_first = labels.index(AXES["lat"]) < labels.index(AXES["lon"])
        wcps_polys = {
            psa: (g.simplify(args.simplify, preserve_topology=True) if args.simplify else g)
            for psa, g in polys.items()
        }
        first_index = season_index_range(args.start_year)[0]
        n_years = args.end_year - args.start_year + 1
        if args.print_query:
            psa, g = next(iter(wcps_polys.items()))
            print(f"\n# {psa}\n" + wcps_query(COVERAGES["bui"], wkt_rings(g, lat_first),
                                               first_index, n_years))
            return
        for psa, g in wcps_polys.items():
            print(f"{psa}: {len(g.exterior.coords) if g.geom_type == 'Polygon' else '?'} "
                  f"vertices after simplifying to {args.simplify} deg")
        for var, cov in COVERAGES.items():
            print(f"\nWCPS {cov} {args.start_year}-{args.end_year}, "
                  f"model {MODEL_POSITIONS[0]}-{MODEL_POSITIONS[1]}")
            results[var] = server_side_means(cov, wcps_polys, lat_first, first_index,
                                             n_years, args.cache)
    else:
        for var, cov in COVERAGES.items():
            print(f"\nFetching {cov} {args.start_year}-{args.end_year}, "
                  f"model {MODEL_POSITIONS[0]}-{MODEL_POSITIONS[1]}")
            results[var] = season_means(cov, infos[var], polys, years, bbox, args.cache,
                                        time_subset)

    print("\nMax |new - existing JSON|:")
    for var in results:
        for psa, slug in PSAS.items():
            path = args.out / f"{slug}_{var}_{tag}.json"
            if not path.exists():
                print(f"  {path.name}: (no existing file)")
                continue
            old = pd.Series(json.loads(path.read_text()))
            new = results[var][psa].round(4)
            diff = (new - old.reindex(new.index)).abs()
            print(f"  {path.name}: {diff.max():.4f} (mean {diff.mean():.4f})")

    if args.dry_run:
        print("\n--dry-run: nothing written")
        return

    bad = [f"{PSAS[psa]}_{var}" for var in results for psa in PSAS
           if results[var][psa].isna().any()]
    if bad:
        sys.exit(f"\nNot writing: NaN days in {', '.join(bad)} (NaN isn't valid JSON). "
                 f"Try without --server-side, which skips missing cells locally.")

    for var in results:
        for psa, slug in PSAS.items():
            path = args.out / f"{slug}_{var}_{tag}.json"
            data = {day: round(float(v), 4) for day, v in results[var][psa].items()}
            # json.dumps(indent=1), no trailing newline: matches the original files
            path.write_text(json.dumps(data, indent=1))
            print("wrote", path)


if __name__ == "__main__":
    main()
