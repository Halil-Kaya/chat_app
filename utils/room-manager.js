class Room{

    constructor(roomName,users){
        this.roomName = roomName;
        this.users = users;
        
    }

}

module.exports = class RoomManager{

    constructor(){
        this.rooms = []
    }

    //odayı eklerse true eklemezse false donuyor
    addRoom(roomName,userId,username){

        if(!this.getRoomByName(roomName)){

            this.rooms.push(new Room(roomName,[{userId,username}]))
            return true;
        }

        return false;
    }

    getRoomByName(roomName){
        return this.rooms.find(room => room.roomName == roomName)
    }

    addUserToRoom(roomName,userId,username){

        
        this.rooms.forEach(room => {

            if(room.roomName == roomName){

                let isThereUser = false;
                room.users.forEach(user => {

                    if(user.userId == userId){
                        isThereUser = true
                    }

                })

                if(!isThereUser){
                    room.users.push({userId,username})
                }
                
            }

        })

    }

    leaveRoom(userId){

        this.rooms.forEach(room => {

            const index = room.users.findIndex(user => user.userId == userId)

            if(index != -1){

                room.users.splice(index, 1)                

            }

        })

    }

    getAllRooms(){
        return this.rooms;
    }



}