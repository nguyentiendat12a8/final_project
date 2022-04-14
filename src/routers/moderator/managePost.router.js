const express = require('express')
const { addPost, listPost, detailPost, editPost, updatePost, deletePost, searchPost } = require('../../controllers/moderator/post.controller')
const { verifyToken, isModerator } = require('../../middlewares/jwt.middleware')
const { upload } = require('../../util/uploadFile.middleware')
const router = express.Router()

router.post('/add-post', [verifyToken, isModerator, upload.array('photo')], addPost)
router.get('/list-post', [verifyToken,isModerator], listPost)
router.get('/detail-post/:slug', [verifyToken,isModerator], detailPost)
router.get('/edit-post/:slug', [verifyToken,isModerator], editPost)
router.patch('/update-post/:slug',  [verifyToken,isModerator, upload.array('photo')], updatePost)
router.delete('/delete-post/:slug',  [verifyToken,isModerator], deletePost)

router.get('/search',[verifyToken, isModerator], searchPost)

module.exports = router