import React from 'react'

import loadingDotsStyles from './loadingDots.module.scss'

export default (props) => {
  return (
    <div className={loadingDotsStyles.content}
      style={{
        fontSize: `${props.fontSize}px`,
        textAlign: props.align,
      }}>
      <span className={loadingDotsStyles.text}>{props.text}</span>
      <span id='dot' className={loadingDotsStyles.dot}>.</span>
      <span id='dot' className={loadingDotsStyles.dot}>.</span>
      <span id='dot' className={loadingDotsStyles.dot}>.</span>
    </div>
  )
}

