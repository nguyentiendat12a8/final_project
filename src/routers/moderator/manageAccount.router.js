const express = require('express')
const { checkDuplicateMod } = require('../../middlewares/verifySignUp.middleware')
const {signup, signin, updatePassword, editAccount, updateAccount, sendEmailResetPass, confirmLink,
    } = require('../../controllers/moderator/account.controller')
const { verifyToken } = require('../../middlewares/jwt.middleware')
const {uploadAvatar} = require('../../middlewares/uploadFile.middleware')
const { isModerator }= require('../../middlewares/jwt.middleware')
const router = express.Router()

router.post('/signup', [checkDuplicateMod], signup)
router.post('/signin', signin)
router.patch('/update-password',[verifyToken, isModerator], updatePassword)
router.get('/edit-account',[verifyToken, isModerator], editAccount)
router.patch('/update-account',[verifyToken, isModerator, uploadAvatar.single('avatar')], updateAccount)
router.post('/forgot-password', sendEmailResetPass)
router.patch('/update-forgotten-password/:accountID/:token', confirmLink)

module.exports = router