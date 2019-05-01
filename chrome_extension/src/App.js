import React, { useState, useEffect } from 'react';

import appStyles from './app.module.scss';
import Login from './components/login/login';
import Home from './components/home/home';
import axios from 'axios';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const result = await axios({
        url: 'http://lvh.me/getUser',
        withCredentials: true
      });
      setUser(result.data)
    }
    fetchData()
    // console.log(user);
  }, []);
  return (

    <div className="App">
      <div className={appStyles.content}>
        {console.log('1', user)}
        {!user ? (<div />)
          : <>
            <h1 className={appStyles.title}>Fantasy Free Agents</h1>
            {
              user.id
                ? <Home user={user} />
                : < Login />
            }
          </>
        }
        {console.log('2', user)}
      </div>
    </div>
  )
}

export default App;