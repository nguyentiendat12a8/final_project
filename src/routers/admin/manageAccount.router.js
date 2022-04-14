const express = require('express')
const { checkDuplicateAdmin } = require('../../middlewares/verifySignUp.middleware')
const {signup, signin, updatePassword, editAccount, updateAccount, sendEmailResetPass, confirmLink,
     listUserAccount, detailUserAccount, deleteUserAccount, trashUserAccount, restoreUserAccount,
     listModAccount, detailModAccount, deleteModAccount, trashModAccount,  restoreModAccount,
     
     configPaypal, viewPaypal, editPaypal, updatePaypal
    } = require('../../controllers/admin/account.controller')
const { verifyToken, isAdmin, verifyRefreshToken } = require('../../middlewares/jwt.middleware')
const { uploadAvatar } = require('../../util/uploadFile.middleware')
const router = express.Router()

router.post('/signup', [checkDuplicateAdmin, uploadAvatar.single('avatar')], signup)
router.post('/signin', signin)
router.patch('/update-password',[verifyToken, isAdmin], updatePassword)
router.get('/edit-account',[verifyToken, isAdmin], editAccount)
router.patch('/update-account',[verifyToken, uploadAvatar.single('avatar') ,isAdmin], updateAccount)
router.post('/forgot-password', sendEmailResetPass)
router.patch('/update-forgotten-password/:accountID/:token', confirmLink)

//route manage user account
router.get('/list-user-account', [verifyToken, isAdmin], listUserAccount)
//router.get('/detail-user-account/:userID',[verifyToken, isAdmin], detailUserAccount) 
router.patch('/delete-user-account/:userID',[verifyToken, isAdmin], deleteUserAccount)
router.get('/trash-user-account',[verifyToken, isAdmin], trashUserAccount)
router.patch('/restore-user-account/:userID',[verifyToken, isAdmin], restoreUserAccount)

//route manage moderator account
router.get('/list-moderator-account', [verifyToken, isAdmin], listModAccount)
//router.get('/detail-moderator-account/:moderatorID',[verifyToken, isAdmin], detailModAccount) 
router.patch('/delete-moderator-account/:moderatorID',[verifyToken, isAdmin], deleteModAccount)
router.get('/trash-moderator-account',[verifyToken, isAdmin], trashModAccount)
router.patch('/restore-moderator-account/:moderatorID',[verifyToken, isAdmin], restoreModAccount )

//route paypal info
router.post('/config-paypal', [verifyToken, isAdmin], configPaypal)
router.get('/view-paypal', [verifyToken, isAdmin], viewPaypal)
router.get('/edit-paypal',  [verifyToken, isAdmin], editPaypal)
router.put('/update-paypal',  [verifyToken, isAdmin], updatePaypal)

router.get('/verifyRefreshToken', verifyRefreshToken)

module.exports = router