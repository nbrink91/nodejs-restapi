const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const lodash = require('lodash');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require("./models/user");

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = process.env.port || 3000;

app.post('/todos', async (req, res) => {
    try {
        const todo = new Todo({
            text: req.body.text
        });

        await todo.save();
        res.send(todo);
    } catch (e) {
        res.status(400).send(e);
    }
});


app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.send(todos)
    } catch (e) {
        res.status(400).send(e);
    }
});

app.get('/todos/:id', async (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(400).send('ID not valid')
    }

    try {
        const todo = await Todo.findById(id);

        if (!todo) {
            return res.status(404).send(`Unable to find todo with id ${id}`)
        }
        res.send({todo});
    } catch (e) {
        res.status(400).send(e);
    }
});

app.delete('/todos/:id', async (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(400).send('ID not valid')
    }

    try {
        const todo = await Todo.findByIdAndRemove(id);

        if (!todo) {
            return res.status(404).send(`Unable to find todo with id ${id}`)
        }

        res.send({todo});
    } catch (e) {
        res.status(400).send(e);
    }
});

app.patch('/todos/:id', (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(400).send('ID not valid')
    }

    const body = lodash.pick(req.body, ['text', 'completed']);

    if (lodash.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then(todo => {
        if (!todo) {
            res.status(404).send(`Unable to find todo with id ${id}`);
        }

        res.send({todo})
    }).catch(e => res.status(400).send(e));
});

app.listen(port, () => {
    console.log(`Started on port ${port}...`);
});

module.exports = {app};