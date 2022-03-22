const express = require('express')
const { listTour, detailTour } = require('../../controllers/user/tour.controller')
const router = express.Router()

router.get('/list-tour', listTour)
router.get('/detail-tour', detailTour)

module.exports = router