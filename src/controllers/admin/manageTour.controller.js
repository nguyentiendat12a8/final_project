const db = require('../../models/index')
const CategoryTour = db.categoryTour
const Tour = db.tour


//control category tour
exports.addCategory = (req, res) => {
    const category = new CategoryTour({
        categoryName: req.body.categoryName
    })
    category.save(err => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: 'Save category function is error!'
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'add category successfully'
        })
    })
}

exports.listCategory = (req, res) => {
    CategoryTour.find({}, (err, list) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err.message
        })
        return res.status(200).send({
            errorCode: 0,
            data: list
        })
    })
}

exports.editCategory = (req, res) => {
    const categoryID = req.params.categoryID
    CategoryTour.find({ _id: categoryID }, (err, category) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err.message
        })
        return res.status(200).send({
            errorCode: 0,
            data: category
        })
    })
}

exports.updateCategory = (req, res) => {
    const categoryID = req.params.categoryID
    if (!categoryID) return res.status(400).send({
        errorCode: 400,
        message: 'invalid request'
    })
    CategoryTour.findByIdAndUpdate({ _id: categoryID }, { categoryName: req.body.categoryName }, { new: true }, err => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err.message
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'Update category successfully!'
        })
    })
}

exports.deleteCategory = async (req, res) => {
    var check = await Tour.findOne({ categoryTourID: req.params.categoryID })
    if (check) return res.status(400).send({
        errorCode: 400,
        message: 'This category is used!'
    })
    CategoryTour.findByIdAndDelete({ _id: req.params.categoryID }, err => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: 'Delete category function is error!'
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'Delete category successfully!'
        })
    })
}
