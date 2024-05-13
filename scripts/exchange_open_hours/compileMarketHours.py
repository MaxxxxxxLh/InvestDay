import os
import requests
import json

# Get the directory of the current script
script_dir = os.path.dirname(os.path.realpath(__file__))

# Fetch the list of exchanges
exchanges_url = "https://financialmodelingprep.com/api/v3/exchanges-list?apikey=APIKEY"
response = requests.get(exchanges_url)
exchanges = response.json()

# For each exchange, fetch the market open data
for exchange in exchanges:
    market_open_url = f"https://financialmodelingprep.com/api/v3/is-the-market-open?exchange={exchange}&apikey=APIKEY"
    response = requests.get(market_open_url)
    market_open_data = response.json()

    # Build the path to the file
    file_path = os.path.join(script_dir, f"{exchange}_open_hours.json")

    # Ensure the directory exists
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    # Save the JSON data to a file
    with open(file_path, "w") as file:
        json.dump(market_open_data, file)
    print ("Written ", exchange, "to", file_path)