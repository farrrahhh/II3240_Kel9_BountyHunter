#include <WiFi.h>
#include <PubSubClient.h>
#include "HX711.h"

// WiFi Config
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// MQTT Broker (HiveMQ public)
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;
const char* mqtt_topic = "bountyhunter/scale";

WiFiClient espClient;
PubSubClient client(espClient);

// HX711 Pins
const int DOUT_PIN = 15;
const int SCK_PIN = 4;

HX711 scale;

void setup_wifi() {
  Serial.print("Connecting to WiFi");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP32Client")) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      delay(2000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  setup_wifi();

  client.setServer(mqtt_server, mqtt_port);

  scale.begin(DOUT_PIN, SCK_PIN);
  scale.set_scale(-7050); // Ganti dengan hasil kalibrasi
  scale.tare(); // Reset awal

  Serial.println("Scale initialized.");
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  float weight = scale.get_units(10); // ambil rata-rata dari 10 pembacaan
  Serial.print("Weight: ");
  Serial.print(weight, 4);
  Serial.println(" kg");

  // Publish ke MQTT
  char payload[32];
  dtostrf(weight, 1, 4, payload); // ubah float ke string
  client.publish(mqtt_topic, payload);

  delay(1000); // update tiap 1 detik
}