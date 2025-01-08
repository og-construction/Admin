const express = require('express');
const {   authAdminMiddleware } = require('../middlewares/authMiddleware');
const { createSubcategory, updateSubcategory, deleteSubcategory, getAllSubcategories, getSubcategory, getSubcategoriesByCategoryId} = require('../controller/subCategoryCtrl');

const router = express.Router();


router.post('/',authAdminMiddleware,createSubcategory);
router.put('/:id', authAdminMiddleware,updateSubcategory);
router.delete('/:id', authAdminMiddleware,deleteSubcategory);
router.get('/',getAllSubcategories);
router.get('/:id',getSubcategory);
router.get('/category/:id',getSubcategoriesByCategoryId)

module.exports = router;
