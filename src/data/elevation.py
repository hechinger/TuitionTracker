import csv
import requests
import json

# Read the .csv file

urlA = "https://nationalmap.gov/epqs/pqs.php?x="
urlB = "&y="
urlC = "&units=Feet&output=json"

data = csv.DictReader(open("elelevation.csv","r"))


with open('ele.csv', 'w') as csvfile: 
    csvwriter = csv.writer(csvfile) 
    csvwriter.writerow(['unitid','school','lat', 'lng','elevation']) 
    for row in data:
        lat = row['Latitude location of institution (HD2020)']
        lng = row['Longitude location of institution (HD2020)']

        r = requests.get(urlA + lng + urlB + lat + urlC)
        res = r.json()
        ele = res['USGS_Elevation_Point_Query_Service']['Elevation_Query']['Elevation']
        print(ele)
        csvwriter.writerow([row['UnitID'],row['Institution Name'],lat,lng,ele])