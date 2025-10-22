const express = require('express');
const cors = require('cors');
const commentsRouter = require('./routes');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/comments', commentsRouter);

app.get('/', (req, res) => {
  res.send('Comments service running');
});
app.post('/events', (req, res) => {
  console.log('Received Event:', req.body.type);
  res.send({});
});

app.listen(PORT, () => {
  console.log(`Comments service running on http://localhost:${PORT}`);
});