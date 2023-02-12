const mongoose = require("mongoose");


const connectDatabase = (url) => {

    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(data => {
        console.log(`Mongo Database connected with host: ${data.connection.host}`)
    }).catch((err) => {
        console.log(`Error: ${err}`)
    })
}

const destroyDatabase = (url) => {
    mongoose.connect(url, () => {
        mongoose.connection.db.dropDatabase();
    })
}

module.exports = {connectDatabase, destroyDatabase}