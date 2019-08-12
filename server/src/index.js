require('./db/mongoose');
const express = require('express');
const Card = require('./models/card');
const cors = require('cors');

const app = express();

const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/cards', (req, res) => {
    const card = new Card(req.body);

    card.save().then( () => {
        res.status(201).send(card)
    }).catch((error) => {
        res.status(400).send(error)
    })
});

app.delete('/cards/:id', (req, res) => {
    Card.findOneAndRemove({_id : req.params.id}).then((user) => {
        if(!user) {
            return res.status(404).send('No card with that ID');
        }

        res.send(user);
    }).catch((error) => {
        res.status(500).send('No card with that ID');
    })
})

app.get('/cards', (req, res) => {
    Card.find({}).then((cards) => {
        res.send(cards)
    }).catch((error) => {
        res.status(500).send(error)
    })
});

app.listen(port, console.log('App running on port ' + port));