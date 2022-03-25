const express = require('express')
const { addHotelRoom, editHotelRoom, updateHotelRoom, deleteHotelRoom, listHotelRoom, detailHotelRoom,
     listBillHotelRoom, searchHotelRoom, filterHotelRoom } = require('../../controllers/moderator/hotel.controller')
const { verifyToken, isModerator } = require('../../middlewares/jwt.middleware')
const { upload } = require('../../middlewares/uploadFile.middleware')
const router = express.Router()

router.post('/add-hotel-room', [verifyToken, isModerator, upload.array('photo')], addHotelRoom )
router.get('/edit-hotel-room/:slug',[verifyToken, isModerator], editHotelRoom)
router.patch('/update-hotel-room/:slug', [verifyToken, isModerator, upload.array('photo')], updateHotelRoom)
//router.patch('/delete-hotel-room/:slug', [verifyToken, isModerator], deleteHotelRoom)
router.get('/list-hotel-room', [verifyToken, isModerator], listHotelRoom)
router.get('/detail-hotel-room/:slug', [verifyToken, isModerator], detailHotelRoom)

//bill hotel-room
 router.get('/list-bill-hotel-room', [verifyToken, isModerator],listBillHotelRoom) //chưa có bill để test
// router.patch('/delete-bill-hotel-room/:billhotel-roomID', [verifyToken, isModerator], deleteBillHotelRoom) // chưa test, xóa mềm

// //search hotel-room, filter price
router.get('/search', [verifyToken,isModerator], searchHotelRoom)
router.get('/filter-hotel-room', [verifyToken, isModerator], filterHotelRoom)




module.exports = router