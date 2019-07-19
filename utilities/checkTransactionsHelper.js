const User = require('../models/Users');

module.exports = async (transactions, id, leagueId, timestamp) => {
    try {
        let playerStatusArray = [];
        transactions = Object.entries(transactions.data.fantasy_content.league[1].transactions);
        for (let [key, value] of transactions) {
            const tranTimeStamp = parseInt(value.transaction[0].timestamp + '000')
            if (tranTimeStamp >= timestamp) {
                const players = Object.values(value.transaction[1].players)
                players.forEach(async player => {
                    if (typeof player !== 'number') {
                        //transaction information object from Yahoo api
                        const transaction_data = player.player[1].transaction_data;

                        let type;
                        if (Array.isArray(transaction_data)) {
                            type = transaction_data[0].type;
                        } else {
                            type = transaction_data.type;
                        }
                        //grabbing player's name and weather they are owned or not.
                        const { name } = player.player[0][2];
                        const owned = type == "add" ? true : false;
                        //new player object to replace old one
                        let playerObj = {};
                        playerObj.name = name;
                        playerObj.owned = owned
                        //Updating database with new information.
                        playerStatusArray.push(playerObj);
                    }
                })
            } else {
                break;
            }
        }
        let user = await User.findById(id);
        let editedLeague = await user.leagues.id(leagueId);
        for (let i = 0; i < playerStatusArray.length; i++) {
            const idx = editedLeague.players.findIndex(player => {
                return player.name.full == playerStatusArray[i].name.full
            })
            editedLeague.players[idx] = playerStatusArray[i];
        };
        user.markModified('leagues');
        await user.save();

    } catch (e) {
        console.error(e);
    }


}