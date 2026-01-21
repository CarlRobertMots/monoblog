const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

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

app.listen(5002, async () => {
  console.log("Query service running on port 5002");

  try {
    const { data: events } = await axios.get("http://event-bus-srv:5005/events");
    for (const event of events) {
      handleEvent(event);
    }
    console.log(`Query synced ${events.length} events`);
  } catch (e) {
    console.log("Query sync failed:", e.message);
  }
});