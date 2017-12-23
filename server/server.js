const Socket = require('socket.io')
const hri = require('human-readable-ids').hri

const { storeState } = require('./state')

module.exports = function startSocketServer (state) {
  function getUniqueId () {
    const id = hri.random()
    if (state.players.has(id)) {
      return getUniqueId()
    }
    return id
  }

  function sendMatchStateToAll (match) {
    const players = Object.keys(match.scores)
      .map((playerId) => state.players.get(playerId))

    const scores = Object.keys((match.scores))
      .map((playerId) => ({
        score: match.scores[playerId],
        player: state.players.get(playerId)
      }))
      .sort((a, b) => {
        if (a.score === b.score) {
          return a.player.name.localeCompare(b.player.name)
        }
        return b.score - a.score
      })

    const enrichedMatch = {
      ...match,
      scores
    }

    for (let player of players) {
      const client = io.sockets.connected[player.socketId]
      if (client) {
        console.log('Notifing', player.id, 'about match updates')
        client.emit('matchUpdated', enrichedMatch)
      }
    }
  }

  const io = Socket()

  io.on('connection', (client) => {
    console.log('Client connected:', client.id)

    client.on('registerPlayer', (player) => {
      const playerId = getUniqueId()
      const enrichedPlayer = {
        id: playerId,
        socketId: client.id,
        ...player
      }
      console.log({enrichedPlayer})
      state.players.set(playerId, enrichedPlayer)
      storeState(state)
      client.emit('registrationConfirmed', enrichedPlayer)
    })

    client.on('loginPlayer', (playerId) => {
      const player = state.players.get(playerId)
      if (player) {
        player.socketId = client.id
        console.log('loginConfirmed', playerId)
        state.players.set(playerId, player)
        storeState(state)
        return client.emit('loginConfirmed', player)
      }
      console.log('loginFailed', playerId)
      client.emit('loginFailed', { msg: 'Player not found' })
    })

    client.on('createMatch', (match) => {
      const matchId = getUniqueId()
      const enrichedMatch = {
        id: matchId,
        scores: {},
        ...match
      }
      console.log({enrichedMatch})
      state.matches.set(matchId, enrichedMatch)
      storeState(state)
      client.emit('matchCreated', enrichedMatch)
    })

    client.on('joinMatch', ({matchId, player}) => {
      console.log('player', `${player.name}, (${player.id})`, 'joining match', matchId)
      const match = state.matches.get(matchId)
      if (match && !Object.keys(match.scores).includes(player.id)) {
        console.log('player is new to match')
        match.scores = {
          ...match.scores,
          [player.id]: 0
        }
        state.matches.set(matchId, match)
        storeState(state)
        return
      } else {
        console.log('player already part of the match')
      }
      sendMatchStateToAll(match)
    })

    client.on('increment', ({playerId, matchId}) => {
      const match = state.matches.get(matchId)
      if (match) {
        if (playerId in match.scores) {
          const score = match.scores[playerId]
          match.scores[playerId] = score + 1
          state.matches.set(matchId, match)
          storeState(state)
          sendMatchStateToAll(match)
          return
        }
      }

      console.error('invalid player or match', playerId, matchId)
    })

    client.on('decrement', ({playerId, matchId}) => {
      const match = state.matches.get(matchId)
      if (match) {
        if (playerId in match.scores) {
          const score = match.scores[playerId]
          match.scores[playerId] = score - 1
          state.matches.set(matchId, match)
          storeState(state)
          sendMatchStateToAll(match)
          return
        }
      }

      console.error('invalid player or match', playerId, matchId)
    })

    client.on('disconnect', (e) => {
      console.log('disconnect', e, client.id)
    })
  })

  const port = 8000
  io.listen(port)
  console.log('listening on port ', port)
}
