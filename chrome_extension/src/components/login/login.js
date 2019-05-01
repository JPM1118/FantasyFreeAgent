import React from 'react';

import loginStyles from './login.module.scss';


export default props => {
  return (
    <div className={loginStyles.loggedOut}>
      {console.log('rendered')}
      <h2>You are not logged In!</h2>
      <div>
        Click <span id="loginBtn" className={loginStyles.loginRedirect}>here</span> to login to your Yahoo account.
      </div>
    </div>
  )
}
