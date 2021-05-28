const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const UserManager = require('./utils/users')
const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname,'public')))



const userManager = new UserManager()

io.on('connection',(socket) => {


    socket.emit('onlineUsers',userManager.getUsers())


    socket.on('firstConnect',({username,profileImage}) => {
        userManager.userJoin(socket.id,username,profileImage)
        socket.broadcast.emit('onlineUsers',userManager.getUsers())
        socket.emit('firstConnectId',socket.id)
    })


    //tek bir cliente
    socket.emit('message','Welcome to ChatCord!')

    //yeni bagli client disindaki butun clientlere
    socket.broadcast.emit('message','A user has joined the chat')

    //butun clientlere
    //io.emit()

    //client disconnect oldugunda
    socket.on('disconnect',() => {


        userManager.userLeave(socket.id)

        io.emit('onlineUsers',userManager.getUsers())

    })

})


const PORT = 3000 || process.env.PORT;


server.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`)
})