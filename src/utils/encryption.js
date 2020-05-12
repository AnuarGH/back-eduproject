const config = require('../../config');
const bcrypt = require('bcrypt');

function hashPassword(password){
    const saltRounds = config.get('bcrypt:saltRounds');
    return bcrypt.hashSync(password, saltRounds);
}

function comparePasswords(password, hash){
    return bcrypt.compareSync(password, hash);
}

module.exports = {
    hashPassword,
    comparePasswords
};