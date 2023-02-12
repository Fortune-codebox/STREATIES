const ErrorHandler = require('../utils/errorHandler');
const https = require('https')

const catchAsyncErrors = require('../middlewares/catchAsyncErrors');


exports.initializeTransaction = catchAsyncErrors(async(req, res, next) => {
     
    const params = JSON.stringify({
        "email": req.query.email,
        "amount": req.query.amount,
      })

      // console.log('link: ', `${req.protocol}://${req.get('x-forwarded-host')}/verify/success`)
      const options = {
        hostname: process.env.PAYSTACK_HOST,
        port: process.env.PAYSTACK_PORT,
        path: process.env.PAYSTACK_INITIALIZE_PATH,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }

      const requested = https.request(options, resp => {
        let data = ''
        resp.on('data', (chunk) => {
          data += chunk
        });
        resp.on('end', () => {
          console.log(JSON.parse(data))
          res.status(200).json({
              data: JSON.parse(data)
          })
        })
      }).on('error', error => {
        console.error(error)
        // return next(new ErrorHandler(err, 400))
      })

      requested.write(params)
      requested.end()
})

exports.verifyTransaction = catchAsyncErrors(async(req, res, next) => {
  //  console.log('Verify: ',req.query);
        

    const options = {
        hostname: process.env.PAYSTACK_HOST,
        port: process.env.PAYSTACK_PORT,
        path: `${process.env.PAYSTACK_VERIFY_PATH}/${req.params.reference}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
     const requested = https.request(options, resp => {
       let data = '';
       resp.on('data', (chunk) => {
         data += chunk;
       });
       resp.on('end', () => {
         console.log(JSON.parse(data));
         res.status(200).json({
           data: JSON.parse(data)
         });
       });
     }).on('error', error => {
       console.error(error);
       // return next(new ErrorHandler(error, 400))
     })

      requested.end()
      
})

// Send Paystack API Key   =>   /api/v1/stripeapi
exports.sendPaystackApi = catchAsyncErrors(async (req, res, next) => {

  res.status(200).json({
      paystackApiKey: process.env.PAYSTACK_PUBLIC_KEY
  })

})