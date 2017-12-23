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
    this.increment = this.increment.bind(this)
    this.decrement = this.decrement.bind(this)
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
    const { player } = this.props
    const score = match.scores
      .find((score) => score.player.id === player.id)
      .score
    this.setState({match, score})
  }
  increment () {
    const { player } = this.props
    const { score, match } = this.state
    const newScore = score + 1
    this.setState({ score: newScore })
    socket.emit('increment', {matchId: match.id, playerId: player.id})
  }
  decrement () {
    const { player } = this.props
    const { score, match } = this.state
    const newScore = score - 1
    this.setState({ score: newScore })
    socket.emit('decrement', {matchId: match.id, playerId: player.id})
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
        <h3>{player.name} ({player.id})</h3>
        { match && (
          <div>
            <h2>{match.title}</h2>
            <ol>
              {
                match.scores
                  .map((score) => (
                    <li key={score.player.id}>
                      <p><strong>{score.player.name}:</strong> {score.score}</p>
                    </li>
                  ))
              }
            </ol>
          </div>
        )}
        <hr />
        <div>
          <h1>{score}</h1>
          <button onClick={this.increment}>➕</button>
          <button onClick={this.decrement}>➖</button>
        </div>
      </div>
    )
  }
}

export default withRouter(Match)
