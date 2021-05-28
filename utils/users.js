/*
User : 
{
    id,
    username,
    profileImage
}
*/

class User{
    
    constructor(id,username,profileImage) {
        this.id = id;
        this.username = username;
        this.profileImage = profileImage;
    }

}

module.exports = class UserManager{

    constructor(){}
    users = [];

    //join user to chat
    userJoin(id,username,profileImage){

        const user = new User(id,username,profileImage);

        this.users.push(user)

        return user;
    }

    //Get Current user 
    getCurrentUser(id){
        return this.users.find(user => user.id === id)
    }

    //user leaves chat
    userLeave(id){
        const index = this.users.findIndex(user => user.id === id);

        if(index !== -1){
            return this.users.splice(index,1)[0];
        }
    }

    //get room users
    getRoomUsers(room){
        return this.users.filter(user => user.room === room);
    }

    getUsers(){
        return this.users;
    }

}

