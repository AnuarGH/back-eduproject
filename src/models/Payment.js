let Schema = require('mongoose').Schema;

let payment = new Schema({
    course_id: String,
    amount: Number,
    transaction_id: String
});

module.exports = payment;