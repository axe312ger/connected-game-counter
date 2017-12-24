import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import QRCode from 'qrcode.react'

import socket from '../api.js'

const host = process.env.NODE_ENV === 'production' ? 'https://connected-game-counter.now.sh' : 'http://localhost'

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

    if (!player || !match) {
      return <div>Please wait...</div>
    }

    const matchURI = `${host}/match/${match.id}`

    return (
      <div>
        <h1>Current Match: {match.title}</h1>
        <h2>Scores:</h2>
        <div>
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
        <hr />
        <div>
          <h3>{player.name} ({player.id}):</h3>
          <h1>{score}</h1>
          <button onClick={this.increment}>➕</button>
          <button onClick={this.decrement}>➖</button>
        </div>
        <hr />
        <p>Share match: <a href={matchURI}>{matchURI}</a></p>
        <QRCode value={matchURI} />
      </div>
    )
  }
}

export default withRouter(Match)
