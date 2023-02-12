const mongoose = require('mongoose');



const otpSchema = mongoose.Schema({
    otp: {
        type: String,
        required: true,
    },
    otpExpDate: Date,
    verified: {
        type: Boolean,
        default: false,
        required: true,
    }
})

module.exports = mongoose.model('Otp', otpSchema);