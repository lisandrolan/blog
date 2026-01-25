
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { default: axios } = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/events', async (req, res) => {
    console.log('Received Event:', req.body.type);

    const { type, data } = req.body;

    if (type === 'CommentCreated') {
        const status = data.content.includes('orange') ? 'rejected' : 'approved';

        await axios.post('http://blog-event-bus-srv:4005/events', {
            type: 'CommentModerated',
            data: {
                id: data.id,
                postId: data.postId,
                content: data.content,
                status
            }
        }).catch((err) => {
            console.log('Error sending event:', err.message);
        });
    }

    res.send({});
});

const PORT = 4003;
app.listen(PORT, () => {
    console.log(`Moderation service listening on port ${PORT}`);
});