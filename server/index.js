const startSocketServer = require('./server')
const { getInitialState } = require('./state')

const state = getInitialState()

startSocketServer(state)
