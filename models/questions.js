const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const QuestionsSchema = new Schema ({
    name: {
        type: String,
        require: true,
    },
    answer: {
        type: String,
        require: true,
    },
    times: {
        type: Number,
        default: 0,
    },
    hide: {
        type: String,
        require: true,
    },
    row: {
        type: Number
    },
    status: {
        type: Boolean,
        default: false,
    },
    isSelect: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model('Question', QuestionsSchema);