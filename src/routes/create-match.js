import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import styled from 'styled-components'
import { Typography, FormGroup, Button, TextField } from '@material-ui/core'

import socket from '../api.js'

const Page = styled.div`
  padding: 1rem;
  flex-grow: 1;
`

class CreateMatch extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    setMatch: PropTypes.func.isRequired
  }
  state = {
    title: null
  }
  constructor (props) {
    super(props)
    this.handleSetTitle = this.handleSetTitle.bind(this)
    this.handleCreateMatch = this.handleCreateMatch.bind(this)
    this.matchCreated = this.matchCreated.bind(this)
  }
  componentDidMount () {
    socket.on('matchCreated', this.matchCreated)
  }
  componentWillUnmount () {
    socket.removeEventListener('matchCreated', this.matchCreated)
  }
  matchCreated (match) {
    this.props.setMatch(match)
    this.props.history.push(`/match/${match.id}`)
  }
  handleSetTitle (e) {
    const title = e.target.value
    this.setState({
      title
    })
  }
  handleCreateMatch (e) {
    const { title } = this.state

    if (!title.trim().length) {
      return window.alert('Please enter a match title!')
    }

    socket.emit('createMatch', { title })
  }
  render () {
    return (
      <Page>
        <Typography type='title'>Create Match:</Typography>
        <FormGroup>
          <TextField
            required
            label='Name of the match'
            margin='normal'
            id='name'
            defaultValue={this.state.title}
            onChange={this.handleSetTitle}
          />
        </FormGroup>
        <Button
          onClick={this.handleCreateMatch}
          variant='raised'
          color='primary'
        >
          Create match
        </Button>
      </Page>
    )
  }
}

export default withRouter(CreateMatch)
