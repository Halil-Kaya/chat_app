
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

    //message ekliyor
    addMessage(messageRoom,userId,username,message){

        //mesajin ne zaman atildigini gostermek icin eklemedn once saat ekleniliyor
        let minutes = this.today.getMinutes()
        let hours = this.today.getHours()
        const time = (hours < 10 ? '0'+hours : hours) + ":" + (minutes < 10 ? '0'+minutes : minutes)
        const newMessage = new Message(messageRoom,userId,username,message,time)
        this.messages.push(newMessage)
        return newMessage
    }

    //gonderilen messageRoom parametresine gore mesajlar getiriliyor
    getMessages(messageRoom){
        
        //eger messageRoom da '_$_' isareti bulunuyorsa kullanici-kullanici mesajlasma var demektir
        //ona gore mesajlari getiriyor
        if(messageRoom.includes('_$_')){

            const splitedMessageRoom = messageRoom.split('_$_')
            //_$_ isaretinin solunda ve saginda mesaj atan ve mesaji alan kullanicinin id si var
            //FDVA_$_WERQ ile WERQ_$_FDVA mesaj gruplari ayni olmasi lazim
            //o yuzden sirasina dikkat ederek kontrol etmiyorum bu 2 id yi iceriyor mu diye kontrol ediyorum
            return this.messages
                .filter(message => message.messageRoom.includes(splitedMessageRoom[0]) && message.messageRoom.includes(splitedMessageRoom[1]))

        }
        
        return this.messages
            .filter(message => message.messageRoom == messageRoom)
    }


}