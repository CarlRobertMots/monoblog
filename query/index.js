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

const posts = {};

function handleEvent(event) {
  const { type, data } = event;

  if (type === "PostCreated") {
    posts[data.id] = { ...data, comments: [] };
  }

  if (type === "CommentCreated") {
    const post = posts[data.postId];
    if (post) {
      post.comments.push({ ...data, status: data.status || "pending" });
    }
  }

  if (type === "CommentUpdated") {
    const post = posts[data.postId];
    if (post) {
      const idx = post.comments.findIndex(c => c.id === data.id);
      if (idx !== -1) {
        post.comments[idx] = data;
      }
    }
  }
}

app.post("/events", (req, res) => {
  handleEvent(req.body);
  res.send({});
});

app.get("/posts", (req, res) => {
  res.send(Object.values(posts));
});

app.get("/posts/:id", (req, res) => {
    const post = posts[req.params.id];
    res.send(post || {});
});

app.listen(5002, async () => {
  console.log("Query service running on port 5002");

  try {
    const res = await axios.get("http://event-bus-srv:5005/events");
    const events = res.data;
    
    for (const event of events) {
      handleEvent(event);
    }
    console.log(`Query synced ${events.length} events`);
  } catch (e) {
    console.log("Query sync failed:", e.message);
  }
});