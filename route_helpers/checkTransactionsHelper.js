const User = require('../models/Users');

module.exports = async (transactions, id, timestamp) => {
    const user = await User.findById(id);
    transactions = Object.entries(transactions.data.fantasy_content.league[1].transactions);
    for (let [key, value] of transactions) {
        const tranTimeStamp = parseInt(value.transaction[0].timestamp + '000')
        if (tranTimeStamp >= timestamp) {
            const { players } = value[1].transaction[1]
            Object.values(players).forEach(player => {
                console.log(player)
                const { type } = player.player[1].transaction_data[0];
                const { name } = player.player[0][2];
                const owned = type == "add" ? true : false;
            })
        } else {
            console.log('break');
            break;
        }

    }

}