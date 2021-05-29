const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const UserManager = require('./utils/user-manager')
const MessageManager = require('./utils/message-manager')
const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname,'public')))

const userManager = new UserManager()
const messageManager = new MessageManager()


app.get('/messages/:messageRoom',(req,res,next) => {

    res.send(messageManager.getMessages(req.params.messageRoom))
})




io.on('connection',(socket) => {


    socket.emit('onlineUsers',userManager.getUsers())


    socket.on('firstConnect',({username,profileImage}) => {
        userManager.userJoin(socket.id,username,profileImage)
        socket.broadcast.emit('onlineUsers',userManager.getUsers())
        socket.emit('firstConnectId',socket.id)
    })


    socket.on('message',({whoMessage,userId,username,message}) => {

        const createdMessage = messageManager.addMessage(whoMessage,userId,username,message)

        if(whoMessage.includes('_$_')){
            whoMessage = whoMessage.replace(userId,'')
            whoMessage = whoMessage.replace('_$_','')
        }

        socket.to(whoMessage).emit('message',createdMessage)
    })

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