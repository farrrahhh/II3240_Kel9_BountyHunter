import serial

# Ganti '/dev/ttyUSB0' sesuai dengan port ESP32 kamu
# Windows: biasanya "COM3", Mac: "/dev/cu.usbserial-0001", Linux: "/dev/ttyUSB0"
PORT = "/dev/cu.usbserial-0001"
BAUD_RATE = 115200

try:
    ser = serial.Serial(PORT, BAUD_RATE, timeout=1)
    print(f"Terhubung ke {PORT} pada baudrate {BAUD_RATE}")
except Exception as e:
    print(f"Gagal membuka port serial: {e}")
    exit()

print("Menunggu data dari ESP32...\n")

try:
    while True:
        line = ser.readline().decode("utf-8").strip()
        if line:
            print(f"Jumlah botol: {line}")
except KeyboardInterrupt:
    print("\nDihentikan oleh pengguna.")
    ser.close()