require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Question = require('./models/questions');

const app = express();
const PORT = process.env.PORT || 3001;

mongoose.set('strictQuery', false);

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected', connect.connection.host);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

app.get('/', (req, res) => {
    res.send({title: 'Books'})
})

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening on port : ${PORT}`);
    })
})