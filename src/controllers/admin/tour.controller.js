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



//control tour with admin role
exports.listTour = (req, res, next) => {

}

exports.detailTour = (req, res, next) => {

}

exports.deleteTour = (req, res, next) => {

}

exports.restoreTour = (req, res, next) => {

}

exports.forceDeleteTour = (req, res, next) => {

}

//bộ lọc
exports.filterMostTour = (req, res, next) => {

}

exports.filterLeastTour = (req, res, next) => {

}

//xem danh sách tour của mod từ danh sách account
exports.listModTour = (req, res, next) => {
    //lọc theo id của từng mod
}

exports.detailModTour = (req, res, next) => {

}

exports.deleteModTour = (req, res, next) => {

}

exports.restoreModTour = (req, res, next) => {

}

exports.forceDeleteModTour = (req, res, next) => {

}

//xem danh sach hoa don tu danh sach mod account 
exports.listBillModTour = (req, res, next) => {
    //lọc theo id của từng mod
}

exports.detailBillModTour = (req, res, next) => {

}

exports.deleteBillModTour = (req, res, next) => {

}

exports.restoreBillModTour = (req, res, next) => {

}

exports.forceDeleteBillModTour = (req, res, next) => {

}

//xem danh sach hoa don tu danh sach user account 
exports.listBillUserTour = (req, res, next) => {
    //lọc theo id của từng mod
}

exports.detailBillUserTour = (req, res, next) => {

}

exports.deleteBillUserTour = (req, res, next) => {

}

exports.restoreBillUserTour = (req, res, next) => {

}

exports.forceDeleteBillUserTour = (req, res, next) => {

}
