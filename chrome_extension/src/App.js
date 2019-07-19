import React from 'react';

import appStyles from './app.module.scss';

import ErrorBoundary from './components/errorBoundary/errorBoundary';
import DisplayedApp from './components/displayedApp';


const App = () => {

  return (
    <div className="App">
      <div className={appStyles.content}>
        <h1 className={appStyles.title}>Fantasy Free Agents</h1>
        <ErrorBoundary>
          <DisplayedApp />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App;