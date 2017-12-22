import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter, Route, Switch } from 'react-router-dom'

import Register from './routes/register'
import CreateOrJoinMatch from './routes/create-or-join-match'
import Login from './routes/login'
import CreateMatch from './routes/create-match'

class Main extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }
  state = {
    player: null,
    match: null,
    score: 0
  }
  constructor (props) {
    super(props)

    this.setPlayer = this.setPlayer.bind(this)

    console.log(this.state)

    if (window.localStorage.hasOwnProperty('state')) {
      try {
        const state = JSON.parse(window.localStorage.getItem('state', state))
        this.state = state
      } catch (e) {
        console.error(e)
      }
    }
  }
  setPlayer (player) {
    this.setState({player})
  }
  componentDidUpdate () {
    window.localStorage.setItem('state', JSON.stringify(this.state))
  }
  componentDidMount () {
    console.log('initial state', this.state)
    const { player } = this.state
    if (!player) {
      return this.props.history.push('/register')
    }
    return this.props.history.push('/login')
  }
  componentWillUpdate () {
    console.log('main update', this.state)
  }
  render () {
    const { player } = this.state
    return (
      <div>
        <Switch>
          <Route path='/register' render={() => <Register setPlayer={this.setPlayer} />} />
          <Route path='/login' render={() => <Login player={player} />} />
          <Route path='/create-or-join-match' render={() => <CreateOrJoinMatch player={player} />} />
          <Route path='/create-match' component={CreateMatch} />
        </Switch>
      </div>
    )
  }
}

export default withRouter(Main)
