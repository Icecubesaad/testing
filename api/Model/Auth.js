const mongoose = require("mongoose")
const {Schema} = mongoose
const Auth = new Schema({
    UserName:{
        type:String,
        require:true
    },
    Email:{
        type:String,
        require:true
    },
    Password:{
        type:String,
        require:true
    },
    Liked:{
        type:Array
    },
    Image: {
        type: String,
      },
    
})
const AuthModel = mongoose.model("User",Auth)
AuthModel.createIndexes()
module.exports = AuthModel