const fs          = require('fs');
const http        = require('http');
const https       = require('https');
const helmet      = require('helmet');
const express     = require('express');

// Express Initialization
const app = express();
app.use(express.urlencoded({ extended: false }));
// app.use(express.static(__dirname, { dotfiles: 'allow' }));
app.use(express.json());
app.use(helmet());

// Certificate
const privateKey  = fs.readFileSync('secrets/privkey.pem', 'utf-8');
const certificate = fs.readFileSync('secrets/cert.pem',    'utf-8');
const ca          = fs.readFileSync('secrets/chain.pem',   'utf-8');

const credentials = {
  key:  privateKey,
  cert: certificate,
  ca:   ca
}



// Applications
app.use('/', require('./apps/portfolio/app').app)
app.use('/boilerplate', require('./apps/boilerplate/app').app)




const httpServer  = http.createServer(app);
const httpsServer  = https.createServer(credentials, app);

httpServer.listen(80, () => {
  console.log('HTTP server running on port 80');
});

httpsServer.listen(443, () => {
  console.log('HTTPs server running on port 443');
});