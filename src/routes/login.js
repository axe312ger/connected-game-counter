import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import socket from '../api.js'

class Login extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }
  state = {
    playerId: window.localStorage.getItem('playerId') || ''
  }
  constructor (props) {
    super(props)
    this.loginConfirmed = this.loginConfirmed.bind(this)
    this.loginFailed = this.loginFailed.bind(this)
    socket.emit('loginPlayer', this.state.playerId)
  }
  componentDidMount () {
    socket.on('loginConfirmed', this.loginConfirmed)
    socket.on('loginFailed', this.loginFailed)
  }
  componentWillUnmount () {
    socket.removeEventListener('registrationConfirmed', this.registrationConfirm)
  }
  loginConfirmed (player) {
    console.log('login confirmed', player)
    this.props.history.push('/create-or-join-match')
  }
  loginFailed () {
    console.log('login failed', this.state.playerId)
    this.props.history.push('/register')
  }
  render () {
    return (
      <div>
        <h1>Logging you in</h1>
      </div>
    )
  }
}

export default withRouter(Login)
