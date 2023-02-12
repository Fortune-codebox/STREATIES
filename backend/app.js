const express = require('express');
const cookieParser = require('cookie-parser');
const bodyparser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const path = require('path')


const errorMiddleware =  require('./middlewares/errors')

const options = {
  swaggerDefinition: {
      openapi: "3.0.0",
      info: {
        title: "Streaties API",
        version: "1.0.0",
        description: "Streaties API Endpoints"
      },
      servers: [
        {
            url: "http://localhost:4000/api/v1",
        },
      ]
    },
    apis: [path.join(__dirname, 'routes', '*.js')]
}

const specs = swaggerJsDoc(options);

const app = express();



app.use(express.json());
app.use(cors());
app.use(bodyparser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(fileUpload());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs, { explorer: true }))



//Import all the routes
const products = require('./routes/product');
const auth = require('./routes/auth');
const order = require('./routes/order');
const category = require('./routes/category');
const payment = require('./routes/payment')

app.use('/api/v1', products);
app.use('/api/v1', auth);
app.use('/api/v1', order);
app.use('/api/v1', category)
app.use('/api/v1', payment)
// Middleware to handle errors
app.use(errorMiddleware);


module.exports = app