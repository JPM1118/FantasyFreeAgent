import React, { Component } from 'react'
import errorBoundaryStyles from './errorBoundary.module.scss'

export default class ErrorBoundary extends Component {
  state = { error: null, errorInfo: null }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <div className={errorBoundaryStyles.content}>
          <h2>Error:</h2>
          <h3>Whoops! Something went wrong. Please click out of the window and reopen.</h3>
        </div>
      );
    }
    return this.props.children;
  }

}
