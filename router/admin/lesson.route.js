const router = require("express").Router()
const multer = require("multer");
const cloudinaryHelper = require("../../helper/cloudinary.helper")
const upload = multer({ storage: cloudinaryHelper.storage })
const lessonController = require("../../controllers/admin/lesson.controller")
router.get("/",lessonController.list)
router.get("/create",lessonController.create)

router.post("/create",
    upload.fields([
        { name: 'avatar', maxCount: 1 },
    ])
    ,lessonController.createPost
)

router.get("/edit/:id",lessonController.edit)

router.post("/edit/:id",
    upload.any(),      
    lessonController.editPost
);

router.patch("/delete/:id",lessonController.deletePatch);
router.patch("/delete-lesson/:id",lessonController.deleteLessonPatch);
module.exports = router