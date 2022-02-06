const express = require('express');
const { register, signin, updatePassword } = require('../controllers/user.controller');
const router = express.Router();

router.post('/register', register)
router.post('/signin', signin)
router.post('/:id/updatePassword', updatePassword)

module.exports = router;