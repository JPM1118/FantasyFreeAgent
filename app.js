require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');

const app = express();
const MongoStore = require('connect-mongo')(session);
const auth = require('./routes/auth');
const getPlayers = require('./routes/getPlayers');
const passportSetup = require('./config/passportSetup');

const PORT = process.env.PORT || 3000;

const MONGO_URI = `mongodb+srv://${process.env.MONGO_UN}:${process.env.MONGO_PW}@cluster0-y5hkl.mongodb.net/fantasy_free_agents?retryWrites=true`

const options = {
  reconnectTries: Number.MAX_VALUE,
  poolSize: 10,
  useNewUrlParser: true
};

mongoose.connect(MONGO_URI, options).then(
  () => {
    console.log("Database connection established!");
  },
  err => {
    console.log("Error connecting Database instance due to: ", err);
  }
);
const db = mongoose.connection;
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    maxAge: 1000 * 60 * 60 * 24 * 7 * 52, // 1 year
    resave: true,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || 'imasecret',
    store: new MongoStore({
      mongooseConnection: db,
    }),
  }),
);
app.use(passport.initialize());
app.use(passport.session());


app.set('view engine', 'ejs');

app.use(('/auth'), auth);
app.use(('/getPlayers'), getPlayers);

app.get('/', (req, res) => res.render('home'));

app.listen(PORT, console.log(`Server has started on ${PORT}`));

