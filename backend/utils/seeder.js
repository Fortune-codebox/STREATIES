const dotenv = require('dotenv');
//setting up dotenv
dotenv.config({path: 'backend/config/config.env'})

const seeder = async (Model, data) => {
    console.log('i got in here')
    try {

        // await Model.deleteMany();
        // console.log('Products are deleted');

        await Model.insertMany(data)
        console.log('All Data are added.')

        // process.exit();

    } catch (error) {
        console.log(error.message);
    }
}

module.exports = seeder

