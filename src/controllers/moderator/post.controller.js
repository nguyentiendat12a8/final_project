const db = require('../../models/index')
const Post = db.post

exports.createPost = async (req, res) =>{
    if (req.files) {
        let path = ''
        req.files.forEach((files, index, arr) => {
            path = path + files.path + ','
        });
        path = path.substring(0, path.lastIndexOf(','))
        req.body.picture = path
    } else {
        req.body.picture = 'No photo'
    }
    var post = new Post (req.body)
    post.moderatorID = req.accountID
    await post.save(err =>{
        if(err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'Add Post successfully!'
        })
    })
}

exports.editPost = (req, res) =>{
    Post.findOne({_id: req.params.postID, moderatorID: req.accountID}, (err, post) =>{
        if(err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        return res.status(200).send({
            errorCode: 0,
            data: post
        })
    })
}

exports.updatePost = (req, res) =>{
    if (req.files) {
        let path = ''
        req.files.forEach((files, index, arr) => {
            path = path + files.path + ','
        });
        path = path.substring(0, path.lastIndexOf(','))
        req.body.picture = path
    } else {
        req.body.picture = 'No photo'
    }
    Post.findOneAndUpdate({_id: req.params.postID, moderatorID: req.accountID}, {
        postTitle: req.body.postTitle,
        postText: req.body.postText,
        photo: req.body.photo,
        address: req.body.address,
    }, {new: true} ,err =>{
        if(err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'Update post successfully!'
        })
    })
}

exports.deletePost = (req, res) =>{
    Post.findOneAndDelete({_id: req.params.postID, moderatorID: req.accountID}, err =>{
        if(err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'Delete post successfully!'
        })
    })
}

exports.listPost = (req, res) =>{
    
}

exports.detailPost = (req, res) =>{
    
}

