var mongoose = require('mongoose');

var setupDatabase = function() {
  mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/keller-counter');
};

module.exports = setupDatabase;