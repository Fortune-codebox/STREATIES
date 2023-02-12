const User = require('../models/user');
const Otp = require('../models/otp')

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
var otpGenerator = require('otp-generator');
const cloudinary = require('cloudinary')
var handlebars = require('handlebars');
const fs = require('fs');
const fsPromises = require('fs').promises
const path = require('path');


const readHTMLFile = function(path, callback, next) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
           callback(err);
           throw err;

        }
        else {
            callback(null, html);
        }
    });
};


//Register a user => /api/v1/register

exports.registerUser = catchAsyncErrors(async(req, res, next) => {

        const checkUser = await User.findOne({email: req.body.email})

        if(checkUser) {

            res.status(400).json({
                message: 'Email already in use'
            })
            // return next(new ErrorHandler('Email already in use', 400))
        }


        let user;
        if(process.env.NODE_ENV === 'TESTING') {
            user = await User.create(req.body)
        } else {

            const result = cloudinary.v2.uploader.upload(req.body.avatar, {
                folder: 'avatars',
                width: 150,
                crop: "scale",

            },
            function(error, result) {console.log(result, error)})

            const {name, email, password} = req.body;


            user = await User.create({
                name,
                email,
                password,
                avatar: {
                    public_id: result.public_id,
                    url: result.secure_url
                }
            })

            }

            sendToken(user, 200, res)






})

sendEmailOTP = async (email,user,res, next) => {
    //Generate OTP
    const otp = otpGenerator.generate(8, { alphabets: false, upperCase: false, specialChars: false });
    const now = new Date();
    const otpExpDate = AddMinutesToDate(now,10);

    const otpCreated = await Otp.create({
        otp,
        otpExpDate
    })

    const message = `Your otp verification code is:\n\n One Time Password: ${otp}\n\nIf you have not requested this email, then ignore it.`

    try {

        readHTMLFile(path.join(__dirname, '..', 'templates' , 'sendotp.html'), async function(err, html) {
            const template = handlebars.compile(html);
            const replacements = {
                otp: otp
            };
            const htmlToSend = template(replacements);

            await sendEmail({
                email: email,
                subject: 'Streaties.co OTP Verification Code',
                html: htmlToSend
            })
        })

        const details={
            "timestamp": now,
            "check": email,
            "otp_id": otpCreated._id,
            "user_id": user._id
          }
          let buff =  Buffer.from(JSON.stringify(details), 'utf8');
          let base64data = buff.toString('base64');
        //   console.log("The encoded base64 string is:", base64data);

          const returnMessage = `An email has been sent to ${email},
                                please enter the OTP below to proceed.
                                Regards`



         if(process.env.NODE_ENV === 'TESTING') {
            const writtenFile = {
                otp: otp,
                email: email,
                verification_key: base64data
            }
            n
         }

          res.status(200).json({
            success: true,
            message: returnMessage,
            details: base64data,
            email: email
        })

    } catch (error) {

        return next(new ErrorHandler(error.message, 500))
    }

}

//Login User /api/v1/auth/login

exports.loginUser = catchAsyncErrors(async(req, res, next) => {
    const {email, password} = req.body;


    //checks if email and password is entered by user
    if(!email || !password) {
        res.status(400).json({
            message: 'Please enter email & password',
            success: false
        })
        // return next(new ErrorHandler('Please enter email & password', 400))
    }
    //finding user in database
    const user = await User.findOne({email}).select('+password')
    if(!user){

        res.status(401).json({
            message: 'Invalid Email Or Password'
        })
        // return next(new ErrorHandler('Invalid Email Or Passwword', 401))
    }
    //checks if password is corrrect or not
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched) {
        res.status(401).json({
            message: 'Invalid Email Or Password',
            success: false
        })
        return next(new ErrorHandler('Invalid Email Or Password', 401))

    }
    await sendEmailOTP(email, user, res, next)


})

// To add minutes to the current time
function AddMinutesToDate(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
  }

