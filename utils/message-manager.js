
class Message{


    constructor(messageRoom,userId,username,message,time){
        this.messageRoom = messageRoom;
        this.userId = userId;
        this.message = message;
        this.username = username
        this.time = time;
    }

}

module.exports = class MessageManager{

    constructor(){
        this.messages = []
        this.today = new Date();
    }

    addMessage(messageRoom,userId,username,message){
        const time = this.today.getHours() + ":" + this.today.getMinutes()
        this.messages.push(new Message(messageRoom,userId,username,message,time))
    }

    getMessages(messageRoom){
        
        if(messageRoom.includes('_$_')){

            const splitedMessageRoom = messageRoom.split('_$_')

            return this.messages
                .filter(message => message.messageRoom.includes(splitedMessageRoom[0]) && message.messageRoom.includes(splitedMessageRoom[1]))

        }

        return this.messages
            .filter(message => message.messageRoom == messageRoom)
    }


}