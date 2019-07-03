/* eslint-disable no-undef */

const test = (players) => {
  let body = document.body;
  let bodyCopy = body.cloneNode(true)
  let treeWalker = document.createTreeWalker(
    bodyCopy,
    NodeFilter.SHOW_TEXT,
    node => {
      let regex = /\w+/gi
      if (regex.test(node.textContent)) {
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
      let text = node.textContent; //To keep reference to the parentNode.innerHTML
      _players.forEach((player) => {
        if (text.includes(player.name.full)) {
          let statusIcon = player.owned ? check : X;
          let re = new RegExp(player.name.full, 'gi')
          text = text.replace(re, `${player.name.full}<img src=${statusIcon} />`)
        }
      })
      if (node.parentNode) {
        return node.parentNode.innerHTML = text;
      }
    })
  }
  intersection(players, nodes)
  return body.parentNode.replaceChild(bodyCopy, body)
}

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "test") {
      test(request.players)
      sendResponse({ gotIt: "Got it!" })
    }
  }
)