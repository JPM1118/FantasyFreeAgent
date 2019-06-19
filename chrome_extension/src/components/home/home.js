import React from 'react';

import homeStyles from './home.module.scss';
import DropDown from '../dropDown/dropDown';
import sendSelectedLeague from '../../callback_props/sendSelectedLeague';
import available from '../home/check.png'
import notAvailable from '../home/X.png'


export default props => {

  return (
    <div className={homeStyles.content}>
      <h2 className={homeStyles.welcome}>Welcome, {props.user.name}</h2>
      <h3 className={homeStyles.leagueTitle}>Please select a league</h3>
      <DropDown list={props.user.leagues} callback={sendSelectedLeague} />
      <h3>Instructions:</h3>
      <ul className={homeStyles.instructions}>
        <li>Press "Alt + X" to generate player availability icons.</li>
        <li><img src={available} alt="Is available icon." /> icon means player is available</li>
        <li><img src={notAvailable} alt="Is not available icon." /> icon means player is not available</li>
      </ul>
    </div>
  )
}
