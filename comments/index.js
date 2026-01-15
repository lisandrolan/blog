const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const { default: axios } = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    const postId = req.params.id;
    res.send(commentsByPostId[postId] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;
    const postId = req.params.id;

    const comments = commentsByPostId[postId] || [];
    comments.push({ id: commentId, content });

    commentsByPostId[postId] = comments;

    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId
        }
    }).catch((err) => {
        console.log('Error sending event:', err.message);
    });

    res.status(201).send(comments);
});

app.post('/events', (req, res) => {
    console.log('Received Event:', req.body.type);

    if (req.body.type == "PostCreated") {
        const { id, title } = req.body.data;
        commentsByPostId[id] = [];
    }
    res.send({});
});

const PORT = 4001;
app.listen(PORT, () => {
    console.log(`Comments service listening on port ${PORT}`);
});
