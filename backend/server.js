const app = require('./app')

const {connectDatabase} = require('./config/database');

const dotenv = require('dotenv');
const cloudinary = require('cloudinary')

//Handle Uncaught Exception
process.on('uncaughtException', err => {
    console.log( `ERROR: ${err.stack}`);
    console.log(`Shutting down Server due to Uncaught Exception`);
    process.exit(1)
})

//setting up config file
dotenv.config({path: 'backend/config/config.env'})

//Connecting to database
let database = process.env.DB_LOCAL_URI

connectDatabase(database)

//Setting up cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });



const server = app.listen(process.env.PORT, () => {
    console.log(`server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
})

//Handle Unhandled Promise Rejection
process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err.message}`);
    console.log(`Shutting down server due to  Unhandled Promise rejection`);
    server.close(() => {
        process.exit(1)
    })
})