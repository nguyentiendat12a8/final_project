const db = require('../../models/index')
const Tour = db.tour
const CategoryTour = db.categoryTour
const BillTour = db.billTour
const Moderator = db.moderator
const User = db.user
const paypal = require('paypal-rest-sdk')
const { HotelRoom } = require('../../models/hotelRoom.schema')

exports.addTour = async (req, res, next) => {
    try {
        if (req.files) {
            let path = ''
            req.files.forEach(files => {
                path = path + files.path + ','
            });
            path = path.substring(0, path.lastIndexOf(','))
            req.body.picture = path
        } else {
            req.body.picture = 'No photo'
        }
        const category = await CategoryTour.findOne({ categoryName: req.query.categoryName })
        const moderator = await Moderator.findById(req.accountID)
        const tour = new Tour({
            tourName: req.body.tourName,
            startDate: req.body.startDate,
            price: req.body.price,
            picture: req.body.picture,
            address: req.body.address,
            description: {
                vehicle: req.body.vehicle,
                timeDecription: req.body.timeDecription
            },
            moderatorID: moderator._id,
            categoryTourID: category._id,
        })
        tour.save()
            .then(() => {
                res.status(200).send({
                    errorCode: 0,
                    message: 'upload successfully!'
                })
            })
            .catch(error => {
                console.log(error)
                res.status(500).send({ message: error })
            })
    } catch (error) {
        console.log(error)
    }

}

exports.editTour = (req, res, next) => {
    Tour.findOne({ slug: req.params.slug, moderatorID: req.accountID }, async (err, tour) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        const category = await CategoryTour.findById(tour.categoryTourID)
        const tourDetail = {
            tourName: tour.tourName,
            startDate: tour.startDate,
            picture: tour.picture,
            price: tour.price,
            time: tour.time,
            address: tour.address,
            description: {
                vehicle: tour.description,
                timeDecription: tour.timeDecription,
            },
            mode: tour.mode,
            categoryName: category.categoryName,
        }
        return res.status(200).send({
            errorCode: 0,
            data: tourDetail
        })
    })
}

exports.updateTour = async (req, res, next) => {
    const category = CategoryTour.findOne({ categoryName: req.body.categoryName })
    Tour.findOneAndUpdate({ slug: req.params.slug, moderatorID: req.accountID }, {
        startDate: req.body.startDate,
        price: req.body.price,
        picture: req.body.picture,
        address: req.body.address,
        time: req.body.time,
        mode: req.body.mode,
        description: {
            vehicle: req.body.vehicle,
            timeDecription: req.body.timeDecription
        },
        categoryTourID: category._id,
    }, { new: true }, err => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'update tour successfully!'
        })
    })
}

exports.deleteTour = (req, res, next) => {
    Tour.findOneAndUpdate({ slug: req.params.slug, moderatorID: req.accountID }, { deleted: true }, { new: true }, err => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'delete tour successfully!'
        })
    })
}

//list tour according moderator 
exports.listTour = (req, res, next) => {
    let perPage = 10
    let page = req.query.page || 1
    Tour.find({ moderatorID: req.accountID })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(async (err, list) => {
            if (err) return res.status(500).send({
                errorCode: 500,
                message: err
            })
            Tour.countDocuments({ moderatorID: req.accountID }, (err, count) => {
                if (err) return res.status(500).send({
                    errorCode: 500,
                    message: err
                })
                let show = []
                list.forEach(e => {
                    var tour = {
                        tourName: e.tourName,
                        startDate: e.startDate,
                        price: e.price,
                        address: e.address,
                        slug: e.slug
                    }
                    show.push(tour)
                })
                return res.status(200).send({
                    errorCode: 0,
                    data: show,
                    current: page,
                    pages: Math.ceil(count / perPage)
                })
            })
        })
}

exports.detailTour = async (req, res) => {
    Tour.findOne({ slug: req.params.slug, moderatorID: req.accountID }, async (err, tour) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        const category = await CategoryTour.findById(tour.categoryTourID)
        const day = tour.createdAt.getDate()
        const month = tour.createdAt.getMonth()
        const year = tour.createdAt.getYear()
        const tourDetail = {
            tourName: tour.tourName,
            startDate: tour.startDate,
            price: tour.price,
            time: tour.time,
            address: tour.address,
            description: {
                vehicle: tour.description,
                timeDecription: tour.timeDecription,
            },
            mode: tour.mode,
            categoryName: category.categoryName,
            createAt: day + '/' + month + '/' + year
        }
        return res.status(200).send({
            errorCode: 0,
            data: tourDetail
        })
    })
}

