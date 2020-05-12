let mongoose = require('mongoose');
let config = require('../../config/index');

mongoose.connect(config.get('mongoose:uri'),config.get('mongoose:options'));
db = mongoose.connection;

db.once('open', () => {
   console.log("[utils/db] Connected to MongoDB!");
});

db.on('error', err => {
   console.log(err);
});

module.exports = mongoose;