const express = require('express')
const { checkDuplicateAdmin } = require('../../middlewares/verifySignUp.middleware')
const {signup, signin, listAdminAccount, detailAdminAccount} = require('../../controllers/admin/account.controller')
const { verifyToken, isAdmin } = require('../../middlewares/jwt.middleware')
const router = express.Router()

router.post('/signup', [checkDuplicateAdmin], signup)
router.post('/signin', signin)

router.get('/listAdminAccount',[verifyToken, isAdmin],listAdminAccount)
router.get('/detailAdminAccount/:adminID',[verifyToken, isAdmin], detailAdminAccount)


module.exports = router