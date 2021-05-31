const emojiBtn = document.querySelector('#emojiBtn')
const emojiPicker = document.querySelector('#emojiPicker')
const userImageSection = document.querySelector('#userImage')
const usernameSection = document.querySelector('#username')
const textInput = document.querySelector('#text')
const messageContentList = document.querySelector('.message-content')
const selectFileInput = document.querySelector('#selectFile')
const fileElem = document.querySelector('#fileElem')
const messageHeaderImg = document.querySelector('#message-header-img')
const messageHeaderName = document.querySelector('#message-header-name')
const onlineUsersList = document.querySelector('.online-users')
const roomsList = document.querySelector('.rooms')
const newRoomNameInput = document.querySelector('#create-room-input')
const btnAddRoom = document.querySelector('#btnAddRoom')
const sendBtn = document.querySelector('#send-btn')
const formSend = document.querySelector('#form-send')

messageContentList.scrollTop = messageContentList.scrollHeight

//kullanicinin bilgilerini aliyorum
let {username,profileImage}  = Qs.parse(location.search,{
    ignoreQueryPrefix : true
})
let userId = ""
let whoMessage = ""

updateUIForUser()

const socket = io()

//kullanici baglaniyor
socket.emit('firstConnect',{username,profileImage})

//kullanici baglandiktan sonra id sini kullaniciya gonderiyor
socket.on('firstConnectId',(id) => {

    userId = id

})

socket.on('message',(message) => {

    addUIForMessageContentFromOtherUser(message)

})

socket.on('chatRooms',(rooms) => {

    updateUIForRoomSection(rooms)

})


//online kullanicilar geliyor
socket.on('onlineUsers',(users) => {

    const onlineUsersHtml = users.map(user => {

        if(user.id === userId) return ''

        return ` 
        <li>
        <a>
            <span class="userId" class="hidden-user-info">${user.id}</span>
            <img src="${user.profileImage}"
                alt="">
            <div class="inner">
                <div class="name">${user.username}</div>
            </div>

        </a>
        </li>
        `
    })

    onlineUsersList.innerHTML = "<ul>" + onlineUsersHtml.join('') + "</ul>"

})



selectFileInput.addEventListener('click',() =>{

    if(fileElem){
        fileElem.click()
    }
        
},false)

fileElem.addEventListener("change", handleFiles, false);

function handleFiles(){
    const fileList = this.files;
    let data = new FormData()
    data.append('file',fileList[0],fileList[0].name)
    fetch('/upload', {
        method: 'POST',
        body: data
    })
    .then(response => response.text())
    .then(text => {
        textInput.value += " " + window.location.origin + text + " "
    })
}


formSend.addEventListener('submit',(e) => {
    e.preventDefault()
    messageSend()
})

//oda ekliyor
btnAddRoom.addEventListener('click',() => {

    const newRoomName = newRoomNameInput.value;
    newRoomNameInput.value = ''

    if(newRoomName){

        socket.emit('createRoom',{newRoomName,username,userId})

    }
    
})

emojiBtn.addEventListener('click',() => {
    emojiPicker.style.display = emojiPicker.style.display == 'block' ? 'none' : 'block'
})

emojiPicker.addEventListener('emoji-click',event => {
    textInput.value += event.detail.unicode
})

sendBtn.addEventListener('click',(e) => {

    messageSend()

})

roomsList.addEventListener('click',(e) => {

    if(e.target.children[1]){

        const roomName = e.target.children[1].children[0].innerText

        socket.emit('joinRoom',{roomName,username,userId})

        whoMessage = roomName

        fetch(`/messages/${roomName}`)
        .then(response => response.json())
        .then(messages => {
            updateUIForMessageContent(messages)
        })

        messageHeaderImg.src = "/img/yesil_oda";
        messageHeaderName.innerText = roomName

    }

})


onlineUsersList.addEventListener('click',(e) => {
    textInput.value = ''
    if(e.target.childNodes[1]){

        //bildirimi siliyorum
        if(e.target.children[3]){
            e.target.removeChild(e.target.children[3])
        }

        let targetUserId = e.target.childNodes[1].innerText
        let messageRoom = targetUserId + "_$_" + userId;
        whoMessage = targetUserId + "_$_" + userId;

        fetch(`/messages/${messageRoom}`)
        .then(response => response.json())
        .then(messages => {
            updateUIForMessageContent(messages)
        })

        messageHeaderImg.src = e.target.childNodes[3].src;
        messageHeaderName.innerText = e.target.childNodes[5].innerText;

    }
})

