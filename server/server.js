const express = require('express');
const bodyParser = require('body-parser');
const lodash = require('lodash');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require("./models/user");

const app = express();
app.use(bodyParser.json());
const port = process.env.port || 3000;

app.post('/todos', (req, res) => {
    const todo = new Todo({
        text: req.body.text
    });

    todo.save().then(
        todo => res.send(todo)
    ).catch(e => res.status(400).send(e));
});

app.get('/todos', (req, res) => {
    Todo.find().then(
        todos => res.send({todos}),
    ).catch(e => res.status(400).send(e));
});

app.get('/todos/:id', (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(400).send('ID not valid')
    }

    Todo.findById(id).then(todo => {
        if (!todo) {
            return res.status(404).send(`Unable to find todo with id ${id}`)
        }
        res.send({todo});
    }).catch(e => res.status(400).send(e))
});

app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(400).send('ID not valid')
    }

    Todo.findByIdAndRemove(id).then(todo => {
        if (!todo) {
            return res.status(404).send(`Unable to find todo with id ${id}`)
        }
        res.send({todo});
    }).catch(e => res.status(400).send(e))
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