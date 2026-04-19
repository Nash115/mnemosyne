import json
import logging
import os
import time
from datetime import datetime

import requests
import serial
import serial.tools.list_ports
from dotenv import load_dotenv
from utils import send_to_api

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)

load_dotenv()

API_URL = os.getenv("API_URL", "http://localhost:5042")
API_KEY = os.getenv("API_KEY", "")
SERIAL_PORT = os.getenv("SERIAL_PORT", "AUTO")


def get_serial_port():
    if SERIAL_PORT != "AUTO":
        return SERIAL_PORT

    ports = list(serial.tools.list_ports.comports())
    if not ports:
        raise RuntimeError("No serial ports found.")

    logging.info(f"Automatic serial port detection : using {ports[0].device}")
    return ports[0].device


def main():
    port = get_serial_port()
    ser = serial.Serial(port, 9600, timeout=2)

    current_minute = datetime.now().minute
    temperatures = []
    humidities = []

    logging.info("Starting serial reading loop...")

    line = ""
    while True:
        try:
            line = ser.readline().decode("utf-8").strip()
            if not line:
                continue

            data = json.loads(line)
            temp = float(data["temperature"])
            hum = float(data["humidite"])

            now = datetime.now()

            if now.minute != current_minute:
                if temperatures and humidities:
                    timestamp_iso = now.astimezone().isoformat()
                    avg_temp = sum(temperatures) / len(temperatures)
                    avg_hum = sum(humidities) / len(humidities)

                    send_to_api(
                        {
                            "timestamp": timestamp_iso,
                            "temperature": round(avg_temp, 1),
                            "humidity": round(avg_hum, 1),
                        },
                        API_URL,
                        API_KEY,
                    )

                current_minute = now.minute
                temperatures.clear()
                humidities.clear()

            temperatures.append(temp)
            humidities.append(hum)

        except json.JSONDecodeError:
            logging.warning(f"Ignored : invalid JSON : {line}")
        except Exception as e:
            logging.error(f"Unexpected error : {e}")
            time.sleep(1)


if __name__ == "__main__":
    main()
