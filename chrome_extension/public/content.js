/* eslint-disable no-undef */

const run = (players) => {
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
          const searchName = name.toLowerCase();
          let matchedPlayer = _players.find(player => {
            let asciiName = `${player.name.ascii_first} ${player.name.ascii_last}`
            return searchName === asciiName.toLowerCase()
          })
          if (matchedPlayer) {
            let statusIcon = matchedPlayer.owned ? X : check;
            return `${name}<img id="inject" src=${statusIcon} />`
          } else { return name }
        }
        newNode.innerHTML = newNode.innerHTML.replace(re, insertIcon)

        if (newNode.innerHTML !== node.parentNode.innerHTML) {
          node.parentNode.replaceWith(newNode)
        }

      }
    })
  }
  intersection(players, nodes)
}

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    const msgBox = (text) => {
      let body = document.body;
      let msgDiv = document.createElement('div');
      let msgContent = document.createTextNode(text);
      msgDiv.appendChild(msgContent)
      msgDiv.setAttribute('id', 'loading-msg')
      msgDiv.setAttribute('style', 'color:#5A2B73; font-weight: bold; background:white; border:solid black 1px; padding: 10px;  position:fixed; top:0; right:0; z-index:1000;')
      body.appendChild(msgDiv)
    }

    if (request.message === "getPlayers") {
      msgBox('Player information is loading..')
      fetch(`https://fantasyfa.com/getPlayers`, { credentials: 'include' })
        .then(function (response) {
          return response.json()
        })
        .then(function (data) {
          run(data.players)
          let msgDiv = document.getElementById('loading-msg')
          msgDiv.parentNode.removeChild(msgDiv);

        })
        .catch(function (err) {
          let msgDiv = document.getElementById('loading-msg')
          msgDiv.parentNode.removeChild(msgDiv);
          alert('There was and error fetching data from Fantasy Free Agent server. Please try again.')
        })

    }
  }
)