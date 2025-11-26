const Vocab = require("../../models/vocab.model")
const Lesson = require("../../models/lesson.model")
module.exports.study = async (req,res)=>{
    const id_less = req.query.id;
    const lessonCurrent = await Lesson.findOne({
        deleted:false,
        _id:id_less
    })
    const vocabList = await Vocab.find({
        lessonId:id_less,
        deleted:false
    })
    res.render("admin/pages/study",{
       pageTitle:"Học bài",
       vocabList:vocabList,
       lessonCurrent:lessonCurrent
    })
}