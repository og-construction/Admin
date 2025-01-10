const express = require('express');
const {   authAdminMiddleware } = require('../middlewares/authMiddleware');
const { createSubcategory, updateSubcategory, deleteSubcategory, getAllSubcategories, getSubcategory, getSubcategoriesByCategoryId} = require('../controller/subCategoryCtrl');
const upload2 = require('../middlewares/multer2');

const router = express.Router();


router.post('/', authAdminMiddleware, upload2.single('image'), createSubcategory);
router.put('/:id', authAdminMiddleware, upload2.single('image'), updateSubcategory);
router.delete('/:id', authAdminMiddleware, upload2.single("image"),deleteSubcategory);
router.get('/',getAllSubcategories);
router.get('/:id',getSubcategory);
router.get('/category/:id',getSubcategoriesByCategoryId)

module.exports = router;
