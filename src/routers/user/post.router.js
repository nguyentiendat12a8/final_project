const express = require('express')
const { listPost, detailPost, searchPost } = require('../../controllers/user/post.controller')
const router = express.Router()

router.get('/list-post', listPost)
router.get('/detail-post/:slug', detailPost)
router.get('/search', searchPost)

module.exports = router