const express = require('express');
const { signup, signin, updatePassword, updateAccount, editAccount, deleteAccount } = require('../controllers/account.controller');
const { verifyToken, verifyRefreshToken} = require('../middlewares/jwt.middleware');
const verifySignUp = require('../middlewares/verifySignUp.middleware');
const router = express.Router();
const uploadAvatar = require('../middlewares/uploadFile.middleware')


    router.post('/signup',[verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted], signup)
    router.post('/signin', signin)

    router.get('/editAccount', editAccount)
    router.post("/updateAccount",[uploadAvatar.single('avatar')], updateAccount);
    router.patch('/updatePassword',  updatePassword)

    router.delete('/delete/:id', deleteAccount)

    router.get("/verifyRefreshToken",verifyRefreshToken)
    router.get("/verifyToken",verifyToken)
module.exports = router
