const fs = require('fs')

function getInitialState () {
  let state = {
    players: new Map(),
    matches: new Map()
  }

  if (fs.existsSync('./state.json')) {
    state = JSON.parse(fs.readFileSync('./state.json'))
    state.players = new Map(state.players)
    state.matches = new Map(state.matches)
  }

  return state
}

function storeState (state) {
  state.players = [...state.players]
  state.matches = [...state.matches]
  const stateString = JSON.stringify(state, null, 2)
  fs.writeFileSync('./state.json', stateString)
}

module.exports = {
  getInitialState,
  storeState
}
