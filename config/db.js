const mongoose = require("mongoose");
require('dotenv').config();

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


require("../models/Players");