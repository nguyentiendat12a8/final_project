const db = require('../../models/index')
const PostExperience = db.postExperience
const User = db.user
const Like = db.like
const Comment = db.comment

exports.addExperiencePost = (req, res) => {
    var post
    if (req.files) {
        let path = ''
        req.files.forEach(files => {
            path = path + files.path + ','
        });
        path = path.substring(0, path.lastIndexOf(','))
        req.body.photo = path
        post = new PostExperience({
            postText: req.body.postText,
            photo: req.body.photo,
            address: req.body.address,
            userID: req.accountID
        })
    } else {
        post = new PostExperience({
            postText: req.body.postText,
            photo: req.body.photo,
            address: req.body.address,
            userID: req.accountID
        })
    }
    post.save(err => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: 'Add post function is error!'
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'Add experience post successfully!'
        })
    })
}

exports.editExperiencePost = (req, res) => {
    PostExperience.findOne({ _id: req.params.postExperienceID, userID: req.accountID }, (err, post) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: 'Edit post experience function is error!'
        })
        var show = {
            postText: post.postText,
            photo: post.photo,
            address: post.address
        }
        return res.status(200).send({
            errorCode: 500,
            data: show
        })
    })
}

exports.updateExperiencePost = async (req, res) => {
    if (req.files) {
        let path = ''
        req.files.forEach(files => {
            path = path + files.path + ','
        });
        path = path.substring(0, path.lastIndexOf(','))
        req.body.photo = path
    }
    await PostExperience.findOneAndUpdate({ _id: req.params.postExperienceID, userID: req.accountID }, {
        postText: req.body.postText,
        photo: req.body.photo,
        address: req.body.address
    }, { new: true }, (err) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err.message
        })
        return res.status(200).send({
            errorCode: 500,
            message: 'Update experience post successfully!'
        })
    })
}

exports.deleteExperiencePost = (req, res) => {
    PostExperience.findOneAndDelete({ _id: req.params.postExperienceID, userID: req.accountID }, err => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: 'Delete post experience function is error!'
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'Delete experience post successfully!'
        })
    })
}

exports.listExperiencePost = (req, res) => {
    PostExperience.find({}, async (err, list) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err.message
        })
        var show = []
        for (i = 0; i < list.length; i++) {
            var user = await User.findById(list[i].userID)
            var post = {
                postText: list[i].postText,
                photo: list[i].photo,
                address: list[i].address,
                numberOfLike: list[i].numberOfLike,
                numberOfComment: list[i].numberOfComment,
                name: user.userName,
                avatar: user.avatar,
                createdAt: list[i].createdAt
            }
            show.push(post)
        }
        return res.status(200).send({
            errorCode: 0,
            data: show
        })
    })
}

exports.myPost = (req, res) => {
    PostExperience.find({ userID: req.accountID }, async (err, list) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err.message
        })
        var show = []
        for (i = 0; i < list.length; i++) {
            var post = {
                postText: list[i].postText,
                photo: list[i].photo,
                address: list[i].address,
                numberOfLike: list[i].numberOfLike,
                numberOfComment: list[i].numberOfComment,
                createdAt: list[i].createdAt
            }
            show.push(post)
        }
        return res.status(500).send({
            errorCode: 500,
            data: show
        })
    })
}

exports.likeExperiencePost = async (req, res) => {
    try {
        const like = new Like({
            like: true,
            postExperienceID: req.params.postExperienceID,
            userID: req.accountID
        })
        await Promise.all([like.save(), Like.find({ postExperienceID: req.params.postExperienceID, like: true })])
            .then(async ([like, number]) => {
                await PostExperience.findOneAndUpdate({ _id: req.params.postExperienceID }, { numberOfLike: number.length }, { new: true })
                return res.status(200).send({
                    errorCode: 0,
                    message: 'number of like update successfully'
                })
            })
            .catch(error => {
                return res.status(500).send({
                    errorCode: 500,
                    message: 'Like server is error'
                })
            })
    }
    catch (err) {
        return res.status(500).send({
            errorCode: 500,
            message: 'Like function is error!'
        })
    }
}

exports.commentExperiencePost = async (req, res) => {
    try {
        const comment = new Comment({
            commentText: req.body.commentText,
            postExperienceID: req.params.postExperienceID,
            userID: req.accountID
        })
        await Promise.all([comment.save(), Comment.find({ postExperienceID: req.params.postExperienceID })])
            .then(async ([comment, number]) => {
                await PostExperience.findOneAndUpdate({ _id: req.params.postExperienceID }, { numberOfComment: number.length }, { new: true })
                return res.status(200).send({
                    errorCode: 0,
                    message: 'number of Comment upload successfully'
                })
            })
            .catch(error => {
                return res.status(500).send({
                    errorCode: 500,
                    message: 'Comment server is error'
                })
            })
    }
    catch (err) {
        return res.status(500).send({
            errorCode: 500,
            message: 'Comment function is error!'
        })
    }
}

exports.listCommentExperiencePost = (req, res) => {
    Comment.find({ postExperienceID: req.params.postExperienceID }, async (err, list) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err.message
        })
        var show = []
        for (i = 0; i < list.length; i++) {
            var user = await User.findById(list[i].userID)
            var comment = {
                commentText: list[i].commentText,
                createdAt: list[i].createdAt,
                userName: user.userName,
                avatar: user.avatar
            }
            show.push(comment)
        }
        return res.status(200).send({
            errorCode: 0,
            data: show
        })
    })
}
