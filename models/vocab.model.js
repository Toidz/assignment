const mongoose = require("mongoose")
const schema = new mongoose.Schema({
    lessonId: String,
    word: String,
    image: String,
    deleted:{
        type:Boolean,
        default:false
    }
},{
    timestamps : true
})
const Vocab = mongoose.model("Vocab",schema,"vocabs")
module.exports = Vocab
