let Schema = require('mongoose').Schema;

let lessonSchema = new Schema({
    title: String,
    type: {
        type: String,
        default: "text"
    },
    description: String,
    content: String
});

module.exports = lessonSchema;