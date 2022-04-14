const express = require('express')
const { checkDuplicateMod } = require('../../middlewares/verifySignUp.middleware')
const {signup, signin, updatePassword, editAccount, updateAccount, sendEmailResetPass, confirmLink, configPaypal, viewPaypal, editPaypal, updatePaypal,
    } = require('../../controllers/moderator/account.controller')
const { verifyToken } = require('../../middlewares/jwt.middleware')
const {uploadAvatar} = require('../../util/uploadFile.middleware')
const { isModerator }= require('../../middlewares/jwt.middleware')
const router = express.Router()

router.post('/signup', [checkDuplicateMod, uploadAvatar.single('avatar')], signup)
router.post('/signin', signin)
router.patch('/update-password',[verifyToken, isModerator], updatePassword)
router.get('/edit-account',[verifyToken, isModerator], editAccount)
router.patch('/update-account',[verifyToken, isModerator, uploadAvatar.single('avatar')], updateAccount)
router.post('/forgot-password', sendEmailResetPass)
router.patch('/update-forgotten-password/:accountID/:token', confirmLink)

//add payment method
router.post('/config-paypal', [verifyToken, isModerator], configPaypal)
router.get('/view-paypal', [verifyToken, isModerator], viewPaypal)
router.get('/edit-paypal',  [verifyToken, isModerator], editPaypal)
router.put('/update-paypal',  [verifyToken, isModerator], updatePaypal)

module.exports = router