const express = require('express');
const { register, signin, updatePassword } = require('../controllers/account.controller');
const { verifyToken, verifyRefreshToken} = require('../middlewares/jwt.middleware');
const verifySignUp = require('../middlewares/verifySignUp.middleware');
const router = express.Router();
    router.post('/signup',[verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted], register)
    router.post('/signin', signin)
    router.post('/:id/updatePassword',  updatePassword)
    router.get("/verifyRefreshToken",verifyRefreshToken);
    router.get("/verifyToken",verifyToken);
module.exports = router
