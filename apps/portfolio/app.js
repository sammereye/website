const root    = '../../';
const modules = root + 'node_modules/';

const mailer  = require(modules + 'nodemailer');
const express = require(modules + 'express');
const email   = require(root    + 'secrets/email');

// Express Initialization
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use('/portfolio', express.static(__dirname + '/public', { dotfiles: 'allow' }));
app.use(express.json());


// Mailing
let smtpConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: email.email,
    pass: email.password
  }
}

let transporter = mailer.createTransport(smtpConfig);

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Email server running')
  }
});

// Spam Protection
var ips = {};

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/submitContactForm', (req, res) => {
  if (!(req.socket.remoteAddress in ips)) {
    ips[req.socket.remoteAddress] = 0;
  }

  if (ips[req.socket.remoteAddress] <= 2) {
    res.status(200).send('Message sent!')
    const data = req.body;
    const mail = {
      from: '"sammer.xyz" temprsammer@gmail.com',
      to: 'iamsammert@gmail.com',
      subject: 'New Message',
      html: `From: ${data.name} (${data.email}) <br/><br/> Message: ${data.message}<br/><br/> IP: ${req.socket.remoteAddress}`
    }

    transporter.sendMail(mail, (err, data) => {
      if (err) {
        console.log(error);
        res.status(500).send('Failed to send message');
      } else {
        ips[req.socket.remoteAddress] += 1;
        res.status(200).send('Message sent!');
      }
    });
  } else {
    res.status(500).send('Failed to send message');
  }
});

module.exports.app = app;