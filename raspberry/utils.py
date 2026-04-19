import json
import logging
import os

import requests

CACHE_PATH = "cache/"
CACHE_FILENAME = "queue.json"
CACHE_FILE = os.path.join(CACHE_PATH, CACHE_FILENAME)


def save_to_cache(payload):
    cache = []
    os.makedirs(CACHE_PATH, exist_ok=True)
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, "r") as f:
            try:
                cache = json.load(f)
            except json.JSONDecodeError:
                cache = []

    cache.append(payload)
    with open(CACHE_FILE, "w") as f:
        json.dump(cache, f)
    logging.warning(f"API unreachable, data saved to cache. Cache size: {len(cache)}")


def process_cache(api_url, api_key):
    if not os.path.exists(CACHE_FILE):
        return

    logging.info("Trying to resend cached data...")
    with open(CACHE_FILE, "r") as f:
        cache = json.load(f)

    remaining_cache = []
    headers = {"Content-Type": "application/json", "x-api-key": api_key}

    for item in cache:
        try:
            url = f"{api_url}/data/meteo"
            response = requests.post(url, json=item, headers=headers, timeout=5)
            response.raise_for_status()
        except Exception:
            remaining_cache.append(item)

    if not remaining_cache:
        os.remove(CACHE_FILE)
        logging.info("Cache cleared ! All data sent successfully.")
    else:
        with open(CACHE_FILE, "w") as f:
            json.dump(remaining_cache, f)
        logging.warning(
            f"Cache processed but {len(remaining_cache)} items remain. Will retry later."
        )


def send_to_api(payload, api_url, api_key):
    headers = {"Content-Type": "application/json", "x-api-key": api_key}
    url = f"{api_url}/data/meteo"

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=5)
        response.raise_for_status()
        if os.path.exists(CACHE_FILE):
            process_cache(api_url, api_key)
    except Exception:
        save_to_cache(payload)
