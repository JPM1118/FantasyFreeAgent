import React, { useState, useEffect } from 'react';

import appStyles from './app.module.scss';
import Login from './components/login/login';
import Home from './components/home/home';
import GatherLeagueInfo from './components/gatherLeagueInfo/gatherLeagueInfo';
import axios from 'axios';

const App = () => {
  const [loaded, setLoaded] = useState(false)
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(null);
  const [playerArrayFull, setPlayerArrayFull] = useState(null);
  const [logout, setLogout] = useState(false)



  const fetchData = async () => {
    const result = await axios({
      url: `${process.env.REACT_APP_BACKEND}/getUser`,
      withCredentials: true
    });
    const data = result.data
    setUser(data.user);
    setLoggedIn(data.loggedIn);
    setPlayerArrayFull(data.playerArrayFull)
    setLoaded(true);
    debugger;
  }
  const fillPlayerArray = async () => {
    console.log('request start')
    if (playerArrayFull === false) {
      await axios({
        url: `${process.env.REACT_APP_BACKEND}/fillPlayerArray`,
        withCredentials: true
      })
      console.log('request end')
      setPlayerArrayFull(true)
    } else {
      console.log('playerArrayFull')
    }
  }
  const logoutClick = async () => {
    console.log('clicked')
    await axios({
      url: `${process.env.REACT_APP_BACKEND}/auth/logout`,
      withCredentials: true,
    })
    setLogout(true)
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





  return (
    <div className="App">
      <div className={appStyles.content}>
        <h1 className={appStyles.title}>Fantasy Free Agents</h1>
        {!loaded
          ? (<div>App is loading...</div>)
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
    </div>
  )
}

export default App;