let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let paymentSchema = require('./PaymentSchema');

let userSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    vk_connect: {
        type: Boolean,
        default: false
    },
    admin: Boolean,
    name: String,
    surname: String,
    password: String,
    enrolled_courses: {
        type: [String],
        default: [],
    },
    payments: {
        type: [paymentSchema],
        default: []
    }
});


const User = mongoose.model('users', userSchema);

module.exports = User;