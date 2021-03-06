import React, { useState, useEffect } from 'react';

import dropDownStyles from './dropDown.module.scss';
import downArrow from './downArrow.png';
import upArrow from './upArrow.png';

export default (props) => {
  const [openMenu, setOpenMenu] = useState(false)
  const [listSelection, setListSelection] = useState(props.list[0])

  useEffect(() => callback(listSelection), [listSelection])

  const { list, callback } = props;
  return (
    <div className={dropDownStyles.content}>
      <div className={dropDownStyles.currentSelection}>{listSelection.leagueInfo.leagueName}</div>
      <div
        className={dropDownStyles.menuToggle}
        onClick={() => setOpenMenu(!openMenu)}
      >
        <img src={openMenu ? upArrow : downArrow} alt="menu toggle" />
      </div>
      {!openMenu ? null
        : <div className={dropDownStyles.list}>
          {list.map((item, idx) => {
            return <div
              className={dropDownStyles.listItem}
              key={idx}
              onClick={() => { setListSelection(item); setOpenMenu(!openMenu); }}
            >
              {item.leagueInfo.leagueName}
            </div>
          })}
        </div>
      }
      {/* {console.log('from dropDown.js', props.list)} */}
    </div>
  )
}