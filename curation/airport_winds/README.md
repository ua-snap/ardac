# Historical Winds at Alaska Airports

Converts the preprocessed data from the [WRCC Wind Tool](https://github.com/ua-snap/wrcc-wind-tool) into static JSON files used by the `airport-winds` item in ARDAC Explorer.

The source data are hourly wind observations from the AK_ASOS network on the [Iowa Environmental Mesonet](https://mesonet.agron.iastate.edu/request/download.phtml?network=AK_ASOS), quality-controlled and adjusted for homogeneity by the pipeline in the `wrcc-wind-tool` repo. That pipeline produces the pickled files in its `data/` directory. This script only repackages those files and does not change any values.

## Running

Requires Python 3 with `pandas` and `numpy`.

```bash
python convert_to_json.py /path/to/wrcc-wind-tool/data ../../explorer/public/data/airport-winds
```

## Outputs

* `stations.json`: one entry per station (166 total) with the selector label, airport name, coordinates, first year of record (no earlier than 1980), and runway names and headings
* `<sid>.json`: one file per station, containing:
  * `roses`: wind speed/direction frequencies (%), keyed by petal count (8, 16, 36), then month (0 = all months, 1&ndash;12 = January&ndash;December), then speed range (0&ndash;6, 6&ndash;10, 10&ndash;14, 14&ndash;18, 18&ndash;22, 22+ mph), then direction clockwise from north
  * `calms`: percent calm winds by month (0 = all months)
  * `comparison`: wind roses and calms for the oldest available decade and 2010&ndash;2019, or `null` if the station does not have enough data for a comparison
  * `exceedance`: allowable crosswind exceedance frequency (%) for runway directions 0&ndash;170&deg; at the 12.08, 14.96, and 18.41 mph FAA Runway Design Code thresholds
  * `wep`: mean monthly wind energy potential (W/m&sup2;, 100 m height) for each year and month
