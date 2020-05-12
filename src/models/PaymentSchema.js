let Schema = require('mongoose').Schema;

let paymentSchema = new Schema({
    course_id: String,
    amount: Number,
    transaction_id: String
});

module.exports = paymentSchema;