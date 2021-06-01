class User{
    
    constructor(id,username,profileImage) {
        this.id = id;
        this.username = username;
        this.profileImage = profileImage;
    }

}

module.exports = class UserManager{

    constructor(){
        this.users = []
    }

    //kullanici ekliyor
    userJoin(id,username,profileImage){

        const user = new User(id,username,profileImage);

        this.users.push(user)

        return user;
    }

    //kullaniciyi id ye gore getiriyor
    getCurrentUser(id){
        return this.users.find(user => user.id === id)
    }

    //id si gonderilen kullaniciyi siliyor
    userLeave(id){
        const index = this.users.findIndex(user => user.id === id);

        if(index !== -1){
            return this.users.splice(index,1)[0];
        }
    }

    //id ye gore kullanici adini getiriyor
    getUsernameById(userId){
        return this.users.find(user => user.id == userId).username
    }

    //kullanicilari getiriyor
    getUsers(){
        return this.users;
    }

}

