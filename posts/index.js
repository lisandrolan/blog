const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const { default: axios } = require('axios');


const generateRandomId = () => randomBytes(4).toString('hex');
const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 4000;

const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/posts', async (req, res) => {
  const newPost = {
    id: randomBytes(4).toString('hex'),
    title: req.body.title
  };
  posts[newPost.id] = newPost;

  await axios.post('http://localhost:4005/events', {
    type: 'PostCreated',
    data: newPost
  }).catch((err) => {
    console.log('Error sending event:', err.message);
  });

  res.status(201).send(newPost)
});

app.post('/events', (req, res) => {
  console.log('Received Event:', req.body.type);
  res.send({});
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
