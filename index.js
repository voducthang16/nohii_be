require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const Questions = require('./models/questions');
const Logs = require('./models/logs');

const app = express();
app.options("*", cors());
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://nohii-quiz.netlify.app");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();
});

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

// Logs
app.get('/logs', async (req, res) => {
    try {
        const logs = await Logs.find().sort({ createdAt: -1 });
        res.json(logs);
    } catch (error) {
        res.json({
            message: error
        })
    }
})

app.post('/logs', (req, res) => {
    try {
        const log = new Logs(req.body)
        log.save();
        res.send({
            message: 'success'
        })
    } catch (error) {
        res.json({
            message: error
        })
    }
})

// Questions
app.get('/questions', async (req, res) => {
    try {
        const questions = await Questions.find();
        const modifiedQuestions = questions.map(question => {
            if (question.status === false) {
                question.answer = undefined;
            }
            return question;
        });
        res.json(modifiedQuestions);
    } catch (error) {
        res.json({
            message: error
        })
    }
})

app.post('/questions', async (req, res) => {
    try {
        const question = new Questions(req.body)
        question.save();
        res.send({
            message: 'success'
        })
    } catch (error) {
        res.json({
            message: error
        })
    }
})

app.post('/select-question', async (req, res) => {
    try {
        const id = req.body.id;
        await Questions.findOneAndUpdate(
            { _id: id },
            { isSelect: true },
        )
        res.json({
            message: 'success'
        })
    } catch (error) {
        res.json({
            message: error
        })
    }
})

app.post('/answer-question', async (req, res) => {
    try {
        const currentDate = new Date();
        const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        const endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);

        const logs = await Logs.find({
            createdAt: { $gte: startOfDay, $lt: endOfDay },
            title: 'incorrect-answer'
        }).sort({ createdAt: -1 });
        if (logs.length >= 10) {
            res.status(400).json({
                message: "hom nay nohii hong duoc tra loi nua oi 😁"
            })
            return;
        }
        const id = req.body.id;
        const answer = req.body.answer;
        const data = await Questions.findOneAndUpdate(
            { _id: id },
            { $inc: { times: 1 } },
        )
        if (data.answer === answer) {
            const log = new Logs({
                title: 'correct-answer',
                content: answer,
            })
            log.save();
            const updatedQuestion = await Questions.findOneAndUpdate(
                { _id: id, answer: answer },
                { $set: { status: true, isSelect: false } },
            );
            res.json({
                updatedQuestion
            })
        } else {
            const log = new Logs({
                title: 'incorrect-answer',
                content: answer,
            })
            log.save();
            res.status(400).json({
                message: "nohii tra loi sai oi nhe 😁"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
})

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening on port : ${PORT}`);
    })
})