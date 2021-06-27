const root    = '../../';
const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const handlebars = require('express-handlebars');
const uuid = require('uuid').v4;
const dbConfig = require(root + 'secrets/mongodb.js');


// Express Initialization
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public', { dotfiles: 'allow' }));
app.use(express.json());
app.set('views', __dirname + '/views')
app.engine('hbs', handlebars({
  layoutsDir: __dirname + '/views/layouts',
  extname: 'hbs',
  defaultLayout: '_index'
}));
app.set('view engine', 'hbs');

// Database Initialization
mongoose.connect(dbConfig.db, {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('connected', () => {console.log('MongoDB connected')});
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Model Initialization
let User = require('./models/user').User;


/* Index Page */
app.get('/', (req, res) => {  
  res.render('index');
});


/* Create Account Page */
app.get('/createAccount', (req, res) => {  
  res.render('createAccount');
});


/* Create Account POST */
app.post('/createAccount', (req, res) => {
  let newUser = new User({
    email: req.body.email,
    password: crypto.createHash('sha256').update(req.body.password + '8675309').digest('base64')
  });

  newUser.save((err) => {
    if (err) {
      switch(err.code) {
        case 11000:
          res.send('Account already exists!');
          break;
        default:
          res.send('Failed to create account!')
      }
      console.log(err.code);
    } else {
      let newUUID = uuid();

      db.collection('users').updateOne(newUser, {
        $push: { 
          sessions: {
            id: newUUID
          }
        }
      }, (err, data) => {
        if (err) throw err;
        res.cookie('user-id', newUUID, {
          path: '/todo/',
          maxAge: 24*60*60,
          // You can't access these tokens in the client's javascript
          // httpOnly: true,
          // Forces to use https in production
          secure: true
        });
        res.redirect('/todo/home');
      })
    }
  });
});


/* Login Page */
app.get('/login', (req, res) => {  
  res.render('login');
});


/* Login POST */
app.post('/login', (req, res) => {
  let findUser = {
    email: req.body.email,
    password: crypto.createHash('sha256').update(req.body.password + '8675309').digest('base64')
  };

  db.collection('users').findOne(findUser, (err, data) => {
    if (err) throw err;
    if (data != null) {
      let newUUID = uuid();

      db.collection('users').updateOne(findUser, {
        $push: { 
          sessions: {
            id: newUUID
          }
        }
      }, (err, data) => {
        if (err) throw err;
        res.cookie('user-id', newUUID, {
          path: '/todo/',
          maxAge: 24*60*60,
          // You can't access these tokens in the client's javascript
          // httpOnly: true,
          // Forces to use https in production
          secure: true
        });
        res.redirect('/todo/home');
      })
    } else {
      res.send('Account not found');
    }
  });
});


/* Home Page */
app.get('/home', (req, res) => {
  let cookies = parseCookies(req.headers.cookie);
  if ('user-id' in cookies) {
    findUser(cookies['user-id'], (user) => {
      res.render('home', {todoList: user.todo})
    });
  } else {
    res.redirect('/todo/')
  }
});

/* Home Page */
app.post('/newTodo', (req, res) => {
  let cookies = parseCookies(req.headers.cookie);
  if ('user-id' in cookies) {
    findUser(cookies['user-id'], (user) => {
      console.log(req.body.title)
      db.collection('users').updateOne({
        sessions: {
          id: cookies['user-id']
        }
      }, {
        $push: {
          todo: {
            title: req.body.title,
            description: undefined
          }
        }
      }, (err, data) => {
        if (err) throw err;
        res.status(200).send('Item created');
      });
    });
  } else {
    // res.redirect('/todo/')
  }
});



// app.get('/testdb', (req, res) => {
//   let findUser = {
//     sessions: {
//       id: '2ab50611-ee88-4de7-97ea-2a39f506eb3b'
//     } 
//   };

//   db.collection('users').findOne(findUser, (err, data) => {
//     if (err) throw err;
//     console.log(data);
//     res.send('Test complete');
//   })
// });


function findUser(id, callback) {
  db.collection('users').findOne({
    sessions: {
      id: id
    }
  }, (err, data) => {
    if (err) throw err;
    callback(data);
  })
}

function parseCookies(coo) {
  let cookies = {};
  if (coo != undefined) {
    let cookiesSplit = coo.split('; ');
    for (var i = 0; i < cookiesSplit.length; i++) {
      let cookieSplit = cookiesSplit[i].split('=');
      cookies[cookieSplit[0]] = cookieSplit[1];
    }
  }
  return(cookies);
}


module.exports.app = app;