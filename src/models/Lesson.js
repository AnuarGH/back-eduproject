let Schema = require('mongoose').Schema;

let lesson = new Schema({
    title: String,
    type: {
        type: String,
        default: "text"
    },
    description: String,
    content: String
});

module.exports = lesson;