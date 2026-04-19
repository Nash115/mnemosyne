#include <DHT.h>

const int dataPin = 2;
DHT dht (dataPin, DHT11);

void setup() {
  dht.begin();
  Serial.begin(9600);
}


void loop() {

  float temp = dht.readTemperature();
  float hum = dht.readHumidity();

  Serial.println("{\"temperature\":"+ String(temp) + ", \"humidite\":" + String(hum) + "}");

  delay(1000);

}
