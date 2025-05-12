// index.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mqtt = require("mqtt");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const mqttClient = mqtt.connect("mqtt://broker.hivemq.com"); // pakai public broker

// MQTT Subscription
mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
  mqttClient.subscribe("bountyhunter/botol");
});

mqttClient.on("message", (topic, message) => {
  const data = message.toString();
  console.log(`MQTT Message: ${data}`);

  // Kirim ke client dashboard via WebSocket
  io.emit("botol_terbaru", data);
});

// HTTP route
app.get("/api/ping", (req, res) => {
  res.json({ status: "OK", message: "HTTP is running" });
});

// WebSocket
io.on("connection", (socket) => {
  console.log("Client connected to WebSocket");
});

// Start Server
server.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});
