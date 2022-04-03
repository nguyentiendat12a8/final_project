const express = require('express');
const { addCategory,listCategory, editCategory, updateCategory, deleteCategory } = require('../../controllers/admin/manageTour.controller');
const { verifyToken, isAdmin } = require('../../middlewares/jwt.middleware');
const router = express.Router()

router.post('/add-category', [verifyToken, isAdmin], addCategory)
router.get('/list-category', [verifyToken, isAdmin], listCategory)
router.get('/edit-category/:categoryID', [verifyToken, isAdmin], editCategory)
router.put('/update-category/:categoryID', [verifyToken, isAdmin], updateCategory)
router.delete('/delete-category/:categoryID', [verifyToken, isAdmin], deleteCategory)

module.exports = router;