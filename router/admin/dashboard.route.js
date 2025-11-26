const router = require("express").Router()
const dashboardController = require("../../controllers/admin/dashboard.controller")
router.get("/",dashboardController.page)
module.exports = router