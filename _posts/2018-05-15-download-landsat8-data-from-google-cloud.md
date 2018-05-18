---
layout:         post
title:          Landsat 8 data access from Google Cloud Storage
subtitle:
card-image:     /assets/images/earth.jpg
date:           2018-05-18 15:00:00
tags:           [remote&nbsp;sensing, cloud]
categories:     [remote&nbsp;sensing, google&nbsp;cloud]
post-card-type: image
---

### Landsat 8 bands

Landsat 8 is one of NASA's EOS (Earth Observing System) satellites. It was launched in February *2013* and was aimed to replace its predecessor Landsat 7. The satellite collects images of the Earth with a *16-day* repeat cycle. The approximate scene size is *170 km* north-south by *183 km* east-west. There are two major instruments onboard the Landsat 8 satellite: *OLI* (Operational Land Imager) and *TIRS* (Thermal Infrared Sensor). OLI collects data from *nine* spectral bands, two of them (band 1 and band 9) are newly added bands compared to Landsat 7's ETM+ sensor. The following table illustrates the 9 OLI bands:

Spectral Band | Wavelength (um) | Resolution (m)
   :---  | :--- | :---:
Band 1 - Coastal / Aerosol | 0.433 – 0.453 | 30
Band 2 - Blue | 0.450 – 0.515 | 30
Band 3 - Green | 0.525 – 0.600 | 30
Band 4 - Red | 0.630 – 0.680 | 30
Band 5 - Near Infrared | 0.845 – 0.885 | 30
Band 6 - Shortwave Infrared (SWIR) 1 | 1.560 – 1.660 | 30
Band 7 - Shortwave Infrared (SWIR) 2 | 2.100 – 2.300 | 30
Band 8 - Panchromatic | 0.500 – 0.680 | 15
Band 9 - Cirrus | 1.360 – 1.390 | 30

*Two* thermal bands (TIRS) are collected at 100 meter resolution, but are resampled to 30 meter in delivered data product.

Spectral Band | Wavelength (um) | Resolution (m)
   :---  | :--- | :---:
Band 10 Thermal Infrared (TIRS) 1 | 10.30 – 11.30 | 100 (30)
Band 11 Thermal Infrared (TIRS) 2 | 11.50 – 12.50 | 100 (30)

### EOS data processing levels

Before we talk about the collection structure of Landsat archive, let's first talk about the EOS (Earth Observing System) data processing levels.

EOS data products are processed at different levels from level 0 to level 4. The following table shows a summary of the various levels.

Data Level | Brief Description
    :---: | :---:
L0  | Raw instrument data
L1A | Reconstructed, raw instrument data, annotated with ancillary information
L1B | Level 1A data processed to sensor units. Geolocated and calibrated
L2  | Products derived from L1B
L3  | Gridded and quality controlled
L4  | Model output, derived variables

### Landsat Collection Tiers

In 2017, the USGS reorganized the Landsat archive into a tiered collection. The Landsat collection tiers are the inventory structure for Level-1 data products (including L1A and L1B) and are based on data quality and level of processing.

The tier definition purpose is to support easier identification of suitable scenes for time-series pixel-level analysis, and provide temporary data that are processed immediately upon downlink to be dispensed quickly in emergency response situations with limited calibration (from [<u>USGS</u>](https://landsat.usgs.gov/landsat-collections)).

There are three categories in the Landsat collection tiers definition: Tier 1, Tier 2, and Real-time tier. The following table summarize the three tiers:

Tier Level | Brief Description
    --- | :---:
Tier 1    | Highest available data quality. Meet formal geometric and radiometric quality criteria.
Tier 2    | Do not meet the Tier 1 criteria.
Real-time | Contain data immediately after acquisitions that use estimated parameters.

The transition delay for Landsat 8 from Real-time to Tier 1 or Tier 2 is within 14 to 16 days of data acquisition.

The Tier designation is visible at the end of the Landsat Product Identifier: T1 for Tier 1, T2 for Tier 2, and RT for Real-time.

### Landsat Product Identifiers

The following table summarizes the new Landsat collection 1 product identifier an the old Landsat pre-collection scene ID:

Landsat pre-collection scene ID | Landsat collection 1 product identifier
    :---: | :---:
**LXSPPPRRRYYYYDDDGSIVV** | **LXSS_LLLL_PPPRRR_YYYYMMDD_yyyymmdd_CC_TX**
L = Landsat | L = Landsat
X = sensor  | X = sensor
S = satellite | SS = satellite
              | LLLL = Processing correction level
PPP = WRS path | PPP = WRS path
RRR = WRS row | RRR = WRS row
YYYY = Acquisition year | YYYYMMDD = Acquisition year, month and day
DDD = Acquisition Julian day | yyyymmdd = Processing year, month and day
GSI = Ground station Identifier | CC = Collection number
VV = Archive version number | TX = Collection tier level
Example: _LC80220392016345LGN00_ | Example: _LC08_L1TP_022039_20161210_20170219_01_T1_

* X = Sensor (“C” = OLI/TIRS Combined, "O" = OLI-only, "T" = TIRS-only, “E” = ETM+, “T” = TM, “M”= MSS)
* SS = Satellite (e.g. “07” = Landsat 7, “08” = Landsat 8)
* LLLL = Processing correction level (L1TP/L1GT/L1GS)

### Download Landsat 8 data from Google Cloud Storage

The Landsat data are hosted publicly and free on Google Cloud Storage. You can use Google's `gsutil` tool to download the data programatically.

If you do not have `gsutil` installed on your laptop. Check Google's [<u>instruction</u>](https://cloud.google.com/storage/docs/gsutil_install#install) on how to install it.

To access the public datasets on Google Cloud Storage, you need to know the name of the bucket containing the data. A bucket is just a logical unit of storage for web storage service. You can think of it as a folder on your laptop's file system. The bucket name for Landsat data is "gcp-public-data-landsat". And the data are organized in the following directory structure:
`/[SENSOR_ID]/[COLLECTION]/[PATH]/[ROW]/[SCENE_ID]/`.

The components of this path are:
* `[SENSOR_ID]`: An identifier for the particular satellite and camera sensor.
* `[COLLECTION]`: `PRE` for pre-collection and `01` for collection 1.
* `[PATH]`: WRS path
* `[ROW]`: WRS row
* `[SCENE_ID]`: The unique scene ID.

Do remember that the data contained in one scene directory include all the bands and ancillary data.

You can use `gsutil`'s `ls` command to list all the data contained in the bucket. For example, if you want to see all the collection 1 data for Landsat 8, path 10, row 20, the command is:
```shell
$ gsutil ls gs://gcp-public-data-landsat/LC08/01/010/020/
```

You can also use `gsutil`'s `cp` command to copy the data from the cloud bucket to your local drive:
```shell
$ gsutil cp -r gs://gcp-public-data-landsat/LC08/01/010/020/LC08_L1TP_010020_20180227_20180308_01_T1/ .
```

I have written a python script to automate the work of downloading the Landsat 8 data from Google Cloud Storage. The script is hosted on my Github [<u>repo</u>](https://github.com/shuzhanfan/Landsat8-download). All you need to do is to give the script some parameters (path, row, and date), and the script will do all the hard work for you. It will download the data you specified, and put the data in a hierarchical directory which is organized as `/data/[PATH]-[ROW]/date`.
```shell
$ ./download_landsat8_new.py -p 22 -r 39 -d 20170401
```
