const express = require('express')
const { addExperiencePost, editExperiencePost, updateExperiencePost, deleteExperiencePost, listExperiencePost, likeExperiencePost, myPost, commentExperiencePost, listCommentExperiencePost } = require('../../controllers/user/experiencePost.controller')
const { checkLike } = require('../../middlewares/checkLike.middleware')
const { verifyToken } = require('../../middlewares/jwt.middleware')
const { upload } = require('../../util/uploadFile.middleware')
const router = express.Router()

router.post('/add-post-experience', [verifyToken, upload.array('photo')], addExperiencePost)
router.get('/edit-post-experience/:postExperienceID', [verifyToken], editExperiencePost)
router.patch('/update-post-experience/:postExperienceID', [verifyToken,upload.array('photo')], updateExperiencePost)
router.delete('/delete-post-experience/:postExperienceID', [verifyToken], deleteExperiencePost)
router.get('/view-list-post-experience', [verifyToken], listExperiencePost)
router.get('/my-post', [verifyToken], myPost)

router.post('/like-post-experience/:postExperienceID', [verifyToken, checkLike], likeExperiencePost)
router.post('/comment-post-experience/:postExperienceID', [verifyToken], commentExperiencePost)
router.get('/list-comment-post-experience/:postExperienceID', [verifyToken], listCommentExperiencePost)



module.exports = router