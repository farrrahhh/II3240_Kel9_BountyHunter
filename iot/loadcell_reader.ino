const int IR_SENSOR_PIN = 15;  // Sensor IR di pin D15

int bottleCount = 0;
bool lastState = HIGH;

void setup() {
  Serial.begin(115200);
  pinMode(IR_SENSOR_PIN, INPUT_PULLUP);
  Serial.println("IR sensor ready. Waiting for bottles...");
}

void loop() {
  // Cek perintah dari komputer (reset)
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    if (cmd == "RESET") {
      bottleCount = 0;
      Serial.println("Bottle count reset.");
    }
  }

  // Deteksi transisi HIGH → LOW
  bool currentState = digitalRead(IR_SENSOR_PIN);

  if (lastState == HIGH && currentState == LOW) {
    bottleCount++;
    Serial.print("Total botol terdeteksi: ");
    Serial.println(bottleCount);
    delay(250); // debounce sederhana
  }

  lastState = currentState;
}