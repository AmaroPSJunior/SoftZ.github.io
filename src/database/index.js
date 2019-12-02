const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/teste', { useMongoClient: true });
//mongoose.connect('mongodb://localhost/teste');
mongoose.Promise = global.Promise;

module.exports = mongoose;