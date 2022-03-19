const db = require('../../models/index')
const Post = db.post

exports.addPost = async (req, res) => {
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
    var post = new Post(req.body)
    post.moderatorID = req.accountID
    await post.save(err => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'Add Post successfully!'
        })
    })
}

exports.editPost = (req, res) => {
    Post.findOne({ slug: req.params.slug, moderatorID: req.accountID }, (err, post) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        if(post == null){
            return res.status(400).send({
                errorCode: 400,
                message: 'Invalid link'
            })
        }
        const postEdit = {
            postText: post.postText,
            photo: post.photo,
            slug: post.slug
        }
        return res.status(200).send({
            errorCode: 0,
            data: postEdit
        })
    })
}

exports.updatePost = (req, res) => {
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
    Post.findOneAndUpdate({ slug: req.params.slug, moderatorID: req.accountID }, {
        postText: req.body.postText,
        photo: req.body.photo,
    }, { new: true }, err => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'Update post successfully!'
        })
    })
}

exports.deletePost = (req, res) => {
    Post.findOneAndDelete({ slug: req.params.slug, moderatorID: req.accountID }, err => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'Delete post successfully!'
        })
    })
}

exports.listPost = async (req, res) => {
    let perPage = 10
    let page = req.query.page || 1
    Post.find({ moderatorID: req.accountID })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(async (err, list) => {
            if (err) return res.status(500).send({
                errorCode: 500,
                message: err
            })
            Post.countDocuments({ moderatorID: req.accountID })
                .then(count => {
                    var listShow = []
                    list.forEach(e => {
                        var show = {
                            address: e.address,
                            postTitle: e.postTitle,
                            photo: e.photo,
                            createdAt: e.createdAt,
                            slug: e.slug
                        }
                        listShow.push(show)
                    })
                    return res.status(200).send({
                        errorCode: 0,
                        data: listShow,
                        current: page,
                        pages: Math.ceil(count / perPage)
                    })
                })
                .catch(err => {
                    if (err) return res.status(500).send({
                        errorCode: 500,
                        message: err
                    })
                })
        })
}

exports.detailPost = (req, res) => {
    Post.findOne({ slug: req.params.slug, moderatorID: req.accountID }, (err, post) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        if(post == null){
            return res.status(400).send({
                errorCode: 400,
                message: 'Invalid link'
            })
        }
        return res.status(200).send({
            errorCode: 0,
            data: post
        })
    })
}

//search wwith address
exports.searchPost = async (req, res) => {
    try {
        let perPage = 10
        let page = req.query.page || 1
        const listPost = await Post.find({ moderatorID: req.accountID })
        //search data
        var search = req.query.search
        var dataSearch = listPost.filter(r => r.postTitle.toLowerCase().includes(search.toLowerCase()))
        var count = 0
        dataSearch.forEach(()=>count++)
        //slice page
        const data = dataSearch.slice(((perPage * page) - perPage), (perPage * page))
        var listShow = []
        data.forEach(e => {
            var show = {
                address: e.address,
                postTitle: e.postTitle,
                photo: e.photo,
                createdAt: e.createdAt,
                slug: e.slug
            }
            listShow.push(show)
        })
        return res.status(200).send({
            errorCode: 0,
            data: listShow,
            current: page,
            pages: Math.ceil(count / perPage)
        })
    } catch (error) {
        return res.status(500).send({
            errorCode: 500,
            message: error
        })
    }

}
