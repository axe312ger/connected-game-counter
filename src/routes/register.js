import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'

import {
  Grid,
  Paper,
  FormGroup,
  Button,
  TextField,
  Typography
} from 'material-ui'

import ExpandMoreIcon from 'material-ui-icons/ExpandMore'

import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from 'material-ui/ExpansionPanel'

import socket from '../api.js'

const Page = styled.div`
  padding: 1rem;
`

const FormWrapper = styled(Paper)`
  padding: 1rem;
`

class Register extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    setPlayer: PropTypes.func.isRequired,
    activeMatch: PropTypes.string
  }
  state = {
    name: window.localStorage.getItem('name') || ''
  }
  constructor (props) {
    super(props)
    this.handleSetName = this.handleSetName.bind(this)
    this.handleRegister = this.handleRegister.bind(this)
    this.registrationConfirm = this.registrationConfirm.bind(this)
  }
  componentDidMount () {
    socket.on('registrationConfirmed', this.registrationConfirm)
  }
  componentWillUnmount () {
    socket.removeEventListener('registrationConfirmed', this.registrationConfirm)
  }
  registrationConfirm (player) {
    this.props.setPlayer(player)
    const { activeMatch } = this.props
    if (activeMatch) {
      return this.props.history.push(`/match/${activeMatch}`)
    }
    this.props.history.push('/create-or-join-match')
  }
  handleSetName (e) {
    const name = e.target.value
    window.localStorage.setItem('name', name)
    this.setState({
      name
    })
  }
  async handleRegister (e) {
    const { name } = this.state

    if (!name.trim().length) {
      return window.alert('Please enter a name!')
    }

    const player = {
      name
    }

    socket.emit('registerPlayer', player)
  }
  render () {
    return (
      <Page>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography type='headline'>
                  What is this?
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <div>
                  <Typography type='title'>
                    Keep an easy eye on all match scores. Live and for all players.
                  </Typography>
                  <Typography type='paragraph'>
                    Track scores in card, tabletop and other games. Your own and your oppenents. Set up a match and share it via QR-code, no installation required.
                  </Typography>
                </div>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Grid>
          <Grid item xs={12}>
            <FormWrapper>
              <div>
                <Typography type='title'>
                  Let's start - Set up your account:
                </Typography>
                <Typography>
                  We need your name. Simply for other players to identify you. No email and nothing else.
                </Typography>
              </div>
              <FormGroup>
                <TextField
                  required
                  label='Your player name'
                  margin='normal'
                  id='name'
                  defaultValue={this.state.name}
                  onChange={this.handleSetName}
                />
                <Button
                  onClick={this.handleRegister}
                  raised
                  color='primary'
                >Continue</Button>
              </FormGroup>
            </FormWrapper>
          </Grid>
        </Grid>
      </Page>
    )
  }
}

export default withRouter(Register)
