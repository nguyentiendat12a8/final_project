const express = require('express');
const { store } = require('../controllers/tour.controller');
const { verifyToken, isModerator } = require('../middlewares/jwt.middleware');
const router = express.Router();
const upload = require('../middlewares/uploadFile.middleware')

router.post('/add', [upload.array('picture')], store)

module.exports = router