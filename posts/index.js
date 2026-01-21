const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());

const allowedOrigins = [
  "https://blog.local",
  "http://blog.local",
  "http://localhost:3000",
];

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("CORS blocked: " + origin));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
};

app.use(cors(corsOptions));


let posts = [];
let idCounter = 1;

app.get("/health", (req, res) => {
  res.json({ status: "posts service ok" });
});

app.get("/posts", (req, res) => {
  res.json(posts);
});

app.post("/posts/create", async (req, res) => {
  const { title, body } = req.body;
  
  if (!title || !body) {
    return res.status(400).json({ message: "title and body are required" });
  }

  const post = {
    id: idCounter++,
    title,
    body,
    createdAt: new Date().toISOString(),
    commentsCount: 0,
  };

  posts.unshift(post);

  // Communicate with Event Bus via Service Name
  try {
    await axios.post("http://event-bus-srv:5005/events", {
      type: "PostCreated",
      data: post,
    });
  } catch (e) {
    console.log("Failed to publish PostCreated:", e.message);
  }

  res.status(201).json(post);
});

app.post("/events", (req, res) => {
  console.log("Event received in posts:", req.body.type);
  res.send({});
});

app.listen(5000, () => {
  console.log("Posts service listening on 5000");
});