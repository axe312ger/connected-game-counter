import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import styled from 'styled-components'
import {
  Grid,
  Typography,
  Button
} from 'material-ui'

const Page = styled.div`
  padding: 1rem;
`

const OuterGrid = styled(Grid)`
  min-height: 80vh;
`

export default class CreateOrJoinMatch extends Component {
  static propTypes = {
    player: PropTypes.object.isRequired
  }
  render () {
    const { player } = this.props
    return (
      <Page>
        <OuterGrid
          container
          alignItems='center'
          direction='column'
          justify='space-around'
          spacing={24}
        >
          <Grid item>
            <Typography type='headline'>{`Hello ${player.name}`}</Typography>
            <Typography>Your player id is: {player.id}</Typography>
          </Grid>
          <Grid item>
            <Button component={Link} to='/create-match' raised color={'primary'}>Create Match</Button>
          </Grid>
          <Grid item>
            <Button component={Link} to='/join-match' raised color={'secondary'}>Join Match</Button>
          </Grid>
        </OuterGrid>
      </Page>
    )
  }
}
