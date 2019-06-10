const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LeagueSchema = new Schema({
  leagueInfo: {
    leagueKey: String,
    leagueName: String,
    leagueUrl: String,
  },
  players: Array
})

const UserSchema = new Schema({
  guid: String,
  name: String,
  leagues: [LeagueSchema],
  refreshToken: String,
});

module.exports = mongoose.model("User", UserSchema);