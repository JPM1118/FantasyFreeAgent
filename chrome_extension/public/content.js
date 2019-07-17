/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const treeWalker = (players) => {
  let body = document.body;
  let bodyCopy = body.cloneNode(true)
  let treeWalker = document.createTreeWalker(
    bodyCopy,
    NodeFilter.SHOW_ELEMENT,
    node => {
      let regex = /\w+/gi
      if (regex.test(node.textContent) && node.childNodes.length === 1) {
        return NodeFilter.FILTER_ACCEPT;
      } else {
        return NodeFilter.FILTER_SKIP;
      }
    }
  );

  let nodes = [];

  while (treeWalker.nextNode()) {
    nodes.push(treeWalker.currentNode);
  }
  const check = chrome.runtime.getURL('images/check.png');
  const X = chrome.runtime.getURL('images/X.png');


  const intersection = (_players, _nodes) => {
    _nodes.forEach(node => {
      if (node.parentNode) {
        let html = node.innerHTML; //To keep reference to the parentNode.innerHTML
        function insertIcon(name, status) {
          if (html.includes(name)) {
            let statusIcon = status ? check : X;
            let re = new RegExp(`(${name})(?!<img id='inject')`, 'gi')
            html = html.replace(re, `${name}<img id='inject' src=${statusIcon} />`)
          }
        }
        _players.forEach((player) => {
          if (/[\u{00c0}-\u{00ff}]/ui.test(player.name.full)) {
            const asciiName = `${player.name.ascii_first} ${player.name.ascii_last}`
            insertIcon(asciiName, player.owned)
          }
          else {
            insertIcon(player.name.full, player.owned)
          }
        })
        return node.innerHTML = html;
      }
    })
  }
  intersection(players, nodes)
  return body.parentNode.replaceChild(bodyCopy, body)
}

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "sending-players") {
      treeWalker(request.players);
      sendResponse({ gotIt: "Got it!" })
    }
  }
)

