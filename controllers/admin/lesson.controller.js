const Lesson = require("../../models/lesson.model")
const Vocab = require("../../models/vocab.model")
module.exports.list = async (req,res)=>{
    const listLesson = await Lesson.find({
        deleted:false
    })
    res.render("admin/pages/lesson-list",{
       pageTitle:"Quản lý bài học",
       listLesson:listLesson
    })
}
module.exports.create = (req,res)=>{
    res.render("admin/pages/lesson-create",{
       pageTitle:"Thêm buổi học"
    })
}
module.exports.createPost = async (req,res)=>{
    const title = req.body.title
    const existLesson = await Lesson.findOne({
        title:title
    })
    if(existLesson){
        res.json({
            code:"error",
            message:"Buổi học này đã tồn tại!"
        })
        return;
    }

    if(req.files&&req.files.avatar){
        req.body.image =  req.files.avatar[0].path
    }
    const data = new Lesson(req.body)
    await data.save()

    res.json({
        code:"success",
        message:"Tạo buổi học thành công!"
    })
}
module.exports.edit = async (req,res)=>{
    const id = req.params.id;
    const existWord = await Vocab.find({
        lessonId:id,
        deleted:false,
    })
    const existWordEdit = existWord.map((e, idx) => {
        return {
            index: idx + 1,
            id: e._id,
            word: e.word,
            avatar: e.image || '',
        };
    });

    const lessonCurrent = await Lesson.findOne({
        _id:id,
        deleted:false
    })
    console.log(existWordEdit)
    res.render("admin/pages/lesson-edit",{
       pageTitle:"Cập nhật bài học",
       lessonCurrent:lessonCurrent,
       existWord:existWordEdit?existWordEdit:''
    })
}

module.exports.editPost = async (req, res) => {
    try {
        const id_less = req.params.id;
        const files = req.files; 
        const words = JSON.parse(req.body.words);

        const list = words.map(word => {

            const file = files.find(f => f.fieldname === word.avatar);
            return {
                lessonId: id_less,
                word: word.name,
                image: file ? file.path : ""
            };
        });
        await Vocab.deleteMany({
            lessonId:id_less,
            deleted:false
        })
        for (const item of list) {
            const data = new Vocab(item);
            await data.save();
        }
      
        res.json({
            code: "success",
            message: "Cập nhật thành công!"
        });
    } catch (error) {
        res.json({
            code: "error",
            message: "Lỗi hệ thống!"
        });
    }
};

module.exports.deletePatch = async (req, res) => {
    try {
        const id_less = req.params.id;
        console.log(id_less)
        await Vocab.deleteOne({
            _id:id_less,
            deleted:false
        })
        res.json({
            code: "success",
            message: "Xóa từ thành công!"
        });
    } catch (error) {
        res.json({
            code: "error",
            message: "Lỗi hệ thống!"
        });
    }
};

module.exports.deleteLessonPatch = async (req, res) => {
    try {
        const id_less = req.params.id;
        console.log(id_less)
        await Lesson.deleteOne({
            _id:id_less,
            deleted:false
        })
        await Vocab.deleteMany({
            lessonId:id_less,
            deleted:false
        })
        res.json({
            code: "success",
            message: "Xóa bài thành công!"
        });
    } catch (error) {
        res.json({
            code: "error",
            message: "Lỗi hệ thống!"
        });
    }
};
