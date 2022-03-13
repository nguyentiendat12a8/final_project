const express = require('express')
const { checkDuplicateAdmin } = require('../../middlewares/verifySignUp.middleware')
const {signup, signin, updatePassword, editAccount, updateAccount, sendEmailResetPass, confirmLink,
     listUserAccount, detailUserAccount, deleteUserAccount, trashUserAccount, forceDeleteUserAccount, restoreUserAccount,
     listModAccount, detailModAccount, deleteModAccount, trashModAccount, forceDeleteModAccount, restoreModAccount,
     listAdminAccount, detailAdminAccount, deleteAdminAccount, trashAdminAccount, forceDeleteAdminAccount, restoreAdminAccount
    } = require('../../controllers/admin/account.controller')
const { verifyToken, isAdmin } = require('../../middlewares/jwt.middleware')
const { uploadAvatar } = require('../../middlewares/uploadFile.middleware')
const router = express.Router()

router.post('/signup', [checkDuplicateAdmin, uploadAvatar.single('avatar')], signup)
router.post('/signin', signin)
router.patch('/update-password',[verifyToken, isAdmin], updatePassword)
router.get('/edit-account',[verifyToken, isAdmin], editAccount)
router.patch('/update-account',[verifyToken, uploadAvatar.single('avatar') ,isAdmin], updateAccount)
router.post('/forgot-password', sendEmailResetPass)
router.patch('/update-forgotten-password/:accountID/:token', confirmLink)

//route manage user account
router.get('/list-user-account/:page', [verifyToken, isAdmin], listUserAccount)
router.get('/detail-user-account/:userID',[verifyToken, isAdmin], detailUserAccount) //view detail o ca deteled true va false
router.patch('/delete-user-account/:userID',[verifyToken, isAdmin], deleteUserAccount)
router.get('/trash-user-account/:page',[verifyToken, isAdmin], trashUserAccount)
router.patch('/restore-user-account/:userID',[verifyToken, isAdmin], restoreUserAccount)
router.delete('/force-delete-user-account/:userID', [verifyToken, isAdmin], forceDeleteUserAccount)

//route manage moderator account
router.get('/list-moderator-account/:page', [verifyToken, isAdmin], listModAccount)
router.get('/detail-moderator-account/:moderatorID',[verifyToken, isAdmin], detailModAccount) //view detail o ca deteled true va false
router.patch('/delete-moderator-account/:moderatorID',[verifyToken, isAdmin], deleteModAccount)
router.get('/trash-moderator-account/:page',[verifyToken, isAdmin], trashModAccount)
router.patch('/restore-moderator-account/:moderatorID',[verifyToken, isAdmin], restoreModAccount )
router.delete('/force-delete-moderator-account/:moderatorID', [verifyToken, isAdmin], forceDeleteModAccount)

//route manage admin account
router.get('/list-admin-account/:page', [verifyToken, isAdmin], listAdminAccount)
router.get('/detail-admin-account/:adminID',[verifyToken, isAdmin], detailAdminAccount) //view detail o ca deteled true va false
router.patch('/delete-admin-account/:adminID',[verifyToken, isAdmin], deleteAdminAccount)
router.get('/trash-admin-account/:page',[verifyToken, isAdmin], trashAdminAccount)
router.patch('/restore-admin-account/:adminID',[verifyToken, isAdmin], restoreAdminAccount )
router.delete('/force-delete-admin-account/:adminID', [verifyToken, isAdmin], forceDeleteAdminAccount)

module.exports = router