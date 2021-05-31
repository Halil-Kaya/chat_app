const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const multer = require('multer')

const storage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null,__dirname + '/public/uploads/')
    },
    filename : (req,file,cb) => {
        req.filePath = `${Date.now() + "+" + file.originalname.replaceAll(' ','')}`
        cb(null,`${req.filePath}`)
    }

})
const upload = multer({storage : storage})


const UserManager = require('./utils/user-manager')
const MessageManager = require('./utils/message-manager')
const RoomManager = require('./utils/room-manager')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname,'public')))

app.use(
    express.urlencoded({
      extended: true
    })
  )
  
app.use(express.json())


const userManager = new UserManager()
const messageManager = new MessageManager()
const roomManager = new RoomManager()


app.get('/messages/:messageRoom',(req,res,next) => {

    res.send(messageManager.getMessages(req.params.messageRoom))
})

app.post('/upload',upload.single('file'),(req,res,next) => {
    res.send('/uploads/' + req.filePath)
})




io.on('connection',(socket) => {


    socket.emit('onlineUsers',userManager.getUsers())

    socket.emit('chatRooms',roomManager.getAllRooms())


    socket.on('firstConnect',({username,profileImage}) => {
        userManager.userJoin(socket.id,username,profileImage)
        socket.broadcast.emit('onlineUsers',userManager.getUsers())
        socket.emit('firstConnectId',socket.id)
    })

    socket.on('createRoom',({newRoomName,username,userId}) => {

        roomManager.addRoom(newRoomName,userId,username)

        socket.join(newRoomName)

        io.emit('chatRooms',roomManager.getAllRooms())
        
    })

    socket.on('joinRoom',({roomName,username,userId}) => {

        roomManager.addUserToRoom(roomName,userId,username)

        socket.join(roomName)

        io.emit('chatRooms',roomManager.getAllRooms())

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
        roomManager.leaveRoom(socket.id)


        io.emit('chatRooms',roomManager.getAllRooms())
        io.emit('onlineUsers',userManager.getUsers())

    })

})


const PORT = 3000 || process.env.PORT;


server.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`)
})