const express = require('express')
const { dashboard } = require('../../controllers/moderator/dashboard.controller')
const { verifyToken, isModerator } = require('../../middlewares/jwt.middleware')
const router = express.Router()

router.get('/view-dashboard', [verifyToken, isModerator], dashboard)

module.exports = router