const emojiBtn = document.querySelector('#emojiBtn')
const emojiPicker = document.querySelector('#emojiPicker')
const userImageSection = document.querySelector('#userImage')
const usernameSection = document.querySelector('#username')
const textInput = document.querySelector('#text')
const messageContentList = document.querySelector('.message-content')
const selectFileInput = document.querySelector('#selectFile')
const fileElem = document.querySelector('#fileElem')

const onlineUsersList = document.querySelector('.online-users')
const roomsList = document.querySelector('.rooms')
const newRoomNameInput = document.querySelector('#create-room-input')
const btnAddRoom = document.querySelector('#btnAddRoom')

messageContentList.scrollTop = messageContentList.scrollHeight

selectFileInput.addEventListener('click',() =>{

    if(fileElem){
        fileElem.click()
    }
        
},false)

fileElem.addEventListener("change", handleFiles, false);

function handleFiles(){
    const fileList = this.files;
}

btnAddRoom.addEventListener('click',() => {
    console.log(newRoomNameInput.value)
})

emojiBtn.addEventListener('click',() => {
    emojiPicker.style.display = emojiPicker.style.display == 'block' ? 'none' : 'block'
})

emojiPicker.addEventListener('emoji-click',event => {
    textInput.value += event.detail.unicode
})

const {username,profileImage}  = Qs.parse(location.search,{
    ignoreQueryPrefix : true
})

try{
    userImageSection.src = profileImage.length > 5 ? profileImage : userImageSection.src
}catch(e){}
usernameSection.innerText = username;

console.log(onlineUsersList)

onlineUsersList.addEventListener('click',(e) => {


    console.log(e)

})
