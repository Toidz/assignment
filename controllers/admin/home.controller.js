const Lesson = require("../../models/lesson.model")
module.exports.home = async (req,res)=>{
    const listLesson = await Lesson.find({
        deleted:false
    })
    res.render("admin/pages/home",{
       pageTitle:"Lớp học của tôi",
       listLesson:listLesson
    })
}