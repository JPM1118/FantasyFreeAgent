import React from 'react';

import homeStyles from './home.module.scss';
import DropDown from '../dropDown/dropDown';
import sendSelectedLeague from '../../callback_props/sendSelectedLeague';


export default props => {

  return (
    <div className={homeStyles.content}>
      <h2 className={homeStyles.welcome}>Welcome, {props.user.name}</h2>
      <h3 className={homeStyles.leagueTitle}>Please select a league</h3>
      <DropDown list={props.user.leagues} callback={sendSelectedLeague} />
    </div>
  )
}
