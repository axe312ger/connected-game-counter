import openSocket from 'socket.io-client'
const host = process.env.NODE_ENV === 'production' ? 'https://connected-game-counter-server.now.sh' : 'http://localhost:8000'
const socket = openSocket(host)

export default socket
