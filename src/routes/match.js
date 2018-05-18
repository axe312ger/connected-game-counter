import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import QRCode from 'qrcode.react'

import styled from 'styled-components'
import {
  Grid,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress
} from '@material-ui/core'

import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'

import socket from '../api.js'

const Page = styled.div`
  padding: 1rem;
`

const Section = styled(Paper)`
  padding: 1rem;
`

const host =
  process.env.NODE_ENV === 'production'
    ? 'https://connected-game-counter.now.sh'
    : 'http://localhost'

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
      socket.emit('joinMatch', { matchId, player })
    }

    socket.on('matchUpdated', this.matchUpdated)
  }
  componentWillUnmount () {
    socket.removeEventListener('matchUpdated', this.matchUpdated)
  }
  matchUpdated (match) {
    const { player } = this.props
    const score = match.scores.find(score => score.player.id === player.id)
      .score
    this.setState({ match, score })
  }
  increment () {
    const { player } = this.props
    const { score, match } = this.state
    const newScore = score + 1
    this.setState({ score: newScore })
    socket.emit('increment', { matchId: match.id, playerId: player.id })
  }
  decrement () {
    const { player } = this.props
    const { score, match } = this.state
    const newScore = score - 1
    this.setState({ score: newScore })
    socket.emit('decrement', { matchId: match.id, playerId: player.id })
  }
  render () {
    const { player } = this.props
    const { match, score } = this.state

    if (!player || !match) {
      return (
        <Page>
          <Grid container direction='column' alignItems='center' spacing={24}>
            <Grid item xs>
              <CircularProgress />
            </Grid>
            <Grid item xs={12}>
              <Typography type='title'>Loading match...</Typography>
            </Grid>
          </Grid>
        </Page>
      )
    }

    const matchURI = `${host}/match/${match.id}`

    return (
      <Page>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Typography type='title'>Match: {match.title}</Typography>
          </Grid>
          <Grid item xs={12}>
            <List>
              {match.scores.map((score, index) => (
                <ListItem button key={score.player.id}>
                  <ListItemIcon>
                    <div>{index + 1}.</div>
                  </ListItemIcon>
                  <ListItemText
                    primary={`${score.player.name}: ${score.score} points`}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12}>
            <Section>
              <Grid container spacing={24} justify='center'>
                <Grid item xs={12}>
                  <Typography type='headline'>
                    Your current score: {score}
                  </Typography>
                </Grid>
                <Grid item>
                  <Button
                    variant='fab'
                    color='primary'
                    onClick={this.increment}
                  >
                    <AddIcon />
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant='fab'
                    color='secondary'
                    onClick={this.decrement}
                  >
                    <RemoveIcon />
                  </Button>
                </Grid>
              </Grid>
            </Section>
          </Grid>
          <Grid item xs={12}>
            <Section>
              <Grid container spacing={24} justify='center'>
                <Grid item xs={12}>
                  <Typography type='headline'>Share match:</Typography>
                  <Typography>Match ID: {match.id}</Typography>
                  <Typography>
                    Via link: <a href={matchURI}>{matchURI}</a>
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography>Via QR-Code:</Typography>
                  <QRCode value={matchURI} />
                </Grid>
              </Grid>
            </Section>
          </Grid>
        </Grid>
      </Page>
    )
  }
}

export default withRouter(Match)
