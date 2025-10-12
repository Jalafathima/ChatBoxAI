const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const Message = require("./models/Message");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

mongoose.connect("mongodb://localhost:27017/chatboxai")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // Send previous messages to the new user
  Message.find().sort({ timestamp: 1 }).then(messages => {
    socket.emit("loadMessages", messages);
  });

  socket.on("chatMessage", async (data) => {
    const newMsg = new Message({
      username: data.username,
      message: data.message
    });
    await newMsg.save();

    io.emit("message", newMsg); // broadcast to all users

    // Simple AI bot response
    if (data.message.toLowerCase().includes("hello")) {
      sendBotReply("Hello there!", socket);
    } else if (data.message.toLowerCase().includes("how are you")) {
      sendBotReply("I'm doing great! How about you?", socket);
    } else if (data.message.toLowerCase().includes("bye")) {
      sendBotReply("Goodbye! Come back soon 😊", socket);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

function sendBotReply(text, socket) {
  const botMsg = new Message({
    username: "ChatBoxAI 🤖",
    message: text
  });
  botMsg.save();
  io.emit("message", botMsg);
}

const PORT = 3000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