exports.verifyOTP = catchAsyncErrors(async(req, res, next) => {
    const {verification_key, otp, email} = req.body;

    if(!verification_key) {
        res.status(400).json({
            success: false,
            message: 'Verification Key is required'
        })
        return next(new ErrorHandler('Verification Key is required', 400))
    }
    if(!otp) {
        res.status(400).json({
            success: false,
            message: 'Otp is required'
        })
        return next(new ErrorHandler('Otp is required', 400))
    }

    if(!email) {
        res.status(400).json({
            success: false,
            message: 'Email is required'
        })
        return next(new ErrorHandler('Email is required', 400))
    }


    let decoded
    try {

        // Create a buffer from the string
        let bufferObj = Buffer.from(verification_key, "base64");
        // console.log('buffer_obj', bufferObj);

        // Encode the Buffer as a utf8 string
        decoded = bufferObj.toString("utf8");

        const parsedObj = JSON.parse(decoded)

        if(email !== parsedObj.check) {
            res.status(400).json({
                success: false,
                message: 'OTP was not sent to this particular email'
            })
            return next(new ErrorHandler('OTP was not sent to this particular email', 400))
        }

        const activeOtp = await Otp.findOne({
            _id: parsedObj.otp_id,
            otpExpDate: { $gt: Date.now() }
        })

        if(!activeOtp) {
            res.status(400).json({
                success: false,
                message: "otp is invalid or has been expired"
            })
            return next(new ErrorHandler("otp is invalid or has been expired", 400))
        }

        if(activeOtp.otp !== otp) {
            res.status(400).json({
                success: false,
                message: "Incorrect otp"
            })
            return next(new ErrorHandler('Incorrect otp', 400))
        }

        if(activeOtp.verified) {
            res.status(400).json({
                success: false,
                message: "the otp is already used"
            })
            return next(new ErrorHandler("the otp is already used", 400))
        }

        const user = await User.findById(parsedObj.user_id)

        if(!user) {
            res.status(400).json({
                success: false,
                message: 'User Does Not Exist'
            })
            return next(new ErrorHandler('User Does Not Exist', 400))
        }

        activeOtp.verified = true

        await activeOtp.save()

        sendToken(user, 200, res)


    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }



})

// Forgot Password   =>  /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler('User not found with this email', 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset password url
    // const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const resetUrl = `${req.protocol}://${req.get('x-forwarded-host')}/password/reset/${resetToken}`;
    console.log('ResetUrl', resetUrl)

    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`

    try {

        await sendEmail({
            email: user.email,
            subject: 'Streaties.co Password Recovery',
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`

        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500))
    }

})

// Reset Password   =>  /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    // Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or has been expired', 400))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400))
    }

    // Setup new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res)

})

// Get currently logged in user details   =>   /api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {

    res.status(200).json({
        success: true,
        user: req.user
    })
});

// Update / Change password   =>  /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    // Check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword)
    if (!isMatched) {
        return next(new ErrorHandler('Old password is incorrect', 400));
    }

    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res)

})



// Update user profile   =>   /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    // Update avatar
    if (req.body.avatar !== '') {
        const user = await User.findById(req.user.id)

        const image_id = user.avatar.public_id;
        const res = await cloudinary.v2.uploader.destroy(image_id);

        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: "scale"
        })

        newUserData.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})




// Logout user   =>   /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logged out'
    })
})


// Admin Routes

// Get all users   =>   /api/v1/admin/users
exports.allUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    const numberOfUsers = await User.countDocuments()

    res.status(200).json({
        success: true,
        numberOfUsers,
        users
    })
})


// Get user details   =>   /api/v1/admin/user/:id
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        // console.log(error.message)
        res.status(404).json({
            success: false,
            message: `User with id of ${req.params.id} does not exist`
        })
        return next(new ErrorHandler(`User with id of ${req.params.id} does not exist`, 404));

    }




})

// Update user profile   =>   /api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        message: 'Updated Successfully',
        user
    })
})

// Delete user   =>   /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    if(req.user.id === req.params.id) {
        res.status(400).json({
            success: false,
            message: `Active User Cannot Delete Itself`
        })
        return next(new ErrorHandler(`Active User Cannot Delete Itself`, 400))
    }
    let user
    try {
        user = await User.findById(req.params.id);
        await user.remove();
        res.status(200).json({
            success: true,
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: `Cannot Delete User: User not found with id: ${req.params.id}`
        })
        return next(new ErrorHandler(`Cannot Delete User: User not found with id: ${req.params.id}`, 404))
    }


    // Remove avatar from cloudinary
    // const image_id = user.avatar.public_id;
    // await cloudinary.v2.uploader.destroy(image_id);


})