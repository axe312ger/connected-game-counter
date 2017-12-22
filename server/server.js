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

  const io = Socket()

  io.on('connection', (client) => {
    console.log('Client connected:', client.id)

    client.on('registerPlayer', (player) => {
      const playerId = getUniqueId()
      const enrichedPlayer = {
        id: playerId,
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
        console.log('loginConfirmed', player)
        return client.emit('loginConfirmed', player)
      }
      console.log('loginFailed', playerId)
      client.emit('loginFailed', { msg: 'Player not found' })
    })

    client.on('disconnect', (e) => {
      console.log('disconnect', e, client.id)
    })
  })

  const port = 8000
  io.listen(port)
  console.log('listening on port ', port)
}
