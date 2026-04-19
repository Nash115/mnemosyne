import logging
import os
import random
import time
from datetime import datetime

import requests
from dotenv import load_dotenv
from utils import send_to_api

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
load_dotenv()

API_URL = os.getenv("API_URL", "http://localhost:5042")
API_KEY = os.getenv("API_KEY", "")


def main():
    logging.info(f"Starting emulator with API_URL={API_URL}")
    base_temp = 22.0
    base_hum = 45.0

    while True:
        base_temp += random.uniform(-0.5, 0.5)
        base_hum += random.uniform(-1.0, 1.0)
        send_to_api(
            {
                "timestamp": datetime.now().astimezone().isoformat(),
                "temperature": round(base_temp, 1),
                "humidity": round(base_hum, 1),
            },
            API_URL,
            API_KEY,
        )
        time.sleep(60)


if __name__ == "__main__":
    main()
