const express = require('express');
const { store, show } = require('../controllers/tour.controller');
const { verifyToken, isModerator } = require('../middlewares/jwt.middleware');
const router = express.Router();
const upload = require('../middlewares/uploadFile.middleware')

router.post('/add', [verifyToken, upload.array('picture')], store)
router.get('/show', show)

module.exports = router