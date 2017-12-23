const fs = require('fs')
const { resolve } = require('path')
const stateFile = process.env.NODE_ENV === 'production'
  ? resolve('/tmp', 'state.json')
  : resolve(__dirname, 'state.json')

console.log('Loading state from:', stateFile, 'env:', process.env.NODE_ENV)

function getInitialState () {
  let state = {
    players: new Map(),
    matches: new Map()
  }

  if (fs.existsSync(stateFile)) {
    state = JSON.parse(fs.readFileSync(stateFile))
    state.players = new Map(state.players)
    state.matches = new Map(state.matches)
  }

  console.log('Initial state:', state)

  return state
}

function storeState (state) {
  const cleanState = Object.assign(
    {},
    state,
    {
      players: [...state.players],
      matches: [...state.matches]
    }
  )
  const stateString = JSON.stringify(cleanState, null, 2)
  fs.writeFileSync(stateFile, stateString)
}

module.exports = {
  getInitialState,
  storeState
}