//search, filter
exports.searchTour = async (req, res) => {
    const listTour = await Tour.find({ moderatorID: req.accountID })
    var search = req.query.search
    var dataSearch = listTour.filter(r => r.tourName.toLowerCase().includes(search.toLowerCase()))
    var count = 0
    dataSearch.forEach(() => count++)

    let perPage = 10
    let page = req.query.page || 1
    Tour.find({ moderatorID: req.accountID })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(async (err, list) => {
            if (err) return res.status(500).send({
                errorCode: 500,
                message: err
            })
            var search = req.query.search
            var dataSearch = list.filter(r => r.tourName.toLowerCase().includes(search.toLowerCase()))
            var show = []
            dataSearch.forEach(e => {
                var tour = {
                    tourName: e.tourName,
                    startDate: e.startDate,
                    price: e.price,
                    address: e.address,
                    slug: e.slug
                }
                show.push(tour)
            })
            return res.status(200).send({
                errorCode: 0,
                data: show,
                current: page,
                pages: Math.ceil(count / perPage)
            })
        })
}

exports.filterASCTour = async (req, res) => {
    let perPage = 10
    let page = req.query.page || 1
    const listTour = await Tour.find({ moderatorID: req.accountID })
    var dataSort = listTour.sort((a, b) => a.price - b.price)
    const data = dataSort.slice(((perPage * page) - perPage), (perPage * page))

    Tour.countDocuments({ moderatorID: req.accountID }, (err, count) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        var show = []
        data.forEach(e => {
            var tour = {
                tourName: e.tourName,
                startDate: e.startDate,
                price: e.price,
                address: e.address,
                slug: e.slug
            }
            show.push(tour)
        })
        return res.status(200).send({
            errorCode: 0,
            data: show,
            current: page,
            pages: Math.ceil(count / perPage)
        })
    })
}

exports.filterDESTour = async (req, res) => {
    let perPage = 10
    let page = req.query.page || 1
    const listTour = await Tour.find({ moderatorID: req.accountID })
    var dataSort = listTour.sort((a, b) => b.price - a.price)
    const data = dataSort.slice(((perPage * page) - perPage), (perPage * page))

    Tour.countDocuments({ moderatorID: req.accountID }, (err, count) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        var show = []
        data.forEach(e => {
            var tour = {
                tourName: e.tourName,
                startDate: e.startDate,
                price: e.price,
                address: e.address,
                slug: e.slug
            }
            show.push(tour)
        })
        return res.status(200).send({
            errorCode: 0,
            data: show,
            current: page,
            pages: Math.ceil(count / perPage)
        })
    })
}

//booked tour


exports.listBillTour = async (req, res, next) => {
    try {
        Tour.find({ moderatorID: req.accountID }, (err, listTour) => {
            if (err) return res.status(500).send({
                errorCode: 500,
                message: err
            })
            let listBill = []
            let listDetail = []
            listTour.forEach(async e => {
                BillTour.find({ tourID: e._id }, (err, bill) => {
                    if (err) return res.status(500).send({
                        errorCode: 500,
                        message: err
                    })

                    listBill.append(bill)
                })
            })
            listBill.forEach(async e => {
                var user = await User.findById(e.userID)
                var tour = await Tour.findById(e.tourID)
                var detail = {
                    bookedDate: e.bookedDate,
                    tourName: tour.tourName,
                    userID: user.userName
                }
                listDetail.append(detail)
            })
            return res.status(200).send({
                errorCode: 0,
                data: listDetail
            })
        })
    }
    catch (err) {
        return res.status(500).send({
            errorCode: 500,
            message: err
        })
    }
}

exports.deleteBillTour = async (req, res) => {
    try {
        Tour.find({ moderatorID: req.accountID }, (err, list) => {
            if (err) return res.status(500).send({
                errorCode: 500,
                message: err
            })
            list.forEach(async (e) => {
                const bill = await BillTour.findById(req.params.billTourID)
                if (bill.tourID === e._id) {
                    await BillTour.findByIdAndUpdate(req.params.billTourID, { deleted: true }, { new: true }, err => {
                        if (err) return res.status(500).send({
                            errorCode: 500,
                            message: err
                        })
                        return res.status(200).send({
                            errorCode: 0,
                            message: 'Delete bill tour successfully!'
                        })
                    })
                }

            })
        })
    } catch (error) {
        return res.status(500).send({
            errorCode: 500,
            message: error
        })
    }
}


//custom tour

