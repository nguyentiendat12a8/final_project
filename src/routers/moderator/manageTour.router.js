const express = require('express')
const {signup, signin, updatePassword, editAccount, updateAccount, sendEmailResetPass, confirmLink,
    } = require('../../controllers/moderator/account.controller')
const { addTour } = require('../../controllers/moderator/tour.controller')
const { verifyToken, isModerator } = require('../../middlewares/jwt.middleware')
const { upload } = require('../../middlewares/uploadFile.middleware')
const router = express.Router()

router.post('/add-tour', [verifyToken, isModerator, upload.array('picture')], addTour)

module.exports = router