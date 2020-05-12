let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let lessonSchema = require('./LessonSchema');


function toLower (v) {
    return v.toLowerCase();
}

let courseSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        String,
        default: ""
    },
    logo: {
        type: String,
        default: ""
    },
    lessons: {
        type: [lessonSchema],
        default: []
    },
    hidden: {
        type: Boolean,
        default: true
    },
    category: {
        type: String,
        set: toLower
    },
});


const Course = mongoose.model('courses', courseSchema);

module.exports = Course;