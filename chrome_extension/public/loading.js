// eslint-disable-next-line no-undef
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "test") {
      let body = document.body;
      let msgDiv = document.createElement('div');
      let msgContent = document.createTextNode('Player Information is loading...');
      msgDiv.appendChild(msgContent)
      msgDiv.setAttribute('id', 'loading-msg')
      msgDiv.setAttribute('style', 'color:#5A2B73; font-weight: bold; background:white; border:solid black 1px; padding: 10px;  position:fixed; top:0; right:0')
      body.appendChild(msgDiv)
      // sendResponse({ gotIt: "Loaded" })
    }
  }
)