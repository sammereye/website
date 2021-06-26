const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let UserSchema = new Schema({
  email: {type: String, unique: true},
  password: String,
  sessions: [{
    id: String,
    createdAt: { type: Date, expires: 86400, default: Date.now }
  }],
  todo: [{
    title: String,
    description: String
  }]
});

module.exports.User = mongoose.model('User', UserSchema);