const express = require('express')
const { addExperiencePost, editExperiencePost, updateExperiencePost, deleteExperiencePost, listExperiencePost, likeExperiencePost, myPost } = require('../../controllers/user/experiencePost.controller')
const { checkLike } = require('../../middlewares/checkLike.middleware')
const { verifyToken } = require('../../middlewares/jwt.middleware')
const { upload } = require('../../middlewares/uploadFile.middleware')
const router = express.Router()

router.post('/add-post-experience', [verifyToken, upload.array('photo')], addExperiencePost)
router.get('/edit-post-experience/:postExperienceID', [verifyToken], editExperiencePost)
router.patch('/update-post-experience/:postExperienceID', [verifyToken,upload.array('photo')], updateExperiencePost)
router.delete('/delete-post-experience/:postExperienceID', [verifyToken], deleteExperiencePost)
router.get('/view-list-post-experience', [verifyToken], listExperiencePost)
router.get('/my-post', [verifyToken], myPost)

router.post('/like-post-experience/:postExperienceID', [verifyToken, checkLike], likeExperiencePost)



module.exports = router