/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const treeWalker = (array) => {
  let matchedPlayers = [];

  let treeWalker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    node => {
      let matched = array.some(item => {
        let re = new RegExp(item, 'gi');
        let test = re.test(node.textContent);
        if (test) {
          matchedPlayers.push(item)
        }
        return test
      });
      //         debugger;
      if (matched) {
        return NodeFilter.FILTER_ACCEPT;
      } else {
        return NodeFilter.FILTER_SKIP;
      }
    },
    false
  );

  let nodes = [];

  while (treeWalker.nextNode()) {
    nodes.push(treeWalker.currentNode);
  }

  nodes.forEach(node => {
    for (const player of matchedPlayers) {
      let re = new RegExp(player, 'gi');
      if (re.test(node.textContent) && node.parentNode) {
        //             debugger;
        node.parentNode.innerHTML = node.parentNode.innerHTML.replace(re, `${player} success!!!!`)
      }
    }
  })

  console.log(nodes);
}

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "sending-players") {
      console.log('also, hello!')
      treeWalker(request.players);
      sendResponse({ gotIt: "Got it!" })
    }
  }
)

