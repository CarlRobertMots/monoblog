const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

let comments = [];
let idCounter = 1;

app.get("/health", (req, res) => {
  res.json({ status: "comments service ok" });
});

app.get("/posts/:id/comments", (req, res) => {
  const postId = Number(req.params.id);
  const postComments = comments.filter(c => c.postId === postId);
  res.json(postComments);
});

app.post("/posts/:id/comments", async (req, res) => {
  const postId = Number(req.params.id);
  const { content } = req.body; 

  if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }

  const comment = {
    id: idCounter++,
    postId: postId,
    content,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  comments.push(comment);

  // Send event to event-bus
  try {
    await axios.post("http://event-bus-srv:5005/events", {
      type: "CommentCreated",
      data: comment,
    });
  } catch (e) {
    console.log("Failed to publish CommentCreated:", e.message);
  }

  res.status(201).json(comment);
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  console.log("Event received in comments:", type);

  if (type === "CommentModerated") {
    const comment = comments.find(c => c.id === data.id);
    if (comment) {
      comment.status = data.status;
      try {
        await axios.post("http://event-bus-srv:5005/events", {
          type: "CommentUpdated",
          data: comment,
        });
      } catch (e) {
        console.log("Failed to publish CommentUpdated:", e.message);
      }
    }
  }
  res.send({});
});

app.listen(5001, () => {
  console.log("Comments service running on port 5001");
});