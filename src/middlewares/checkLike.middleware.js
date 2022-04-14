const db = require('../models/index')
const Like = db.like
const PostExperience = db.postExperience

exports.checkLike = async (req, res, next) => {
try {
    const check = await Like.findOne({
        userID: req.accountID,
        postExperienceID: req.params.postExperienceID
    })
    if (check) {
        if (check.like === true) {
            await check.delete()
            const number = await Like.find({ postExperienceID: req.params.postExperienceID, like: true })
            await PostExperience.findByIdAndUpdate({ _id: req.params.postExperienceID }, { numberOfLike: number.length }, { new: true })
            return res.status(200).send({
                errorCode: 0,
                message: 'unlike successfully'
            })
        }
    } 
    next() 
} catch (error) {
    return res.status(500).send({
        errorCode: 500,
        message: 'Check like is error!'
    })
}
}