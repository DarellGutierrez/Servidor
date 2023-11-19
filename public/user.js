const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

//cuando nos logeemos vamos a comparar el password ingresado con el que tiene la bd:
UserSchema.methods.isCorrectPassword = function(password, callback){
    if(this.password === password){
        callback(null, true);
    }else{
        callback(null, false);
    }
}

module.exports = mongoose.model("User", UserSchema);