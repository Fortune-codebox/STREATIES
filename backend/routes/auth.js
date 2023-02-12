const express = require('express');
const router = express.Router();



const {
    registerUser,
    loginUser,
    logout,
    forgotPassword,
    resetPassword,
    getUserProfile,
    updatePassword,
    updateProfile,
    allUsers,
    getUserDetails,
    updateUser,
    deleteUser,
    verifyOTP
} = require('../controllers/authController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

/**
 * @swagger
 *
 * components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - name
 *          - email
 *          - password
 *        properties:
 *          id:
 *            type: string
 *            description: The auto-generated id of the book.
 *          name:
 *            type: string
 *            description: name of user
 *          email:
 *            type: string
 *            format: email
 *            description: user email
 *          password:
 *            type: string
 *            format: password
 *            description: Password for registered User
 *          role:
 *            type: string
 *            description: role of a user
 *          createdAt:
 *            type: string
 *            format: date-time
 *          avatar:
 *            $ref: '#/components/schemas/Avatar'
 *            required: true
 *
 *      Avatar:
 *        type: object
 *        required:
 *          - public_id
 *          - url
 *        properties:
 *          public_id:
 *            type: string
 *            description: public id for avatar
 *          url:
 *            type: string
 *            description: url for the avatar
 *
 *      RegisteredSuccess:
 *        type: object
 *        properties:
 *          success:
 *            type: boolean
 *            description: Status for response return
 *          token:
 *            type: string
 *            description: Token for registered user
 *          user:
 *            $ref: '#/components/schemas/User'
 *
 */

/**
 * @swagger
 *  tags:
 *    name: Users
 *    description: Users in the system
 */

/**
 * @swagger
 *
 * /auth/register:
 *    post:
 *      summary: Register a new user
 *      requestBody:
 *        description: Request Body for registering a new user
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *
 *      responses:
 *        '201':
 *          description: User Created Successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/RegisteredSuccess'
 */

router.route('/auth/register').post(registerUser);
router.route('/auth/login').post(loginUser);
router.route('/auth/verify/otp').post(verifyOTP)

router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);

router.route('/logout').get(logout);

router.route('/me').get(isAuthenticatedUser, getUserProfile);
router.route('/password/update').put(isAuthenticatedUser, updatePassword)
router.route('/me/update').put(isAuthenticatedUser, updateProfile);

//Admin Routes
router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles('admin'), allUsers)

router.route('/admin/user/:id')
    .get(isAuthenticatedUser, authorizeRoles('admin'), getUserDetails)
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateUser)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser)
module.exports = router;