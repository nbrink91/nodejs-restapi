const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connection.openUri('mongodb://localhost:27017/TodoApp')

const Todo = mongoose.model('Todo', {
    text: {
        type: String,
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }
});

const newTodo = new Todo({
    text: 'Cook dinner'
});

newTodo.save().then(
    (doc) => {
        console.log('Saved todo', doc);
    }, (e) => {
        console.log('Unable to save!')
    }
);

const otherTodo = new Todo({
    text: 'Wake up in the morning',
    completed: true,
    completedAt: 1234
});

otherTodo.save().then(
    (doc) => {
        console.log('Saved todo', doc);
    }, (e) => {
        console.log('Unable to save!')
    }
);