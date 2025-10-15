const express = require('express');
const cors = require('cors');
const postsRouter = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/posts', postsRouter);

app.get('/', (req, res) => {
  res.send('Posts service running');
});

app.listen(PORT, () => {
  console.log(`Posts service running on http://localhost:${PORT}`);
});