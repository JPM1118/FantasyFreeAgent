/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-undef */
const startup = async () => {
  try {
    const cookie = await chrome.cookies.get({ 'url': 'http://lvh.me', 'name': 'connect.sid' })
    console.log('cookie: ', cookie)
    debugger;
  } catch (err) {
    console.error(err);
  }
};

startup();