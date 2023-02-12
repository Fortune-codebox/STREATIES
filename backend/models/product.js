const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SubCategory = require('./subcategory');
const ErrorHandler = require('../utils/errorHandler');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter product name"],
        trim: true,
        maxLength: [100, "Product name cannot exceed 100 characters"]
    },
    price: {
        type: Number,
        required: [true, "Please enter product price "],
        maxlength: [5, "Product name cannot exceed 100 characters"],
        default: 0.0
    },
    description: {
        type: String,
        required: [true, "Please enter product description"]
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }, 
        }
    ],
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: true
    },
    subCategory: {
        type: mongoose.Schema.ObjectId,
        ref: 'SubCategory',
        required: false
    },
    seller: {
        type: String,
        required: [true, 'Please enter product seller']
    },
    stock:{
        type: Number,
        required: [true, 'Please enter product stock'],
        maxLength: [5, 'Product cannot exceed 5 characters'],
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
    }, 
    reviews: [
        {   
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId ,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

productSchema.pre('save', async function (next) {
    if (this.subCategory) {
      try {
        const check = await SubCategory.findById(this.subCategory);
        if (!check || JSON.stringify(check.category) !== JSON.stringify(this.category)) {
          return next(new ErrorHandler('Subcategory selected must be under the right Category, please cross check and correct!'))
        }
      } catch (error) {
        throw error;
      }
    }
    next();
  });


module.exports = mongoose.model('Product', productSchema)