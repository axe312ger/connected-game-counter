import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import socket from '../api.js'

class Register extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    setPlayer: PropTypes.func.isRequired
  }
  state = {
    name: window.localStorage.getItem('name') || ''
  }
  constructor (props) {
    super(props)
    this.handleSetName = this.handleSetName.bind(this)
    this.handleRegister = this.handleRegister.bind(this)
    this.registrationConfirm = this.registrationConfirm.bind(this)
  }
  componentDidMount () {
    socket.on('registrationConfirmed', this.registrationConfirm)
  }
  componentWillUnmount () {
    socket.removeEventListener('registrationConfirmed', this.registrationConfirm)
  }
  registrationConfirm (player) {
    this.props.setPlayer(player)
    this.props.history.push('/create-or-join-match')
  }
  handleSetName (e) {
    const name = e.target.value
    window.localStorage.setItem('name', name)
    this.setState({
      name
    })
  }
  async handleRegister (e) {
    const { name } = this.state

    if (!name.trim().length) {
      return window.alert('Please enter a name!')
    }

    const player = {
      name
    }

    socket.emit('registerPlayer', player)
  }
  render () {
    return (
      <div>
        <h1>Registration:</h1>
        <fieldset>
          <label htmlFor='name'>Choose name:</label>
          <input id='name' defaultValue={this.state.name} onChange={this.handleSetName} />
        </fieldset>
        <button onClick={this.handleRegister}>Continue</button>
      </div>
    )
  }
}

export default withRouter(Register)
