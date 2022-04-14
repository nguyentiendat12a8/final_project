const db = require('../../models/index')
const Post = db.post
const Moderator = db.moderator

exports.listPost = (req, res) => {
    Post.find({}, (err, list) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err.message
        })
        var show = []
        list.forEach(e => {
            var post = {
                postTitle: e.postTitle,
                postText: e.postText,
                photo: e.photo,
                address: e.address,
                slug: e.slug
            }
            show.push(post)
        })
        return res.status(200).send({
            errorCode: 0,
            data: show
        })
    })
}

exports.detailPost = async (req, res) => {
    Post.findOne({ slug: req.params.slug }, async (err, post) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: 'Detail post function is error!'
        })
        const mod = await Moderator.findById(post.moderatorID)
        if (!mod) return res.status(400).send({
            errorCode: 400,
            message: 'Invalid link'
        })
        var show = {
            postTitle: post.postTitle,
            postText: post.postText,
            photo: post.photo,
            address: post.address,
            createdAt: post.createdAt,
            modName: mod.modName,
            avatar: mod.avatar,
            email: mod.email
        }
        return res.status(200).send({
            errorCode: 0,
            data: show
        })
    })
}

exports.searchPost = async (req, res) => {
    Post.find({}, (err, list) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err.message
        })
        var search = req.query.address
        var dataSearch = list.filter(r => r.address.toLowerCase().includes(search.toLowerCase()))
        var listShow = []
        dataSearch.forEach(e => {
            var show = {
                postTitle: e.postTitle,
                postText: e.postText,
                photo: e.photo,
                address: e.address,
                slug: e.slug
            }
            listShow.push(show)
        })
        return res.status(200).send({
            errorCode: 0,
            data: listShow,
        })
    })
}

