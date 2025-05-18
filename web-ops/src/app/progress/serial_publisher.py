import serial
import time
import paho.mqtt.client as mqtt
import re

# Konfigurasi Serial
SERIAL_PORT = '/dev/cu.usbserial-0001'  # Ganti sesuai port kamu
BAUD_RATE = 115200

# MQTT Config
MQTT_BROKER = 'localhost'
MQTT_PORT = 1883
MQTT_TOPIC_DATA = 'bountyhunter/scale'
MQTT_TOPIC_RESET = 'bountyhunter/reset'

# Global objek serial
ser = None

# Hubungkan ke broker MQTT
client = mqtt.Client()

# Callback saat berhasil terkoneksi
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("✅ Connected to MQTT broker")
        client.subscribe(MQTT_TOPIC_RESET)
    else:
        print(f"❌ MQTT connection failed with code {rc}")

# Callback saat menerima pesan
def on_message(client, userdata, msg):
    if msg.topic == MQTT_TOPIC_RESET:
        print("🔁 RESET command received via MQTT")
        if ser and ser.is_open:
            try:
                ser.write(b"RESET\n")
                print("📨 RESET sent to ESP32 via Serial")
            except Exception as e:
                print("⚠️ Failed to write RESET to serial:", e)

# Setup MQTT callbacks
client.on_connect = on_connect
client.on_message = on_message

# Hubungkan ke broker
try:
    client.connect(MQTT_BROKER, MQTT_PORT, 60)
except Exception as e:
    print("❌ Failed to connect to MQTT broker:", e)
    exit()

# Buka koneksi serial
try:
    ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
    time.sleep(2)
    ser.flushInput()  # Bersihkan buffer awal
    print("✅ Serial connected.")
except Exception as e:
    print("❌ Failed to open serial port:", e)
    exit()

# Jalankan listener MQTT di background
client.loop_start()

try:
    while True:
        try:
            line = ser.readline().decode('utf-8', errors='ignore').strip()
            if not line:
                continue

            print("📥 Serial:", line)

            match = re.search(r'Total botol.*?:\s*(\d+)', line)
            if match:
                bottle_count = int(match.group(1))
                print(f"📤 Publish MQTT: {bottle_count}")
                client.publish(MQTT_TOPIC_DATA, str(bottle_count))

        except UnicodeDecodeError:
            continue  # Abaikan karakter rusak

        time.sleep(0.05)

except KeyboardInterrupt:
    print("🛑 Program interrupted by user")

finally:
    if ser and ser.is_open:
        ser.close()
    client.loop_stop()
    client.disconnect()
    print("✅ Serial & MQTT closed cleanly")