const express = require('express');
const { store } = require('../controllers/tour.controller');
const router = express.Router();
const upload = require('../middlewares/uploadFile.middleware')

router.post('/add', upload.single('picture'), store)

module.exports = router