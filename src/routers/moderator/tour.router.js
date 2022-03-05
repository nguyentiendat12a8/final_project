const express = require('express');
const { show, storeTour  } = require('../controllers/tour.controller');
const { verifyToken, isModerator } = require('../middlewares/jwt.middleware');
const router = express.Router();
const upload = require('../middlewares/uploadFile.middleware');

const { payment, cancel, success } = require('../controllers/tour.controller')


router.post('/add', [ upload.array('picture')], storeTour)
router.get('/show', show)
//router.post('/bookTour', storeBookedTour)
router.post('/payment',payment )
router.get('/success', success)
router.get('/cancel', cancel)

module.exports = router