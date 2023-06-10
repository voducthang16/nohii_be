const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const QuestionsSchema = new Schema ({
    title: {
        type: String,
        require: true,
    }
})

module.exports = mongoose.model('Question', QuestionsSchema);