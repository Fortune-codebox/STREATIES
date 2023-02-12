const Product = require('../models/product');

const ErrorHandler = require('../utils/errorHandler');

const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

const APIFeatures = require('../utils/apiFeatures'); 
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;


//Create new product => /api/v1/admin/product/new

exports.newProduct = catchAsyncErrors(async(req, res, next) => {
//    console.log(req.user)
   req.body.user = req.user.id
   req.body.category = new ObjectId(req.body.category)
   req.body.subCategory = new ObjectId(req.body.subCategory)
   const product = await Product.create(req.body)

   res.status(201).json({
       success: true,
       product
   })
})


//GET all products => /api/v1/products?keyword=apple

exports.getProducts = catchAsyncErrors(async (req, res, next) => {

    const resPerPage = 8;
    const productsCount = await Product.countDocuments()
    let query = Product.find().populate('category').populate('subCategory')
    const apiFeatures = new APIFeatures(query, req.query)
	.search()
	.filter();
 
    let products = await apiFeatures.query;
    let filteredProductsCount = products.length;
    
    apiFeatures.pagination(resPerPage);
    products = await apiFeatures.query.clone();

    setTimeout(() => {
        res.status(200).json({
            success: true,
            productsCount,
            filteredProductsCount,
            resPerPage,
            products
        })
    }, 2000)
    
})


//Get single product => /api/v1/product/:id

exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id)
    .populate('category')
    .populate('subCategory')
    .exec()

    if(!product){
        return next(new ErrorHandler('Product Not Found', 404))
    }

    setTimeout(() => {
        res.status(200).json({
            success: true,
            product
        })
    }, 2000)
   
})

// Get all products (Admin)  =>   /api/v1/admin/products
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {

    const products = await Product.find();

    res.status(200).json({
        success: true,
        products
    })

})

//Update Product => /api/v1/admin/product/:id

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {

    let product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHandler('Product Not Found', 404))
    }

     product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    
    res.status(200).json({
         success: true,
         product
    })
})

// Delete Product => /api/v1/admin/product/:id

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
     const product = await Product.findById(req.params.id)

     if(!product) {
        return next(new ErrorHandler('Product Not Found', 404)) 
     }

     await product.deleteOne()

     res.status(200).json({
         success: true,
         message: 'Product is Deleted'
     })
})

// Create new review   =>   /api/v1/review
exports.createProductReview = catchAsyncErrors(async(req, res, next) => {
    const {rating, comment, prodId} = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    console.log('Review: ', review)

    const product = await Product.findById(prodId)

    const isReviewed = product.reviews.find( r => {
        r.user.toString() === req.user._id.toString()
    });

    if(isReviewed) {
        product.reviews.forEach(review => {
                review.comment = comment;
                review.rating = rating;
        })
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    }) 
})

exports.getProductReviews = catchAsyncErrors(async(req, res, next) => {
     const product = await Product.findById(req.params.id);

     if(!product) {
         return next(new ErrorHandler('Product/ Product review do not Exist!', 401))
     }

     res.status(200).json({
         success: true,
         reviews: product.reviews
     })
})

// Delete Product Review   =>   /api/v1/reviews
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.productId);

    if(!product) {
        return next(new ErrorHandler('Product Do Not Exist', 401))
    }

    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.reveiewId.toString());
    const numOfReviews = reviews.length;

    const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})