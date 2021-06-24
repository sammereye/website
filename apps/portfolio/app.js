const mailer      = require('nodemailer');
const express     = require('express');
const email       = require('../../secrets/email');

// Express Initialization
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname, { dotfiles: 'allow' }));
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

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/apps/porfolio/public/index.html');
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

module.exports.app = app;