require('dotenv').config();
const path = require('path');
const express = require('express');
const fs = require('fs');
const https = require('https');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');

const app = express();
const MongoStore = require('connect-mongo')(session);

//routes
const auth = require('./routes/auth');
const getUser = require('./routes/getUser');
const getPlayers = require('./routes/getPlayers');
const setLeauge = require('./routes/setLeague');
const checkTransactions = require('./middleware/checkTransactions');
const fillPlayerArray = require('./routes/fillPlayerArray');
//custom middleware
const refreshToken = require('./middleware/refreshToken');
const checkPlayerArray = require('./middleware/checkPlayerArray');
//utilities
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
    next(err)
  }
);
const db = mongoose.connection;
if (process.env.NODE_ENV === 'production') {
  console.log('prod')
  app.use(cors({ credentials: true }));
} else {
  console.log('not prod')
  app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
}
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    maxAge: 1000 * 60 * 60 * 24 * 7 * 52, // 1 year
    resave: false,
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
app.use(express.static(path.join(__dirname, 'public')))
app.get('/', (req, res) => res.redirect('/auth/login'));
app.use(('/getUser'), getUser);
app.use(('/setLeague'), setLeauge);
app.use(refreshToken);
app.use(('/fillPlayerArray'), checkPlayerArray, fillPlayerArray);
app.use(('/checkTransactions'), checkTransactions);
app.use(('/getPlayers'), getPlayers);


app.use(function (err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }
  res.status(500)
  res.json('Something went wrong. Please try again.')
  console.error(err)
})
app.listen(PORT, console.log(`Server has started on ${PORT}`));



