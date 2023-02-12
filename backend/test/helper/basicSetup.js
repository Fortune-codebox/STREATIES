const {connectDatabase, destroyDatabase} = require('../../config/database');
const dotenv = require('dotenv');

dotenv.config({path: 'backend/config/config.env'})


let basicSetup = (deleteFile) => {
    before( (done)=>{              // runs before the first test case
        connectDatabase(process.env.DB_TEST_URI)

        done()



    })


    after((done) => {
        destroyDatabase(process.env.DB_TEST_URI)
        deleteFile()
        done()
    })
}

module.exports = basicSetup;
