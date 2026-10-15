"""
Convert the preprocessed WRCC Historical Winds at Alaska Airports data
(https://github.com/ua-snap/wrcc-wind-tool, `data/` directory) into compact
static JSON files for the ARDAC Explorer `airport-winds` item.

Outputs, written to the output directory:
  * stations.json: one entry per station with metadata and runways
  * <sid>.json: one file per station with wind roses, calms, crosswind
    exceedance, and wind energy potential

Usage:
  python convert_to_json.py <path to wrcc-wind-tool/data> <output directory>
"""

import argparse
import json
from pathlib import Path

import numpy as np
import pandas as pd

# Order matters: index positions are used for colors and labels in the app.
SPEED_RANGES = ["0-6", "6-10", "10-14", "14-18", "18-22", "22+"]
PETAL_COUNTS = [8, 16, 36]
THRESHOLDS = [12.08, 14.96, 18.41]

# Community names used in place of the station_name field, copied from
# luts.py in the wrcc-wind-tool repo.
NEW_LOCATION_NAMES = {
    "PADK": "Adak",
    "PANC": "Anchorage",
    "PANI": "Aniak",
    "PANT": "Annette",
    "PABR": "Utqiaġvik",
    "PABA": "Kaktovik",
    "PABE": "Bethel",
    "PABT": "Bettles",
    "PALU": "Cape Lisbourne",
    "PAEH": "Cape Newenham",
    "PACZ": "Cape Romanzoff",
    "PALR": "Chandalar",
    "PACV": "Cordova",
    "PADE": "Deering",
    "PAEG": "Eagle",
    "PAEI": "Eielson AFB",
    "PAEL": "Elfin Cove",
    "PAED": "Joint Base Elmendorf-Richardson",
    "PAKF": "False Pass",
    "PABI": "Fort Greely",
    "PAFR": "Joint Base Elmendorf-Richardson",
    "PAGA": "Galena",
    "PAGK": "Gulkana",
    "PAHV": "Healy",
    "PAHO": "Homer",
    "PAOH": "Hoonah",
    "PAHY": "Hydaburg",
    "PAIL": "Iliamna",
    "PAIM": "Utopia Creek",
    "PAJN": "Juneau",
    "PAFE": "Kake",
    "PAKV": "Kaltag",
    "PAEN": "Kenai",
    "PAKT": "Ketchikan",
    "PAVL": "Kivalina",
    "PAOT": "Kotzebue",
    "PAKU": "Kuparuk",
    "PALH": "Anchorage",
    "PAML": "Manley",
    "PAIN": "Denali Park",
    "PAMR": "Anchorage",
    "PAMM": "Metlakatla",
    "PAMD": "Middleton Island",
    "PABN": "Gakona",
    "PPNU": "Nuiqsut",
    "PAAQ": "Palmer",
    "PPIZ": "Point Lay",
    "PAAD": "Deadhorse",
    "PATO": "Girdwood",
    "PAPH": "Port Heiden",
    "PAPT": "Puntilla Lake",
    "PADG": "Red Dog Mine",
    "PASM": "St. Mary's",
    "PASA": "Savoonga",
    "PASY": "Shemya",
    "PASI": "Sitka",
    "PADT": "Slana",
    "PAPB": "St. George Island",
    "PAMK": "St. Michael Island",
    "PATA": "Tanana",
    "PATC": "Shishmaref",
    "PATG": "Togiak",
    "PAFB": "Fort Wainwright",
    "PAWI": "Wainwright",
    "PAWS": "Wasilla",
    "PAUO": "Willow",
    "PAFA": "Fairbanks",
    "PASN": "St. Paul Island",
    "PANN": "Nenana",
}


def load_airport_meta(data_dir):
    """Load airport metadata, amended with manually-scraped runway info.
    Mirrors the logic in luts.py of the wrcc-wind-tool repo."""
    airport_meta = pd.read_csv(data_dir / "airport_meta.csv").set_index("sid")
    return (
        pd.read_csv(data_dir / "meta_amend.csv")
        .set_index("sid")
        .combine_first(airport_meta)
        .reset_index()
    )


def location_label(sid, row):
    """Build the airport selector label, e.g. 'Fairbanks / Fairbanks
    International Airport (PAFA)'."""
    name = row.station_name.replace("(ASOS)", "").replace("(AWOS)", "").title()
    name = NEW_LOCATION_NAMES.get(sid, name).strip()
    return f"{name} / {row.real_name} ({sid})"


def rose_matrix(df, pcount):
    """Return frequencies as a [speed range][direction] nested list, with
    directions sorted clockwise from north."""
    directions = np.arange(pcount) * (36 / pcount)
    matrix = []
    for speed_range in SPEED_RANGES:
        sr = df[df["speed_range"] == speed_range].set_index("direction_class")
        sr = sr.reindex(directions, fill_value=0)
        matrix.append([round(float(f), 2) for f in sr["frequency"]])
    return matrix


