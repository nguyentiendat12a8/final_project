const express = require('express');
const { show, storeTour, bookedTourStore } = require('../controllers/tour.controller');
const { verifyToken, isModerator } = require('../middlewares/jwt.middleware');
const router = express.Router();
const upload = require('../middlewares/uploadFile.middleware');


router.post('/add', [ upload.array('picture')], storeTour)
router.get('/show', show)
router.post('/bookTour', bookedTourStore)

module.exports = router