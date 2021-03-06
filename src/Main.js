import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter, Route, Switch } from 'react-router-dom'

import {
  AppBar,
  Toolbar,
  Typography
} from '@material-ui/core'

import Register from './routes/register'
import CreateOrJoinMatch from './routes/create-or-join-match'
import Login from './routes/login'
import CreateMatch from './routes/create-match'
import JoinMatch from './routes/join-match'
import Match from './routes/match'

class Main extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }
  state = {
    player: null,
    match: null,
    activeMatch: null,
    score: 0
  }
  constructor (props) {
    super(props)

    this.setPlayer = this.setPlayer.bind(this)
    this.setMatch = this.setMatch.bind(this)

    if (window.localStorage.hasOwnProperty('state')) {
      try {
        const state = JSON.parse(window.localStorage.getItem('state'))
        this.state = state
      } catch (e) {
        console.error(e)
      }
    }
  }
  setPlayer (player) {
    console.log('player created', player)
    this.setState({player})
  }
  setMatch (match) {
    console.log('match created', match)
    this.setState({match})
  }
  componentDidUpdate () {
    window.localStorage.setItem('state', JSON.stringify(this.state))
  }
  componentDidMount () {
    console.log('initial state', this.state)
    const { player } = this.state
    const activeMatch = this.props.history.location.pathname.split('/match/')[1]
    this.setState({ activeMatch })
    if (!player) {
      return this.props.history.push('/register')
    }
    return this.props.history.push('/login')
  }
  componentWillUpdate () {
    console.log('main update', this.state)
  }
  render () {
    const { player, activeMatch } = this.state
    return (
      <div>
        <AppBar position='static' color='primary'>
          <Toolbar>
            <Typography type='title' color='inherit'>
              Smart Game Counter
            </Typography>
          </Toolbar>
        </AppBar>
        <Switch>
          <Route path='/register' render={() => <Register setPlayer={this.setPlayer} activeMatch={activeMatch} />} />
          <Route path='/login' render={() => <Login player={player} activeMatch={activeMatch} />} />
          <Route path='/create-or-join-match' render={() => <CreateOrJoinMatch player={player} />} />
          <Route path='/create-match' render={() => <CreateMatch setMatch={this.setMatch} />} />
          <Route path='/join-match' render={() => <JoinMatch />} />
          <Route path='/match/:id' render={() => <Match player={player} />} />
        </Switch>
      </div>
    )
  }
}

export default withRouter(Main)
