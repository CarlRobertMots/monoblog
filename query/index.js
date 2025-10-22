const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5002;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    const { type, data } = req.body;

    if (type === 'PostCreated') {
        const { id, title } = data;
        posts[id] = { id, title, comments: [] };
    }

    if (type === 'CommentCreated') {
        const { id, content, postId } = data;
        const post = posts[postId];
        if (post) {
            post.comments.push({ id, content });
        }
    }
    if (type === 'CommentModerated') {
        const post = posts[data.postId];
        const comment = post.comments.find(comment => comment.id === data.id);
        comment.status = data.status;
        comment.content = data.content;
    }

    console.log('Current Posts:', JSON.stringify(posts));
    res.json({ posts });
});


app.listen(PORT, () => {
    console.log(`Query service running on http://localhost:${PORT}`);
});