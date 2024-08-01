const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const passport = require('passport');




// database
const mongoose = require("mongoose");
const server = require("./server");

const google_schema = require('./google_model');
const UserSchema = require('./models');
const bus_names_Schema = require('./bus_names');
const { error } = require('console');
const GoogleModel = mongoose.model('google', google_schema);
const UserModel = mongoose.model('User', UserSchema);
const bus_names = mongoose.model('bus_name', bus_names_Schema);
const app = express();
require('./passport-setup');



app.use(express.static('stylesheet'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render('login')
});
app.get("/xss_test", (req, res) => { 
  res.render('xss_test');
 });



// google sign-IN
app.use(cookieSession({
  name: 'google-auth-session',
  keys: ['key1', 'key2']
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/failure'
  }), function (req, res) {
    res.redirect("/success")
  }
);

app.get('/success', (req, res) => {
  async function run() {
    const newuser = new GoogleModel({ email: `${req.user.email}` });
    await newuser.save();
  }
  run();

  res.redirect("/dashboard")
});

app.get('/failure', (req, res) => {
  res.send("<h1>404 Error</h1>");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    res.redirect('/')
  }
}

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (id, done) {
  return done(null, id);
});

app.post("/dashboard", async (req, res) => {
  user_email = req.body.email;
  user_password = req.body.password;
  const docs = await UserModel.find({ email: user_email });
  auth_paasword = docs.map(doc => doc.password).sort()[0];
  if (user_password == auth_paasword) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login')
  }
});

app.post("/add_user", (req, res) => {
  async function run() {
    const newuser = new UserModel(req.body);
    await newuser.save();
  }
  run();
  res.redirect('/');
});


app.get('/dashboard', async (req, res) => {
  // Bus names and timings from database (if still needed)
  const result = await bus_names.find();
  let names = [], timings = [];

  if (result && result.length > 0) {
    const { names: busNames, timings: busTimings } = result[0];
    names = busNames;
    timings = busTimings;
  }

  // Cybersecurity topics and descriptions
  const topics = [
    'Network Security',
    'Cryptography',
    'Malware Analysis',
    'Penetration Testing'
  ];

  const descriptions = [
    'Techniques to protect the usability and integrity of your network and data.',
    'The study and practice of techniques for secure communication.',
    'The process of determining the functionality, origin, and potential impact of a given malware sample.',
    'The practice of testing a computer system, network, or web application to find security vulnerabilities that an attacker could exploit.'
  ];

  res.render('dashboard', { topics, descriptions, busses: names, timing: timings });
});

app.get('/register', (req, res) => {
  res.render('register')
});

// Route to view registered users as JSON
app.get('/view', async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(3000, () => {
  console.log('server connected!');
});

 

module.exports = UserSchema;