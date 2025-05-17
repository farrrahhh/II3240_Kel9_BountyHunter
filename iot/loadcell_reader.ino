#include <WiFi.h>
#include <PubSubClient.h>

// WiFi Config
const char* ssid = "esp32";
const char* password = "bersamadia";

// MQTT Broker (HiveMQ public)
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;
const char* mqtt_topic = "bountyhunter/scale";  

WiFiClient espClient;
PubSubClient client(espClient);

// IR Sensor & LED config
const int IR_SENSOR_PIN = 15; 
const int LED_PIN = 4;

volatile int bottleCount = 0;
bool lastState = HIGH;

unsigned long lastSendTime = 0;
const unsigned long sendInterval = 2000;  

void IRAM_ATTR countBottle() {
  int currentState = digitalRead(IR_SENSOR_PIN);
  if (lastState == HIGH && currentState == LOW) {
    bottleCount++;
    Serial.print("Botol terdeteksi! Total: ");
    Serial.println(bottleCount);

    // Nyalakan LED selama 200ms
    digitalWrite(LED_PIN, HIGH);
    delay(200);  // NOT recommended inside ISR but shown for clarity (see note below)
    digitalWrite(LED_PIN, LOW);
  }
  lastState = currentState;
}

void setup_wifi() {
  Serial.print("Menyambungkan ke WiFi");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi tersambung");
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Menyambungkan ke MQTT...");
    if (client.connect("ESP32Client")) {
      Serial.println("Terhubung ke MQTT");
    } else {
      Serial.print("Gagal, rc=");
      Serial.print(client.state());
      delay(2000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);

  pinMode(IR_SENSOR_PIN, INPUT_PULLUP);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  attachInterrupt(digitalPinToInterrupt(IR_SENSOR_PIN), countBottle, CHANGE);

  Serial.println("Sensor IR & LED diinisialisasi.");
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  if (millis() - lastSendTime > sendInterval) {
    lastSendTime = millis();

    char payload[16];
    itoa(bottleCount, payload, 10);
    client.publish(mqtt_topic, payload);

    Serial.print("MQTT Publish: ");
    Serial.println(payload);
  }
}