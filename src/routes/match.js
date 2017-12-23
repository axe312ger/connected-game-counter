import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import socket from '../api.js'

class Match extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    player: PropTypes.object.isRequired
  }
  state = {
    match: null,
    score: 0
  }
  constructor (props) {
    super(props)
    this.matchUpdated = this.matchUpdated.bind(this)
  }
  componentDidMount () {
    const { match, player } = this.props
    const matchId = match.params.id

    if (matchId && player) {
      socket.emit('joinMatch', {matchId, player})
    }
    socket.on('matchUpdated', this.matchUpdated)
  }
  componentWillUnmount () {
    socket.removeEventListener('matchUpdated', this.matchUpdated)
  }
  matchUpdated (match) {
    this.setState({match})
  }
  render () {
    const { player } = this.props
    const { match, score } = this.state

    if (!player) {
      return null
    }

    return (
      <div>
        <h1>Current Match:</h1>
        <h3>{player.name}</h3>
        { match && (
          <div>
            <h2>{match.title}</h2>
            <div>{
              match.scores
                .map((score) => (
                  <div key={score.player.id}>
                    <p><strong>{score.player.name}:</strong> {score.score}</p>
                  </div>
                ))
            }</div>
          </div>
        )}
        <hr />
        <div>
          <h1>{score}</h1>
          <button>➕</button>
          <button>➖</button>
        </div>
      </div>
    )
  }
}

export default withRouter(Match)
