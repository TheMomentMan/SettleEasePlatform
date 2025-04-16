#APi of schools in the vicinity of a given location
import requests
import json
import pandas as pd

#API link for schools in Massachusetts
api_link="https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/us-public-schools/records?select=name%2Caddress%2Czip%2Czip4%2Ctelephone%2Ccity%2Cstate&where=state%3D%22MA%22&order_by=name&limit=50&timezone=America%2FNew_York"

#fetch the data from the API
response = requests.get(api_link)

#check if the response is successful
if response.status_code == 200:
    # Parse the response JSON
    data = response.json()
    
    # Save the data to a JSON file
    with open("schools_data.json", "w") as json_file:
        json.dump(data, json_file, indent=4)
    print("Data saved to schools_data.json")
else:
    print(f"Failed to fetch data. Status code: {response.status_code}")