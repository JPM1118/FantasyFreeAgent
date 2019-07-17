/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-undef */
// const getPlayers = async () => {
//   try {
//     // const cookie = await chrome.cookies.get({ 'url': 'http://lvh.me', 'name': 'connect.sid' })
//     // console.log('cookie: ', cookie)
//     // debugger;
//     let response = await fetch('http://lvh.me/getPlayers', { credentials: 'include' });
//     let data = await response.json();
//     return data

//   } catch (err) {
//     console.error(err);
//   }
// };
// function sendPlayers(players, cmd) {
//   // try {
//   console.log(players)
//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     chrome.tabs.sendMessage(tabs[0].id, { message: cmd, players: players.players })
//   })
function sendPlayers(cmd) {
  // try {
  // console.log(players)
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { message: cmd })
  })
  // } catch (err) {
  // console.error(err)
  // }
}
chrome.commands.onCommand.addListener(function (command) {
  if (command === "getPlayers") {
    // const players = await getPlayers()
    console.log(players.players);
    sendPlayers(players, "sending-players");
  }
  else if (command === "test") {
    sendPlayers('test')
    // const players = await getPlayers()
    // fetch('http://lvh.me/getPlayers', { credentials: 'include' })
    //   .then(function (response) {
    //     // console.log(response.json());
    //     return response.json()
    //   })
    //   .then(function (data) {
    //     sendPlayers(data, 'test')
    //   })
    //   .catch(function (err) { console.error(err) })
    // console.log(players.players);
    // sendPlayers(players, "test");
  }
})



// startup();