const today = new Date();


function addUIForMessageContentFromOtherUser(message){

    if(messageRoomAndWhoMessageMatching(message.messageRoom,whoMessage)){

        const messageHtml = `
        <div class="message">
            <div class="bubble">${urlify(message.message)} <span class="username time">${message.username}</span></div>
            <span class="time">${message.time}</span>
        </div>
        `

        messageContentList.innerHTML = messageContentList.innerHTML + messageHtml
        messageContentList.scrollTop = messageContentList.scrollHeight
    }

}



function addUIForMessageContent(message){

    let minutes = today.getMinutes()
    let hours = today.getHours()
    const time = (hours < 10 ? '0'+hours : hours) + ":" + (minutes < 10 ? '0'+minutes : minutes)
    let messageHtml =`
    <div class="message me">
        <div class="bubble">${urlify(message)}</div>
        <span class="time">${time}</span>
    </div>
    `

    messageContentList.innerHTML = messageContentList.innerHTML + messageHtml
    messageContentList.scrollTop = messageContentList.scrollHeight
    textInput.value = ""

}


function updateUIForRoomSection(rooms){

    let roomsHtml = rooms.map(room => {

        let namesOfUsers = room.users.map(user => user.username)

        namesOfUsers = namesOfUsers.join(',').slice(0,20)

        
        return `<li>
            <a>
                <img src="/img/${room.users.findIndex(user => user.userId == userId) == -1 ?'mavi':'yesil'}_oda"
                    alt="">
                <div class="inner">
                    <div class="name">${room.roomName}</div>
                    <div class="message">${namesOfUsers.length == 0?'':namesOfUsers + "..."}</div>
                </div>
                <div class="notification"></div>
            </a>
        </li>`

    })

    roomsList.innerHTML = `<ul>${roomsHtml.join('')}</ul>`

}

function updateUIForMessageContent(messages){

    let messagesHtml = messages.map(message => {
        if(message.userId.includes(userId)){
            return `
            <div class="message me">
                <div class="bubble">${urlify(message.message)}</div>
                <span class="time">${message.time}</span>
            </div>
            `
        }

        return `
        <div class="message">
            <div class="bubble">${urlify(message.message)} <span class="username time">${message.username}</span></div>
            <span class="time">${message.time}</span>
        </div>
        `
    })

    messageContentList.innerHTML = messagesHtml.join('')
    messageContentList.scrollTop = messageContentList.scrollHeight


}


function updateUIForUser(){

    try{
        profileImage = profileImage.length > 10 ? profileImage : 'data:image/jpeg;base64,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'
    }catch(e){
        console.log(e.message)
    }

    userImageSection.src = profileImage
    usernameSection.innerText = username;
}


//mesaji gonderiyor
function messageSend(){

    if(textInput.value && whoMessage){

        let message = textInput.value

        socket.emit('message',{whoMessage,userId,username,message})
        
        addUIForMessageContent(message)
    }

}

function messageRoomAndWhoMessageMatching(messageRoom,whoMessage){

    if(!(whoMessage || messageRoom)) return false

    if(whoMessage.includes('_$_') && messageRoom.includes('_$_')){
        let splitedWhoMessage = whoMessage.split('_$_')
        if(messageRoom.includes(splitedWhoMessage[0]) && messageRoom.includes(splitedWhoMessage[1])){
            return true
        }

        let userWhoMessageSend = messageRoom;
        userWhoMessageSend = userWhoMessageSend.replaceAll(userId,'')
        userWhoMessageSend = userWhoMessageSend.replaceAll('_$_','')

        let onlineUsersListHtml = [...onlineUsersList.children[0].children]

        onlineUsersListHtml.forEach(liElement => {
            
            if(userWhoMessageSend.includes(liElement.children[0].children[0].innerText) && !(liElement.children[0].children[3])){

                const divElement = document.createElement('div')
                divElement.innerText = "!"
                divElement.classList.add('notification')
                liElement.children[0].appendChild(divElement)

            }

        })

        return false
    }

    return messageRoom == whoMessage
}

function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
      return '<a class="file-url" target="_blank" href="' + url + '">' + url + '</a>';
    })
    
}
