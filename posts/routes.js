const express = require('express');
const router = express.Router();

let posts = [];

router.get('/', (req, res) => res.json(posts));

router.post('/', (req, res) => {
    const newPost = {
        id: Date.now(),
        title: req.body.title,
        content: req.body.content
    };
    posts.push(newPost);
    res.status(201).json(newPost);
});

router.get('/:id', (req, res) => {
    const postId = Number(req.params.id);
    const post = posts.find(p => p.id === postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
});

module.exports = router;