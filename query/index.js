import bodyParser from "body-parser";
import express from "express";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    console.log('Received Event:', req.body.type);

    if (req.body.type === 'PostCreated') {
        const { id, title } = req.body.data;
        posts[id] = { id, title };
    }
    else if (req.body.type === 'CommentCreated') {
        console.log('Processing CommentCreated event');
        console.log("Event Data:", req.body.data);
        const { id, content, postId, status } = req.body.data;
        
        const post = posts[postId];
        
        if (post) {
            post.comments = post.comments || [];
            post.comments.push({ id, content, status });
        }
    }
    else if (req.body.type === 'CommentUpdated') {
        const { id, postId, status, content } = req.body.data;
        const post = posts[postId];
        if (post && post.comments) {
            const comment = post.comments.find(comment => comment.id === id);
            if (comment) {
                comment.status = status;
            }
        }
    }

    res.send({});
});

const PORT = 4002;
app.listen(PORT, () => {
    console.log(`Posts service listening on port ${PORT}`);
});