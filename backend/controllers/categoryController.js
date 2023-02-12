const Category = require('../models/category');
const SubCategory = require('../models/subcategory')

const ErrorHandler = require('../utils/errorHandler');

const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

exports.newCategory = catchAsyncErrors(async(req, res, next) => {
    const category = await Category.create(req.body)

    return res.status(200).json({
        status: true,
        category
    })
})

exports.newSubCategory = catchAsyncErrors(async(req, res, next) => {
    const subCategory = await SubCategory.create(req.body)

    return res.status(200).json({
        status: true,
        subCategory
    })


})

exports.getAllCategories = catchAsyncErrors(async(req, res, next) => {
    const categories = await Category.find()

    const catNames = categories && categories.map(category => {
        return category.name
    })

    return res.status(200).json({
        success: true,
        catNames,
        categories
    })
})

exports.getAllSubCategories = catchAsyncErrors(async(req, res, next) => {
    const subCategories = await SubCategory.find();

    const subCatNames = subCategories && subCategories.map(subCategory => {
        return subCategory.name
    })

    return res.status(200).json({
        success: true,
        subCatNames,
        subCategories
    })
})