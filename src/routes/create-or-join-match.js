import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export default class CreateOrJoinMatch extends Component {
  static propTypes = {
    player: PropTypes.object.isRequired
  }
  render () {
    const { player } = this.props
    return (
      <div>
        <h2>{`Hello ${player.name} (${player.id})`}</h2>
        <Link to='/create-match'>Create Match</Link>
        <Link to='/join-match'>Join Match</Link>
      </div>
    )
  }
}
