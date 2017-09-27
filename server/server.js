const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connection.openUri('mongodb://localhost:27017/TodoApp');

const Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

const newTodo = new Todo({
    text: '    Trim test   '
});

newTodo.save().then(
    doc => {
        console.log(JSON.stringify(doc, undefined, 2));
    },
    () => {
        console.log('Unable to save!')
    }
);