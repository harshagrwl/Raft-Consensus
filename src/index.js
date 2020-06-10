const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

const generateMessage = (data) => {
    return {
        username: data.username,
         message: data.message,
         createdAt: new Date().getTime()
     }
 }

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('sendMessage', (data, callback) => {
        io.emit('message', generateMessage(data))
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has disconnected'))
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})