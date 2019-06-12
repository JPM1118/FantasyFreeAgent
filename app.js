require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const cron = require('node-cron');
const axios = require('axios');

const app = express();
const MongoStore = require('connect-mongo')(session);
const User = require('./models/Users');

//routes
const auth = require('./routes/auth');
const getUser = require('./routes/getUser');
const getPlayers = require('./routes/getPlayers');
const setLeauge = require('./routes/setLeague');
const checkTransactions = require('./routes/checkTransactions');
//custom middleware
const refreshToken = require('./utilities/refreshToken');
//utilities
const requestYhPlayers = require('./utilities/requestYhPlayers')
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
const whitelist = ['http://localhost:3000', 'chrome-extension://cfdjhkldccfabnkcglfmlknhngghgalm', 'chrome-extension://hlmhjiphcjclppmdjjalepbkeheiffnd', 'http://lvh.me/getUser']
let corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      callback(null, true)
    }
    else if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error(origin, 'Not allowed by CORS'))
    }
  },
  credentials: true
}
app.use(cors(corsOptions));
// app.use(cors());
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
app.use(express.static(path.join(__dirname, 'public')))
app.use(('/auth'), auth);
app.use(refreshToken);
app.use(async (req, res, next) => {
  if (req.session.playerArrayFull) { next() }
  const { id, accessToken } = req.session.passport.user;
  const user = await User.findById(id);
  const { leagues } = user;
  Object.values(leagues).forEach(async league => {
    if (league.players && league.players.length == 0) {
      await requestYhPlayers(league, accessToken, id)
    }
    req.session.playerArrayFull = true;
  })
  next();
});
app.use(('/getUser'), getUser);
// app.use(('/requestYhPlayers'), requestYhPlayers);
app.use(('/getPlayers'), getPlayers);
app.use(('/setLeague'), setLeauge);
app.use(('/checkTransactions'), checkTransactions);

app.get('/', (req, res) => res.redirect('/auth/login'));

app.listen(PORT, console.log(`Server has started on ${PORT}`));

// cron.schedule('*/30 * * * * *', async () => {
//   // console.log('I am a scheduled log!!')
//   let request = await axios.get('/checkTransactions', {
//     headers: { 'Cookie': 'connect.sid=s%3A_7ElHvr0oRn919cFzuRVArmFc4MEPea7.t7mxiy2imxbC3PFVgIhSZaD4lBxDa4AB4hF3BT12XSA' }
//   });
//   // // debugger;
// })

