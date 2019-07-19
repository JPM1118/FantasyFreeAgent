/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-undef */
function sendPlayers(cmd) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { message: cmd })
  })
}

chrome.commands.onCommand.addListener(function (command) {
  if (command === "getPlayers") {
    sendPlayers("getPlayers");
  }
  else if (command === "test") {
    sendPlayers("test")
  }
})



// startup();