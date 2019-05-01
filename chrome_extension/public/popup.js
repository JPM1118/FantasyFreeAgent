window.onload = () => {
  let loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', element => {
      console.log('clicked')
      chrome.tabs.create({
        url: 'http://www.lvh.me'
      })

    })
  }
}