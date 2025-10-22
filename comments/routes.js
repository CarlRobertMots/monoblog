const express = require('express');
const axios = require('axios');

module.exports = (comments) => {
    const router = express.Router();
    const POSTS_API = 'http://localhost:5000/posts';

    router.get('/:postId', async (req, res) => {
        const postId = Number(req.params.postId);
        try {
            await axios.get(`${POSTS_API}/${postId}`);
        } catch (err) {
            return res.status(404).json({ error: 'Post not found' });
        }
        const postComments = comments.filter(c => c.postId === postId);
        res.json(postComments);
    });

    router.post('/:postId', async (req, res) => {
        const postId = Number(req.params.postId);
        try {
            await axios.get(`${POSTS_API}/${postId}`);
        } catch (err) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const newComment = {
            id: Date.now(),
            postId,
            content: req.body.content,
            status: 'pending'
        };
        comments.push(newComment);

        await axios.post('http://localhost:5003/events', {
            type: 'CommentCreated',
            data: newComment
        });

        res.status(201).json(newComment);
    });

    return router;
};
