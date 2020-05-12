let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let {hashPassword} = require('../utils/encryption');

let tempUserSchema = new Schema({
    name: String,
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    token: String,
    tokenDeadline: Number
});


tempUserSchema.pre('save', function(next) {
    console.log(this.password);
    this.password=hashPassword(this.password);
    next();
});


const TempUser = mongoose.model('temp_users', tempUserSchema);


module.exports = TempUser;