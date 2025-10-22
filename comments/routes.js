const express = require('express');
const axios = require('axios'); // to call Posts API
const router = express.Router();

let comments = [];

const POSTS_API = 'http://localhost:5000/posts';

// Get comments for a post
router.get('/:postId', async (req, res) => {
    const postId = Number(req.params.postId);

    // Check if post exists via Posts API
    try {
        await axios.get(`${POSTS_API}/${postId}`);
    } catch (err) {
        return res.status(404).json({ error: 'Post not found' });
    }

    const postComments = comments.filter(c => c.postId === postId);
    res.json(postComments);
});

/// Add comment to a post
router.post('/:postId', async (req, res) => {
    const postId = Number(req.params.postId);

    // Verify post exists
    try {
        await axios.get(`${POSTS_API}/${postId}`);
    } catch (err) {
        return res.status(404).json({ error: 'Post not found' });
    }

    const newComment = {
        id: Date.now(),
        postId,
        content: req.body.content
    };
    comments.push(newComment);

    // Send event after creating comment
    axios.post('http://localhost:5003/events', {
        type: 'CommentCreated',
        data: newComment
    }).catch(err => {
        console.error('Error sending event to Event Bus:', err.message);
    });

    res.status(201).json(newComment);
});


module.exports = router;