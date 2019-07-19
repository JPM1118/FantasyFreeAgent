import React from 'react'
import LoadingDots from '../loadingDots/loadingDots';
import gatherLeagueInfoStyles from '../gatherLeagueInfo/./gatherLeagueInfo.module.scss'

export default () => {
  return (
    <div className={gatherLeagueInfoStyles.content}>
      <LoadingDots text={'Loading your Yahoo league information'} fontSize={24} align={'center'} />
      <div className={gatherLeagueInfoStyles.text}>This may take a few minutes.</div>
    </div>
  )
}
