---
layout:         post
title:          A data visualization of the impact of tariff spat on midterm election
subtitle:
card-image:     /assets/images/wallstreet.jpg
date:           2018-04-09 18:00:00
tags:           [life, data&nbsp;mining]
categories:     [politics, python, data&nbsp;mining]
post-card-type: image
---

The tarrif spat between US and China is on the brink of escalating to a full-blown trade war, which would be a disaster for the global economy. On Tuesday, April 3rd, the Trump administration proposed tarrifs on \$50 billion worth of Chinese goods. This includes a list of  1,300 Chinese exports that could be targeted for tariffs. China fired back by announcing a possible 25 precent tarrif on \$50 billion worth of US exports. The 106 affected products will include soybeans, automobile vehicles, and aircrafts, etc.

One of the most likely affacted groups by the conflict is the hundreds of thousands of American soybean farmers. China was the US' largest soybean buyer last year, gobbling up $12.3 billion worth of soybeans, which equaled 60 precent of the US annual soybean exports overall. If the retaliatory tarrifs took into effect, it would be a disaster for farmers across farm states like Illinois, Iowa, and Indiana, etc., which happened to go for Trump during the 2016 presidential election.

In this blog post, I'm going to use data analysis and visualization tools to map and visualize the soybeans production as well as 2016 presidential election by the county level on an interactive map. I'm also going to display the current partisan US congress (including US senate and US house) members along with the annual soybeans production on the same map. Hopefully, this will give you some insight about how the possible tariffs might have an impact on the upcoming 2018 midterm election.

### Tools and packages used

