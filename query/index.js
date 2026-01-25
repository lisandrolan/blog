import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    console.log('Received Event:', req.body.type);

    handleEvent(req.body.type, req.body.data);

    res.send({});
});

const handleEvent = (type, data) => {
    if (type === 'PostCreated') {
        const { id, title } = data;
        posts[id] = { id, title, comments: [] };
    }

    if (type === 'CommentCreated') {
        const { id, content, postId, status } = data;
        const post = posts[postId];
        post.comments.push({ id, content, status });
    }

    if (type === 'CommentUpdated') {
        const { id, content, postId, status } = data;
        const post = posts[postId];
        const comment = post.comments.find(comment => comment.id === id);
        comment.status = status;
        comment.content = content;
    }
};


const PORT = 4002;
app.listen(PORT, async () => {
    console.log(`Posts service listening on port ${PORT}`);

    try {

        const res = await axios.get('http://blog-event-bus-srv:4005/events');

        console.log('Fetching past events:', res.data.length);
        for (let event of res.data) {
            console.log('Processing event:', event.type);
            handleEvent(event.type, event.data);
        }
    } catch (error) {
        console.log('Error fetching events:', error.message);
    }
});