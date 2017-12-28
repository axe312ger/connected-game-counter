import React, { Component } from 'react'
import { BrowserRouter } from 'react-router-dom'

import Main from './Main'

export default class AppWrapper extends Component {
  render () {
    return (
      <BrowserRouter>
        <Main />
      </BrowserRouter>
    )
  }
}
