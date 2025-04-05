// index.js
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const PORT = 3000;

app.use(bodyParser.json());
const chatHistory = [
  {
    id: 1,
    name: "Assignment Help",
    lastRole: Role.user,
    lastMessage: "Can you explain the assignment requirements?",
    courseName: "Mathematics",
    university: "RMIT",
    userId: 1,
  },
  {
    id: 2,
    name: "Project Questions",
    lastRole: Role.assistant,
    lastMessage: "Sure! What do you need help with?",
    courseName: "Mathematics",
    university: "RMIT",
    userId: 1,
  },
  {
    id: 3,
    name: "Exam Preparation",
    lastRole: Role.user,
    lastMessage: "What topics should I focus on for the exam?",
    courseName: "Physics",
    university: "RMIT",
    userId: 2,
  },
];

const chats = chatHistory.map((chat, index) => ({
  id: chat.id,
  name: chat.name,
  messages: [
    {
      id: `${index + 1}`,
      content: chat.lastMessage,
      role: chat.lastRole,
      timestamp: new Date(),
    },
  ],
  courseName: chat.courseName,
  university: chat.university,
  userId: chat.userId,
}));

const user = {
  id: 1,
  name: "John Doe",
  email: "john.doe@gmail.com",
  avatar: "string",
  courses: ["Mathematics", "Physics"],
  university: "RMIT",
  chatHistory: chatHistory,
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
