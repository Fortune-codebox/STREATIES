const express = require('express')
const router = express.Router();
const {
        newCategory,
        newSubCategory,
        getAllCategories,
        getAllSubCategories
    } = require('../controllers/categoryController')

const { isAuthenticatedUser, authorizeRoles} = require('../middlewares/auth')

router.route('/admin/category/new').post(isAuthenticatedUser, authorizeRoles('admin'), newCategory)

router.route('/categories/all').get(getAllCategories)

router.route('/admin/subcategory/new').post(isAuthenticatedUser, authorizeRoles('admin'), newSubCategory)

router.route('/subcategories/all').get(getAllSubCategories)


module.exports = router