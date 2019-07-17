import React from 'react';

import loginStyles from './login.module.scss';


export default props => {
  const handleClick = e => {
    console.log('clicked')
    // eslint-disable-next-line no-undef
    // chrome.tabs.create({
    //   url: `${process.env.REACT_APP_BACKEND}`
    // })


  }
  return (
    <div className={loginStyles.loggedOut}>
      {console.log('rendered')}
      <h2>You are not logged In!</h2>
      <div>
        {/* Click <span id="loginBtn" className={loginStyles.loginRedirect} onClick={handleClick}>here</span> to login to your Yahoo account. */}
        Click <a href='https://lvh.me/' id="loginBtn" className={loginStyles.loginRedirect} >here</a> to login to your Yahoo account.
      </div>
    </div>
  )
}
