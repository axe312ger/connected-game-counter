import React, { Component } from 'react'
import { Link } from 'react-router-dom'
export default class CreateOrJoinMatch extends Component {
  render () {
    return (
      <div>
        <Link to='/create-match'>Create Match</Link>
        <Link to='/join-match'>Join Match</Link>
      </div>
    )
  }
}
