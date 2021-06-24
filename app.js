const fs          = require('fs');
const http        = require('http');
const https       = require('https');
const mailer      = require('nodemailer');
const helmet      = require('helmet');
const express     = require('express');
const cors        = require('cors');
const email       = require('./secrets/email');

// Express Initialization
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname, { dotfiles: 'allow' }));
app.use(express.json());
app.use(helmet());
app.use(cors());

// Certificate
const privateKey  = fs.readFileSync('secrets/privkey.pem', 'utf-8');
const certificate = fs.readFileSync('secrets/cert.pem',    'utf-8');
const ca          = fs.readFileSync('secrets/chain.pem',   'utf-8');

const credentials = {
  key:  privateKey,
  cert: certificate,
  ca:   ca
}

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

app.get('/', (req, res) => {
  console.log(req.socket.remoteAddress )
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/submitContactForm', (req, res) => {
  const data = req.body;
  const mail = {
    from: '"sammer.xyz" temprsammer@gmail.com',
    to: 'iamsammert@gmail.com',
    subject: 'New Message',
    html: `From: ${data.name} (${data.email}) <br/><br/> Message: ${data.message}`
  }

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      console.log(error);
      res.status(500).send('Failed to send message');
    } else {
      res.status(200).send('Message sent!');
    }
  });
});

const httpServer  = http.createServer(app);
const httpsServer  = https.createServer(credentials, app);

httpServer.listen(80, () => {
  console.log('HTTP server running on port 80');
});

httpsServer.listen(443, () => {
  console.log('HTTPs server running on port 443');
});