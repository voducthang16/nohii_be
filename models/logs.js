const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LogsSchema = new Schema ({
    title: {
        type: String,
        require: true,
    },
    content: {
        type: String,
        require: true,
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model('Log', LogsSchema);