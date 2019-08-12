const mongoose = require('mongoose');

const Card = mongoose.model('Card', {
    front: {
        type: String,
        required: true,
        trim: true
    },
    back: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = Card;