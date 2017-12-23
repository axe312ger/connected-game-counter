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
      .sort((a, b) => a.score - b.score)

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
      console.log('player', player.name, 'joining', matchId)
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

    client.on('disconnect', (e) => {
      console.log('disconnect', e, client.id)
    })
  })

  const port = 8000
  io.listen(port)
  console.log('listening on port ', port)
}
