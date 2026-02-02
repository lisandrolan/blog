const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 4005;

const eventLog = [];

app.use(bodyParser.json());

app.post('/events', async (req, res) => {
    const event = req.body;

    eventLog.push(event);
    try {
        await axios.post('http://blog-posts-srv:4000/events', event).catch(() => {}); 
            await axios.post('http://blog-comments-srv:4001/events', event).catch(() => {});
            await axios.post('http://blog-moderation-srv:4002/events', event).catch(() => {});
            await axios.post('http://blog-query-srv:4002/events', event).catch(() => {});
        console.log('Event forwarded:', event.type);
        res.status(200).send({ status: 'Event forwarded  successfully' });
    } catch (error) {
        // console.error('Error forwarding event:', error);
        // res.status(500).send({ status: 'Error forwarding event' });
    }
});

app.get('/events', (req, res) => {
    console.log('Event log requested');
    console.log(eventLog);
    res.send(eventLog);
});

app.listen(PORT, () => {
    console.log(`Event bus listening on port ${PORT}`);
}); 