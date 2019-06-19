/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-undef */
const getPlayers = async () => {
  try {
    // const cookie = await chrome.cookies.get({ 'url': 'http://lvh.me', 'name': 'connect.sid' })
    // console.log('cookie: ', cookie)
    // debugger;
    let response = await fetch('http://lvh.me/getPlayers', { credentials: 'include' });
    let data = await response.json();
    return data

  } catch (err) {
    console.error(err);
  }
};
const sendPlayers = async (players) => {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    const activeTab = tabs[0];
    const response = await chrome.tabs.sendMessage(activeTab.id, { message: 'sending-players', players: ['lucas giolito', 'cole hamels', 'rich hill', 'trevor richards'] })
    console.log(response)
  } catch (err) {
    console.error(err)
  }
}
chrome.commands.onCommand.addListener(async function (command) {
  if (command === "getPlayers") {
    const players = await getPlayers()
    console.log(players.players);
    await sendPlayers(players);
  }
})



// startup();