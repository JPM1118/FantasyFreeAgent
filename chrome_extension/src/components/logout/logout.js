import React from 'react';
import logoutStyle from './logout.module.scss'

export default (props) => {
  // const handleClick = async () => {
  //   props.logoutClick()
  // }

  return (
    <div className={logoutStyle.content}>
      <p className={logoutStyle.link} onClick={props.logoutClick}>logout</p>
    </div>
  )
}
