const db = require('../../models/index')
const CategoryTour = db.categoryTour


//control category tour
exports.addCategory = (req,res) =>{
    const category = new CategoryTour ({
        categoryName: req.body.categoryName
    })
    category.save(err =>{
        if(err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'add category successfully'
        })
    })
}

exports.listCategory = (req,res) => {
    CategoryTour.find({}, (err, list) =>{
        if(err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        return res.status(200).send({
            errorCode: 0,
            data: list
        })
    })
}

exports.editCategory = (req,res) =>{
    const categoryID = req.params.categoryID
    CategoryTour.find({_id: categoryID}, (err, category)=>{
        if(err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        return res.status(200).send({
            errorCode: 0,
            data: category
        })
    })
}

exports.updateCategory = (req,res) =>{
    const categoryID = req.params.categoryID
    if(!categoryID) return res.status(400).send({
        errorCode: 400,
        message: 'invalid request'
    })
    CategoryTour.findByIdAndUpdate({_id: categoryID},{categoryName: req.body.categoryName}, {new: true}, err=>{
        if(err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'Update category successfully!'
        })
    })
}

exports.deleteCategory = (req,res) =>{
    const categoryID = req.params.categoryID
    CategoryTour.findByIdAndDelete({_id: categoryID}, err=>{
        if(err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'Delete category successfully!'
        })
    })
}
