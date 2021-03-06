const root    = '../../';
const express = require('express');

// Express Initialization
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public', { dotfiles: 'allow' }));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

module.exports.app = app;