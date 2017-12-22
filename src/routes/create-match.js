import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import socket from '../api.js'

class CreateMatch extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }
  state = {
    playerId: window.localStorage.getItem('playerId'),
    title: null
  }
  constructor (props) {
    super(props)
    this.handleSetTitle = this.handleSetTitle.bind(this)
    this.handleCreateMatch = this.handleCreateMatch.bind(this)
    this.matchCreated = this.matchCreated.bind(this)
  }
  componentDidMount () {
    socket.on('matchCreated', this.matchCreated)
  }
  componentWillUnmount () {
    socket.removeEventListener('matchCreated', this.matchCreated)
  }
  matchCreated (match) {
    console.log('match created', match)
    this.props.history.push(`/match/${match.id}`)
  }
  handleSetTitle (e) {
    const title = e.target.value
    this.setState({
      title
    })
  }
  handleCreateMatch (e) {
    const { title } = this.state

    if (!title.trim().length) {
      return window.alert('Please enter a match title!')
    }

    socket.emit('createMatch', { title })
  }
  render () {
    return (
      <div>
        <h1>Create Match:</h1>
        <fieldset>
          <label htmlFor='name'>Title:</label>
          <input id='name' onChange={this.handleSetTitle} />
        </fieldset>
        <button onClick={this.handleCreateMatch}>Create match</button>
      </div>
    )
  }
}

export default withRouter(CreateMatch)
