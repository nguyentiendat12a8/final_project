const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const softDelete = require('mongoose-delete')
const { Account } = require("./user.schema")
const { BillTour } = require('./billTour.schema')
const {Tour} = require('./tour.schema')
const { Admin } = require('./admin.schema')
const { BillHotelRoom } = require('./billHotelRoom.schema')
const { TourCustom } = require('./tourCustom.schema')
const { CategoryTour } = require('./categoryTour.schema')
const { CommentPostExperience } = require('./commentPostExperience.schema')
const { HotelRoom } = require('./hotelRoom.schema')
const { Like } = require('./like.schema')
const { Moderator } = require('./moderator.schema')
const { Post } = require('./post.schema')
const { PostExperience } = require('./postExperience.schema')
const { User } = require('./user.schema')
const { ResetPassword } = require('./resetPassword.schema')
const { RateTour } = require('./rateTour.schema')
const { TourDraft } = require('./tourDraft.schema')
const { TourDraftStatus } = require('./tourDraftStatus.schema')


mongoose.plugin(softDelete, {
    deleteAt: true,
    overrideMethods : 'all'
})

const db = {}

db.mongoose = mongoose

db.account = Account
db.tour = Tour
db.billTour = BillTour
db.admin = Admin
db.billHotelRoom = BillHotelRoom
db.categoryTour = CategoryTour
db.commentPostExperience = CommentPostExperience
db.hotelRoom = HotelRoom
db.like = Like
db.moderator = Moderator
db.post = Post
db.postExperience = PostExperience
db.tourCustom = TourCustom
db.user = User
db.resetPassword = ResetPassword
db.rateTour = RateTour 
db.tourDraft = TourDraft
db.tourDraftStatus = TourDraftStatus
db.ROLES = ['user', 'admin', 'moderator']

module.exports = db