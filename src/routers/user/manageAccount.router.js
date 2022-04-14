const express = require('express')
const { checkDuplicateUser } = require('../../middlewares/verifySignUp.middleware')
const {signup, signin, updatePassword, editAccount, updateAccount, sendEmailResetPass, confirmLink,
    } = require('../../controllers/user/account.controller')
const { verifyToken } = require('../../middlewares/jwt.middleware')
const {uploadAvatar} = require('../../util/uploadFile.middleware')
const router = express.Router()

router.post('/signup', [checkDuplicateUser, uploadAvatar.single('avatar')], signup)
router.post('/signin', signin)
router.patch('/update-password',[verifyToken], updatePassword)
router.get('/edit-account',[verifyToken], editAccount)
router.patch('/update-account',[verifyToken, uploadAvatar.single('avatar')], updateAccount)
router.post('/forgot-password', sendEmailResetPass)
router.patch('/update-forgotten-password/:accountID/:token', confirmLink)

module.exports = router