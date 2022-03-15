const db = require('../../models/index')
const Post = db.post

exports.createPost = async (req, res) =>{
    if (req.files) {
        let path = ''
        req.files.forEach((files, index, arr) => {
            path = path + files.path + ','
        });
        path = path.substring(0, path.lastIndexOf(','))
        req.body.photo = path
    } else {
        req.body.photo = 'No photo'
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
        req.body.photo = path
    } else {
        req.body.photo = 'No photo'
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

exports.listPost = async (req, res) =>{
    let perPage = 10
    let page = req.params.page || 1
    Post.find({moderatorID: req.accountID})
    .skip((perPage*page) - perPage)
    .limit(perPage)
    .exec( async (err, list) =>{
        if(err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        await Post.countDocuments({moderatorID: req.accountID}, (err, count)=>{
            if(err) return res.status(500).send({
                errorCode: 500,
                message: err
            })
            return res.status(200).send({
                errorCode: 0,
                data: list,
                current: page,
                pages: Math.ceil(count/perPage)
            })
        })
    })
}

exports.detailPost = (req, res) =>{
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

//search
