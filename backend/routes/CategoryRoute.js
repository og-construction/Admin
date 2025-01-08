const express = require('express');
const {  isAdmin, authUserMiddleware, authAdminMiddleware } = require('../middlewares/authMiddleware');
const { createCategory, updateCategory, deleteCategory, getAllCategories, getCategory } = require('../controller/CategoryCtrl');
const router = express.Router();

router.post("/",authAdminMiddleware, createCategory);
router.put("/:id",authAdminMiddleware, updateCategory);
router.delete("/:id",authAdminMiddleware, deleteCategory);
router.get("/get-all" , getAllCategories); // Corrected
router.get("/:id", authAdminMiddleware, getCategory);



module.exports = router;
