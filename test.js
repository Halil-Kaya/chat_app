const RoomManager = require('./utils/room-manager')

const roomManager = new RoomManager()

roomManager.addRoom('devrem','ASC11FFA','halil')
roomManager.addRoom('devrem','ASC11FFA','halil')
roomManager.addUserToRoom('devrem','ASC11FFA','halil')
roomManager.addUserToRoom('devrem','AFEQWe','yusa')
roomManager.addRoom('karahan','ASC11FFA','halil')
roomManager.addUserToRoom('karahan','AFEQWe','yusa')


roomManager.getAllRooms().forEach(room => {
    console.log(room)
})