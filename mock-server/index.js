// index.js
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const PORT = 3000;

app.use(bodyParser.json());

// Dummy data
let user = {
  id: 1,
  name: "Jane Doe",
  email: "jane@example.com",
  avatar: "https://cdn.example.com/avatar.jpg",
  courses: ["Math 101", "CS 202"],
  university: "Mock University",
  chatHistory: [
    { id: 101, name: "Algebra Q&A" },
    { id: 102, name: "Intro to CS" },
  ],
};

const chats = {
  101: {
    id: 101,
    name: "Algebra Q&A",
    messages: [
      {
        id: "m1",
        content: "What is x in 2x+3=7?",
        role: "User",
        timestamp: new Date().toISOString(),
      },
      {
        id: "m2",
        content: "x = 2",
        role: "Assistant",
        timestamp: new Date().toISOString(),
      },
    ],
    courseName: "Math 101",
    university: "Mock University",
    userId: 1,
  },
};

// Middleware to simulate auth
app.use((req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token && req.path !== "/api/login") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
});

// GET /api/user
app.get("/api/user", (req, res) => {
  res.status(200).json(user);
});

// GET /api/courses
app.get("/api/courses", (req, res) => {
  res.status(200).json(user.courses);
});

// GET /api/chat/:chatId
app.get("/api/chat/:chatId", (req, res) => {
  const chat = chats[req.params.chatId];
  if (!chat) return res.status(404).json({ message: "Chat not found" });
  res.status(200).json(chat);
});

// POST /api/login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    return res.status(200).json(user);
  }
  res.status(400).json({ message: "Missing credentials" });
});

// POST /api/user/avatar
app.post("/api/user/avatar", (req, res) => {
  const { avatar } = req.body;
  if (avatar) {
    user.avatar = avatar;
    return res.status(200).json(user);
  }
  res.status(400).json({ message: "Missing avatar URL" });
});

app.listen(PORT, () => {
  console.log(`Mock server running at http://localhost:${PORT}`);
});
