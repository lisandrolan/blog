const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 4005;

app.use(bodyParser.json());

app.post('/events', async (req, res) => {
    const event = req.body;

    try {
        await axios.post('http://localhost:4000/events', event);
        await axios.post('http://localhost:4001/events', event);
        await axios.post('http://localhost:4002/events', event);
        await axios.post('http://localhost:4003/events', event);
        console.log('Event forwarded:', event.type);
        res.status(200).send({ status: 'Event forwarded successfully' });
    } catch (error) {
        console.error('Error forwarding event:', error);
        res.status(500).send({ status: 'Error forwarding event' });
    }
});

app.listen(PORT, () => {
    console.log(`Event bus listening on port ${PORT}`);
}); 