def station_roses(roses, sid):
    """Wind roses for the full record, keyed by petal count, then by month
    (0 = all months, 1-12 = January-December)."""
    station = roses[(roses["sid"] == sid) & (roses["decade"] == "none")]
    out = {}
    for pcount in PETAL_COUNTS:
        by_pcount = station[station["pcount"] == pcount]
        out[pcount] = [
            rose_matrix(by_pcount[by_pcount["month"] == month], pcount)
            for month in range(13)
        ]
    return out


def station_calms(calms, sid):
    """Percent calm winds by month (0 = all months, 1-12 = January-December)."""
    station = calms[(calms["sid"] == sid) & (calms["decade"] == "none")]
    station = station.set_index("month").sort_index()
    return [float(station.loc[month, "percent"]) for month in range(13)]


def station_comparison(roses, calms, sid):
    """Wind roses and calms for the oldest available decade and 2010-2019.
    Returns None if the station has insufficient data for a comparison."""
    station = roses[(roses["sid"] == sid) & (roses["decade"] != "none")]
    decades = sorted(station["decade"].unique())
    if len(decades) == 0 or "2010-2019" not in decades:
        return None
    decades = [decades[0], "2010-2019"]

    station_calms = calms[(calms["sid"] == sid) & (calms["decade"].isin(decades))]
    station_calms = station_calms.set_index("decade")

    out = {"decades": decades, "roses": {}, "calms": []}
    for pcount in PETAL_COUNTS:
        by_pcount = station[station["pcount"] == pcount]
        out["roses"][pcount] = [
            rose_matrix(by_pcount[by_pcount["decade"] == decade], pcount)
            for decade in decades
        ]
    out["calms"] = [float(station_calms.loc[decade, "percent"]) for decade in decades]
    return out


def station_exceedance(exceedance, sid):
    """Crosswind exceedance by threshold, over runway directions 0-170."""
    station = exceedance[exceedance["sid"] == sid]
    directions = sorted(station["direction"].unique().tolist())
    out = {"directions": directions, "thresholds": []}
    for threshold in THRESHOLDS:
        by_threshold = station[station["threshold"] == threshold].set_index(
            "direction"
        )
        out["thresholds"].append(
            {
                "threshold": threshold,
                "rdcClass": by_threshold["rdc_class"].iloc[0],
                "exceedance": [
                    float(by_threshold.loc[d, "exceedance"]) for d in directions
                ],
            }
        )
    return out


def station_wep(mean_wep, sid):
    """Mean monthly wind energy potential, one entry per year and month."""
    station = mean_wep[mean_wep["sid"] == sid].sort_values(["month", "year"])
    return {
        "month": station["month"].astype(int).tolist(),
        "year": station["year"].astype(int).tolist(),
        "wep": [round(float(w), 1) for w in station["wep"]],
    }


def station_runways(airport_meta, sid):
    """Runways with known headings, normalized to 0-179 degrees."""
    runways = []
    for row in airport_meta[airport_meta["sid"] == sid].itertuples():
        if pd.isna(row.rw_heading) or pd.isna(row.rw_name):
            continue
        heading = int(row.rw_heading)
        if heading >= 180:
            heading -= 180
        runways.append({"name": row.rw_name, "heading": heading})
    return runways


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("data_dir", type=Path)
    parser.add_argument("out_dir", type=Path)
    args = parser.parse_args()

    roses = pd.read_pickle(args.data_dir / "roses.pickle")
    roses["pcount"] = roses["pcount"].astype(int)
    roses["month"] = roses["month"].astype(int)
    calms = pd.read_pickle(args.data_dir / "calms.pickle")
    exceedance = pd.read_pickle(args.data_dir / "crosswind_exceedance.pickle")
    mean_wep = pd.read_pickle(args.data_dir / "mean_wep.pickle")
    airport_meta = load_airport_meta(args.data_dir)

    # Only stations with wind rose data are included, as in the original tool.
    map_data = (
        airport_meta.drop(columns=["rw_name", "rw_heading"])
        .drop_duplicates()
        .set_index("sid")
    )
    map_data = map_data.loc[map_data.index.isin(roses["sid"].unique())]

    args.out_dir.mkdir(parents=True, exist_ok=True)

    stations = []
    for sid, row in map_data.iterrows():
        station = {
            "sid": sid,
            "label": location_label(sid, row),
            "name": row.real_name,
            "lat": round(float(row.lat), 4),
            "lng": round(float(row.lon), 4),
            "startYear": max(pd.to_datetime(row.begints, utc=True).year, 1980),
            "runways": station_runways(airport_meta, sid),
        }
        stations.append(station)

        data = {
            "sid": sid,
            "roses": station_roses(roses, sid),
            "calms": station_calms(calms, sid),
            "comparison": station_comparison(roses, calms, sid),
            "exceedance": station_exceedance(exceedance, sid),
            "wep": station_wep(mean_wep, sid),
        }
        with open(args.out_dir / f"{sid}.json", "w") as f:
            json.dump(data, f, separators=(",", ":"), ensure_ascii=False)

    stations.sort(key=lambda s: s["label"])
    with open(args.out_dir / "stations.json", "w") as f:
        json.dump(stations, f, separators=(",", ":"), ensure_ascii=False)

    print(f"Wrote {len(stations)} stations to {args.out_dir}")


if __name__ == "__main__":
    main()
