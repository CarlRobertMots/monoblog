const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const PORT = 5004;

app.post('/events', (req, res) => {
    const { type, data } = req.body;

    if (type === 'CommentCreated') {
        const status = data.content.includes('orange') ? 'rejected' : 'approved';

        axios.post('http://localhost:5003/events', {
            type: 'CommentModerated',
            data: { ...data, status }
        }).catch(err => console.error('Error sending CommentModerated', err));
    }

    res.json({ status: 'OK' });
});

app.listen(PORT, () => {
    console.log(`Moderation service running on port ${PORT}`);
});
