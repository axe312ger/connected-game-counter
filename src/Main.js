import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter, Route, Switch } from 'react-router-dom'

import Register from './routes/register'
import CreateOrJoinMatch from './routes/create-or-join-match'
import Login from './routes/login'

class Main extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }
  state = {
    results: [],
    playerId: window.localStorage.getItem('playerId') || null
  }
  componentDidMount () {
    const { playerId } = this.state
    if (!playerId) {
      return this.props.history.push('/register')
    }
    return this.props.history.push('/login')
  }
  render () {
    return (
      <div>
        <Switch>
          <Route path='/register' component={Register} />
          <Route path='/login' component={Login} />
          <Route path='/create-or-join-match' component={CreateOrJoinMatch} />
        </Switch>
      </div>
    )
  }
}

export default withRouter(Main)
