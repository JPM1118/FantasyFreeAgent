import React, { useState, useEffect } from 'react';

import Login from './login/login';
import Home from './home/home';
import GatherLeagueInfo from './gatherLeagueInfo/gatherLeagueInfo';
import axios from 'axios';
import LoadingDots from './loadingDots/loadingDots';

export default () => {
  const [loaded, setLoaded] = useState(false)
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(null);
  const [playerArrayFull, setPlayerArrayFull] = useState(null);
  const [logout, setLogout] = useState(false)
  const [shouldCrash, setShouldCrash] = useState(false)



  const fetchData = async () => {
    try {
      const result = await axios({
        url: `${process.env.REACT_APP_BACKEND}/getUser`,
        withCredentials: true
      });
      const data = result.data
      setUser(data.user);
      setLoggedIn(data.loggedIn);
      setPlayerArrayFull(data.playerArrayFull)
      setLoaded(true);
    } catch (e) {
      setShouldCrash(true);
    }
  }
  const fillPlayerArray = async () => {
    try {
      if (playerArrayFull === false) {
        await axios({
          url: `${process.env.REACT_APP_BACKEND}/fillPlayerArray`,
          withCredentials: true
        })
        setPlayerArrayFull(true)
      }
    } catch (e) {
      setShouldCrash(true);
    }
  }
  const logoutClick = async () => {
    try {
      await axios({
        url: `${process.env.REACT_APP_BACKEND}/auth/logout`,
        withCredentials: true,
      })
      setLogout(true)
    } catch (e) {
      setShouldCrash(true)
    }
  }
  const okToCrash = () => {
    if (shouldCrash) {
      throw new Error('Error!')
    }
  }

  useEffect(() => {
    fetchData()
  }, [setPlayerArrayFull]);

  useEffect(() => {
    if (logout) {
      fetchData()
      setLoaded(false)
    }
  }, [logout]);

  useEffect(() => {
    fillPlayerArray();
  }, [playerArrayFull])
  useEffect(() => {
    okToCrash()
  }, [shouldCrash])
  return (
    <div>
      {!loaded
        ? (<LoadingDots text={"The app is loading"} fontSize={24} align={'center'} />)
        : <>
          {
            !loggedIn
              ? < Login />
              : !playerArrayFull
                ? <GatherLeagueInfo />
                : <Home user={user} logoutClick={logoutClick} />
          }
        </>
      }
    </div>
  )
}

