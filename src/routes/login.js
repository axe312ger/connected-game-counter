import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import styled from 'styled-components'
import {
  Grid,
  Typography,
  CircularProgress
} from '@material-ui/core'

import socket from '../api.js'

const Page = styled.div`
  padding: 1rem;
`

class Login extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    player: PropTypes.object.isRequired,
    activeMatch: PropTypes.string
  }
  constructor (props) {
    super(props)
    this.loginConfirmed = this.loginConfirmed.bind(this)
    this.loginFailed = this.loginFailed.bind(this)
    socket.emit('loginPlayer', this.props.player.id)
  }
  componentDidMount () {
    socket.on('loginConfirmed', this.loginConfirmed)
    socket.on('loginFailed', this.loginFailed)
  }
  componentWillUnmount () {
    socket.removeEventListener('registrationConfirmed', this.registrationConfirm)
  }
  loginConfirmed (player) {
    console.log('login confirmed', player)
    const { activeMatch } = this.props
    if (activeMatch) {
      return this.props.history.push(`/match/${activeMatch}`)
    }
    this.props.history.push('/create-or-join-match')
  }
  loginFailed () {
    console.log('login failed', this.props.player)
    this.props.history.push('/register')
  }
  render () {
    return (
      <Page>
        <Grid container direction='column' alignItems='center' spacing={24}>
          <Grid item xs>
            <CircularProgress />
          </Grid>
          <Grid item xs={12}>
            <Typography type='title'>Logging you in...</Typography>
          </Grid>
        </Grid>
      </Page>
    )
  }
}

export default withRouter(Login)
