import React from 'react';

import homeStyles from './home.module.scss';
import DropDown from '../dropDown/dropDown'


export default props => {
  return (
    <div className={homeStyles.content}>
      {console.log('rendered')}
      <h2 className={homeStyles.welcome}>Welcome, {props.user.name}</h2>
      <h3 className={homeStyles.leagueTitle}>Please select a league</h3>
      <DropDown list={props.user.leagues} />
    </div>
  )
}
