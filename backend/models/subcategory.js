const mongoose = require('mongoose');



const subCategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required:true
    },
})

module.exports = mongoose.model('SubCategory', subCategorySchema);