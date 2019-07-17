/* eslint-disable no-undef */

const test = (players) => {
  let body = document.body;
  let treeWalker = document.createTreeWalker(
    body,
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
    let reName = _players.reduce((acc, cur, i) => {
      if (i > 0) {
        return acc + `|${cur.name.ascii_first} ${cur.name.ascii_last}`
      } else {
        return acc + `${cur.name.ascii_first} ${cur.name.ascii_last}`
      }
    }, '');
    let re = new RegExp(`\\b(${reName})(?!<img id="inject")\\b`, 'gi')
    _nodes.forEach(node => {
      if (node.parentNode) {
        let newNode = node.parentNode.cloneNode(true);
        function insertIcon(name) {
          let matchedPlayer = _players.find(player => name === `${player.name.ascii_first} ${player.name.ascii_last}`)
          let statusIcon = matchedPlayer.owned ? X : check;
          return `${name}<img id="inject" src=${statusIcon} />`
        }
        newNode.innerHTML = newNode.innerHTML.replace(re, insertIcon)

        if (newNode.innerHTML !== node.parentNode.innerHTML) {
          node.parentNode.replaceWith(newNode)
        }
        // _players.forEach((player) => {
        //   if (/[\u{00c0}-\u{00ff}]/ui.test(player.name.full)) {
        //     const asciiName = `${player.name.ascii_first} ${player.name.ascii_last}`
        //     insertIcon(asciiName, player.owned)
        //   }
        //   else {
        //     insertIcon(player.name.full, player.owned)
        //   }
        // })
        // if (newNode) {
        //   // let currentNode = node
        //   // return currentNode.parentNode.replaceChild(currentNode, newNode);
        //   return node.innerHTML = newNode.innerHTML
        // }
      }
    })
  }
  intersection(players, nodes)
  // return body.parentNode.replaceChild(bodyCopy, body)
}

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "test") {
      console.log(request)
      let body = document.body;
      let msgDiv = document.createElement('div');
      let msgContent = document.createTextNode('Player Information is loading...');
      msgDiv.appendChild(msgContent)
      msgDiv.setAttribute('id', 'loading-msg')
      msgDiv.setAttribute('style', 'color:#5A2B73; font-weight: bold; background:white; border:solid black 1px; padding: 10px;  position:fixed; top:0; right:0; z-index:1000;')
      body.appendChild(msgDiv)
      fetch(`https://lvh.me/getPlayers`, { credentials: 'include' })
        .then(function (response) {
          // console.log(response.json());
          return response.json()
        })
        .then(function (data) {
          console.log(data)
          test(data.players)
          let msgDiv = document.getElementById('loading-msg')
          msgDiv.parentNode.removeChild(msgDiv);

        })
        .catch(function (err) { console.error(err) })
      // sendResponse({ gotIt: "Got it!" })
    }
  }
)