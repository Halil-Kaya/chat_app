const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const multer = require('multer')

//gonderilen dosyanin nereye kaydedilecegini configure edildigi yer
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

//manager objelerim
const userManager = new UserManager()
const messageManager = new MessageManager()
const roomManager = new RoomManager()

//parametre olarak messageRoom gonderililen GET istegine karsilik o odanın mesajlarini donuyor
app.get('/messages/:messageRoom',(req,res,next) => {

    res.send(messageManager.getMessages(req.params.messageRoom))
})

//dosya gonderme isleminde /upload kismina dosya yukluyor bu islemden sonra dosyanin pathi donduruluyor
app.post('/upload',upload.single('file'),(req,res,next) => {
    res.send('/uploads/' + req.filePath)
})




io.on('connection',(socket) => {


    //online kullanicilari gonderiyor
    socket.emit('onlineUsers',userManager.getUsers())

    //gruplari donuyor
    socket.emit('chatRooms',roomManager.getAllRooms())


    //ilk baglanmada kullanicinin adi ve profil resmini aliyorum
    //ayrica kullaniciya socket id sini gonderiyorum
    socket.on('firstConnect',({username,profileImage}) => {
        userManager.userJoin(socket.id,username,profileImage)
        socket.broadcast.emit('onlineUsers',userManager.getUsers())
        socket.emit('firstConnectId',socket.id)
    })

    //gonderililen bilgilere gore oda olusturup butun odalari geri donuyor
    socket.on('createRoom',({newRoomName,username,userId}) => {

        roomManager.addRoom(newRoomName,userId,username)

        socket.join(newRoomName)

        io.emit('chatRooms',roomManager.getAllRooms())
        
    })

    //odaya katiliyor bu islemden sonra odalari bi daha gonderiyor
    socket.on('joinRoom',({roomName,username,userId}) => {

        roomManager.addUserToRoom(roomName,userId,username)

        socket.join(roomName)

        io.emit('chatRooms',roomManager.getAllRooms())

    })


    //messaj gonderme islemleri burda gerceklesiyor
    socket.on('message',({whoMessage,userId,username,message}) => {

        //mesaj objesi olusturuyorum
        const createdMessage = messageManager.addMessage(whoMessage,userId,username,message)

        //mesaj atan kiside '_$_' isareti varsa kullanici-kullanici mesajlasma var demektir
        //eger yoksa demekki bu bir grup mesajlasmadir
        if(whoMessage.includes('_$_')){
            whoMessage = whoMessage.replace(userId,'')
            whoMessage = whoMessage.replace('_$_','')
        }

        //eger kisiyse sadece o kisiye grupsa o gruba mesaji atiyor
        socket.to(whoMessage).emit('message',createdMessage)
    })

    //client disconnect oldugunda
    socket.on('disconnect',() => {


        //kullanici ayriliyor
        userManager.userLeave(socket.id)
        //kullaniciyi odadan ayiriyor
        roomManager.leaveRoom(socket.id)

        //odalari ve online kullanicilari gonderiyor
        io.emit('chatRooms',roomManager.getAllRooms())
        io.emit('onlineUsers',userManager.getUsers())

    })

})


const PORT = process.env.PORT || 8080


server.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`)
})