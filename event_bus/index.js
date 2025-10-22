const { default: axios } = require('axios');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 5003;

app.use(express.json());

app.post('/events', (req, res) => {
    const event = req.body;
  console.log('Received Event:', event.type);

  axios.post('http://localhost:5000/events', event).catch(err => {
    console.error('Error forwarding event to Posts service:', err.message);
  });
  
  axios.post('http://localhost:5001/events', event).catch(err => {
    console.error('Error forwarding event to Comments service:', err.message);
  });
  axios.post('http://localhost:5002/events', event).catch(err => {
    console.error('Error forwarding event to Query service:', err.message);
  });
  
  res.json({ status: 'OK' });
});


app.listen(PORT, () => {
  console.log(`Events service running on http://localhost:${PORT}`);
});