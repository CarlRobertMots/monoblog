const express = require('express');
const cors = require('cors');
const commentsRouter = require('./routes');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Central comments store
let comments = [];

app.use('/comments', commentsRouter(comments)); // pass comments to router

const handleEvent = (event) => {
    const { type, data } = event;

    if (type === 'CommentModerated') {
        const comment = comments.find(c => c.id === data.id);
        if (comment) {
            comment.status = data.status;
            console.log(`Comment ${data.id} status updated to ${data.status}`);
        }
    }
};

app.get('/', (req, res) => {
  res.send('Comments service running');
});

app.post('/events', (req, res) => {
  handleEvent(req.body);
  console.log('Received Event:', req.body.type);
  res.send({});
});

app.listen(PORT, () => {
  console.log(`Comments service running on http://localhost:${PORT}`);
});
