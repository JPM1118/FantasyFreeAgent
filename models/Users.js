const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  guid: String,
  name: String,
  leagues: [
    {
      leagueKey: String,
      leagueName: String,
      leagueUrl: String
    }
  ],
  refreshToken: String,
});

module.exports = mongoose.model("User", UserSchema);