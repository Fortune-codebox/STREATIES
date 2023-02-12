const express = require('express')
const router = express.Router();

const {
    initializeTransaction,
    verifyTransaction,
    sendPaystackApi
} = require('../controllers/paymentController')

const { isAuthenticatedUser } = require('../middlewares/auth')

router.route('/paystackapi').get(isAuthenticatedUser, sendPaystackApi);
router.route('/transaction/initialize').post(isAuthenticatedUser, initializeTransaction);
router.route('/transaction/verify/:reference').get(isAuthenticatedUser, verifyTransaction)


module.exports = router;