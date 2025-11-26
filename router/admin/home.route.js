const router = require("express").Router()
const homeController = require("../../controllers/admin/home.controller")
router.get("/",homeController.home)
module.exports = router;