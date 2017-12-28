import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import QrReader from 'react-qr-reader'

import styled from 'styled-components'
import {
  Grid,
  Typography,
  FormGroup,
  TextField,
  Button,
  Paper
} from 'material-ui'

const Page = styled.div`
  flex-grow: 1;
`

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
      <Page>
        <Grid container>
          <Grid item xs={12}>
            <Typography type='headline'>Join Match:</Typography>
            <Typography>Scan QR-Code from other player or enter match ID below</Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container justify='center'>
              <Grid item style={{ width: '100%', maxWidth: '65vh' }}>
                <Paper>
                  <QrReader
                    delay={200}
                    onError={this.handleError}
                    onScan={this.handleScan}
                    showViewFinder
                  />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <FormGroup>
              <TextField
                id='id'
                label='Match ID:'
                margin='normal'
                value={matchId}
                onChange={this.handleSetMatchId}
              />
              <Button raised color={'primary'} onClick={this.joinMatch}>Join match</Button>
            </FormGroup>
          </Grid>
        </Grid>
      </Page>
    )
  }
}

export default withRouter(JoinMatch)
