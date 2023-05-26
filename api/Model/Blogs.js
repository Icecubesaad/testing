const mongoose = require("mongoose")
const {Schema} = mongoose;
const Model = new Schema({
    Title:{
        type:String,
        require:true
    },
    Description:{
        type:String,
        require:true
    },
    Tags:{
        type:Array
    },
    Date:{
        type:Array
    },
    User:{
        type:String,
    },
    Id:{
        type:String
    },
    Likes:{
        type:Number
    },
    Type:{
        type:String
    },
    Image:{
        type:String
    }
})
const BlogsModel = mongoose.model("Blogs",Model)
BlogsModel.createIndexes()
module.exports = BlogsModel