const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname,'public')))

io.on('connection',(socket) => {

    console.log('New WS Connection...')

    //tek bir cliente
    socket.emit('message','Welcome to ChatCord!')

    //yeni bagli client disindaki butun clientlere
    socket.broadcast.emit('message','A user has joined the chat')

    //butun clientlere
    //io.emit()

    //client disconnect oldugunda
    socket.on('disconnect',() => {

        //butun clientlere kullanicinin ayrildigi mesajını veriyor
        io.emit('message','A user has left the chat')

    })

})


const PORT = 3000 || process.env.PORT;


server.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`)
})