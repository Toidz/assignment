const router = require("express").Router()
const studyController = require("../../controllers/admin/study.controller")
router.get("/",studyController.study)
module.exports = router;