The tool used for visualizing data on a map is called [<u>Folium</u>](https://github.com/python-visualization/folium). It enables us to manipulate the data in Python, and then visualize it in on a [<u>Leaflet</u>](http://leafletjs.com) map. The data manipulation packages we use are **pandas**, **numpy** and **json**. We basically use pandas and json to read csv and json files and do some preprocessing work. The preprocessed data are then fed into Folium for drawing and showing on the map.

So, let's get started and jump into the code and see the results!

### Import packages used


```python
import os
import numpy as np
import pandas as pd
import json
import folium
import branca
import branca.colormap as cm
```

### Read data files

Quite a bunch of data files are needed. And it took time to find the correct data. I already put all the data in my [<u>Github repository</u>](https://github.com/shuzhanfan/map_vis_soybeans_elction). Feel free to download them. The 2016 soybeans production by county data was acquired from the [<u>USDA</u>](https://www.nass.usda.gov/index.php) (United States Department of Agriculture) website. The 2016 county level presidential eleciton results was obtained from a [<u>Github repo</u>](https://github.com/tonmcg/County_Level_Election_Results_12-16). The US senate an US house members data were from another [<u>Github repo</u>](https://github.com/CivilServiceUSA/us-senate).


```python
soybeans     = pd.read_csv("soybeans_production_2016.csv", thousands=",")
election     = pd.read_csv("presidential_election_2016.csv")
senate       = pd.read_csv("us_senate_2017.csv")
house        = pd.read_csv("us_house_2017.csv")
state_fips   = pd.read_csv("state_fips.csv")
cd113_json   = json.load(open("cd113.json"))
county_geo   = os.path.join("./", "us_counties.json")
county_geo_1 = os.path.join("./", "us_counties.json")
state_geo    = os.path.join("./", "us_states.json")
```

### Data manipulation/preprocessing


```python
#2016 Soybeans production
soybeans = soybeans.dropna(subset=["County ANSI"])
state    = soybeans["State ANSI"]
county   = soybeans["County ANSI"]
soybeans["State ANSI"]  = soybeans["State ANSI"].astype(str)
soybeans["Value"]       = soybeans["Value"].astype(np.int64)
soybeans["County ANSI"] = soybeans["County ANSI"].astype(np.int64).astype(str)

def state_ansi(row):
    state = row["State ANSI"]
    if len(state) == 1:
        return "0"+state
    else:
        return state

def county_ansi(row):
    county = row["County ANSI"]
    if len(county) == 1:
        return "00"+county
    elif len(county) == 2:
        return "0"+county
    else:
        return county

soybeans["State ANSI"]  = soybeans.apply(state_ansi, axis=1)
soybeans["County ANSI"] = soybeans.apply(county_ansi, axis=1)
soybeans["FIPS"]        = soybeans["State ANSI"] + soybeans["County ANSI"]


#2016 presidential elections
election["combined_fips"] = election["combined_fips"].astype(str)

def fips(row):
    one_fips = row["combined_fips"]
    if len(one_fips) == 4:
        return "0"+one_fips
    else:
        return one_fips

election["combined_fips"] = election.apply(fips, axis=1)


#Current US senate
senate_df = senate[["state_code", "party"]]

def party_coder(row):
    party = row["party"]
    if party == "democrat":
        return 2
    elif party == "independent":
        return 1
    else:
        return -2

senate_df["party"] = senate_df.apply(party_coder, axis=1)
senate_df_df       = senate_df.groupby("state_code")["party"].sum()
senate_parties     = pd.DataFrame({'state_code':senate_df_df.index, 'party':senate_df_df.values})


#Current US house
house              = house[["state_code", "district", "party"]]
state_fips         = state_fips[["state_abbr", "fips"]]
state_fips.columns = ["state_code", "state_fips"]
house_fips         = pd.merge(house, state_fips, on="state_code", how="outer")
def district_coder(row):
    district = row["district"]
    if np.isnan(district):
        return 0
    else:
        return district

def district_fips(row):
    district = row["district"]
    if len(district) == 1:
        return "0"+district
    else:
        return district

def state_fips(row):
    state_fp = row["state_fips"]
    if len(state_fp) == 1:
        return "0"+state_fp
    else:
        return state_fp

house_fips["district"]            = house_fips.apply(district_coder, axis=1)
house_fips["district"]            = house_fips["district"].astype(np.int64).astype(str)
house_fips["state_fips"]          = house_fips["state_fips"].astype(str)
house_fips["district"]            = house_fips.apply(district_fips, axis=1)
house_fips["state_fips"]          = house_fips.apply(state_fips, axis=1)
house_fips["state_district_fips"] = house_fips["state_fips"] + house_fips["district"]
cd113_geometries                  = cd113_json["objects"]["cd113"]["geometries"]

for item in cd113_geometries:
    item["properties"]["CD113FP"] = item["properties"]["STATEFP"]+item["properties"]["CD113FP"]
cd113_json["objects"]["cd113"]["geometries"] = cd113_geometries
```

### Create a base map


```python
m = folium.Map(location=[40, -102], zoom_start=4, tiles="cartodbpositron")
```

### Add a TopoJson layer to the map for 2016 presidential election


```python
colorscale_election = branca.colormap.linear.RdBu.scale(0,1)
election_series = election.set_index("combined_fips")["per_dem"]
def style_function_election(feature):
    election_res = election_series.get(feature["id"][-5:], None)
    return {
        'fillOpacity': 1,
        'weight': 0.3,
        'color': 'black',
        'fillColor': 'white' if election_res is None else colorscale_election(election_res)
    }

folium.TopoJson(
    open(county_geo),
    "objects.us_counties_20m",
    name="2016 presidential election",
    style_function=style_function_election
).add_to(m)
```

### Add another TopoJson layer to the map for 2016 soybeans production


```python
colorscale_soybeans = branca.colormap.linear.YlGn.scale(10000, 8000000)
soybean_series = soybeans.set_index("FIPS")["Value"]

step_colorscale_soybeans = colorscale_soybeans.to_step(n=7, data=[0, 10000, 250000, 750000, 2000000, 4000000, 8000000], round_method="int")

def style_function_soybeans(feature):
    soybean_prod = soybean_series.get(feature["id"][-5:], None)
    return {
        'fillOpacity': 0.6,
        'weight': 0.3,
        'color': 'black',
        'fillColor': 'white' if soybean_prod is None else step_colorscale_soybeans(soybean_prod)
    }

folium.TopoJson(
    open(county_geo),
    "objects.us_counties_20m",
    name="2016 soybean production",
    style_function=style_function_soybeans
).add_to(m)
```

### Now we can visualize the data on one map

Hover the mouse on the top-right control icon. You can select and deselect different data layers to visualize on map.


```python
folium.LayerControl().add_to(m)
m
```

<iframe src="/assets/images/map1.html" height="400px" width="100%"></iframe>


As you can see from the map above, most soybeans production areas are in the central east. These areas also shared a good amount of votes for Trump during the 2016 presidential election.

### Add a GeoJson layer to the map for current US senate members


```python
senate_series = senate_parties.set_index("state_code")["party"]
def senate_color_function(party):
    if party == -4:  #2 gop
        return 'red'
    elif party == 0: #1 gop 1 dem
        return '#712ccc'
    elif party == 4: #2 dem
        return 'blue'
    else:            #ind and gop/dem
        return '#d6b915'

def style_function_senate(feature):
    senate_par = senate_series.get(feature["id"], None)
    return {
        'fillOpacity': 1,
        'weight': 1,
        'color': 'white',
        'fillColor': '#black' if senate_par is None else senate_color_function(senate_par)
    }

folium.GeoJson(state_geo,
    name="2017 US senate",
    style_function=style_function_senate
).add_to(m)
```

There are two senate members for each state. In the US senate map, blue means this state has two senates from Democrat, red means this state has two senates from Republican, purple means one from Democrat and one from Republican, and gold means there is one senate member from Independent for this state.

### Add a TopoJson layer to the map for current US house members


```python
house_series = house_fips.set_index(["state_district_fips"])["party"]

def house_color_function(party):
    if party == "republican":
        return "red"
    else:
        return "blue"

def style_function_house(feature):
    house_party  = house_series.get(feature["properties"]["CD113FP"], None)
    return {
        'fillOpacity': 1,
        'weight': 0.3,
        'color': 'black',
        'fillColor': 'black' if house_party is None else house_color_function(house_party)
    }

folium.TopoJson(
    cd113_json,
    "objects.cd113",
    name="2017 US house",
    style_function=style_function_house
).add_to(m)
```

The House is composed of Representatives who sit in congressional districts that are allocated to each of the 50 states on a basis of population as measured by the U.S. Census, with each district entitled to one representative ([wiki page](https://en.wikipedia.org/wiki/United_States_House_of_Representatives)). There are currently 435 voting members sitting in the house.

### We add all the layers to the map and visualize them.

Note: Usually, you should only run the `folium.LayerControl().add_to(m)` command one time at the end of the code file. Your map will look messed up if you run them multiple times. In this post, since I want to show different combination of datesets on the map, I run them multiple times. The trick I did by not introducing any error is to restart the notebook every time I show a map but do not clear the output.


```python
folium.LayerControl().add_to(m)
m
```

As we play around a bit with the map, we can see that most of the soybean production areas overlap with the GOP congressional districts, except for some areas in Minnesota, which is traditionally a blue state. This is in line with our assumption that if the trade war does begin and the Chinese retaliatory tariff on soybean exports will very likely play a role in the incoming midterm election in November 2018. Voters from farm states gave big supports for Trump during 2016 presidential election. And if the farmers start to feel having a hard time because of the trade dispute, they might end up showing their anger with votes, which the Trump administration would not want to see.

<iframe src="/assets/images/map2.html" height="400px" width="100%"></iframe>

### Conclusion

I had the idea of mapping both soybeans production and election results on the same map when I was reading some feeds from Reddit, where one guy was saying he would want to see a map showing both of the data on one map and compare the overlaps. I then started digging up the data, packing up the skills I'm proficient with, and gearing up to make the map. I'm not going to argue with you here which one (either China or Trump) we should blame for. I'm just showing you what the data illustrate. But personally, I think it's a bad idea to forcibly impose any tariff upon imports since first, free trade is essential for the prosperity of global economy and every country is a beneficiary and second, other countries would undoubtedly retaliate by imposing same tariffs on your exports if you impose on theirs, this is a lose-lose proposition.
