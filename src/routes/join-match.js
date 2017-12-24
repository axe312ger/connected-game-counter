import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import QrReader from 'react-qr-reader'

class JoinMatch extends Component {
  state = {
    matchId: ''
  }
  static propTypes = {
    history: PropTypes.object.isRequired
  }
  constructor (props) {
    super(props)
    this.handleSetMatchId = this.handleSetMatchId.bind(this)
    this.handleScan = this.handleScan.bind(this)
    this.handleError = this.handleError.bind(this)
    this.joinMatch = this.joinMatch.bind(this)
  }
  handleSetMatchId (e) {
    const matchId = e.target.value
    this.setMatchId(matchId)
  }
  setMatchId (matchId) {
    this.setState({
      matchId
    })
  }
  handleScan (result) {
    if (!result) {
      return
    }
    const matchId = result.split('/match/')[1]
    if (matchId) {
      this.setMatchId(matchId)
    }
  }
  handleError (e) {
    console.error(e)
  }
  joinMatch () {
    const { history } = this.props
    const { matchId } = this.state
    history.push(`/match/${matchId}`)
  }
  render () {
    const { matchId } = this.state
    return (
      <div>
        <h1>Join Match:</h1>
        <QrReader
          delay={200}
          onError={this.handleError}
          onScan={this.handleScan}
          style={{ width: '100%', maxWidth: '400px' }}
          showViewFinder
        />
        <fieldset>
          <label htmlFor='id'>Match ID:</label>
          <input id='id' value={matchId} onChange={this.handleSetMatchId} />
        </fieldset>
        <button onClick={this.joinMatch}>Join match</button>
      </div>
    )
  }
}

export default withRouter(JoinMatch)
