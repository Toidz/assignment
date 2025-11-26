const mongoose = require("mongoose")
const schema = new mongoose.Schema({
    title:String,
    image:String,
    deleted:{
        type:Boolean,
        default:false
    }
},{
    timestamps : true
})
const Lesson = mongoose.model("Lesson",schema,"lessons")
module.exports = Lesson
