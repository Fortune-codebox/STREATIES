const expect = require('chai').expect;
const request = require('supertest')
const User = require('../../models/user')
const basicSetup = require('../helper/basicSetup')
const fs = require('fs');
const {unlink, writeFile, appendFile} = require('fs').promises
const app = require('../../app');
const path = require('path')
const userData = require('../../data/users.json')
const seeder = require('../../utils/seeder');

const req = request.agent(app)

seeder(User, userData)

const readFileOtp = async (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf-8', (err, data) => {
      if (err) {
        reject(err)
        // cb()
        // throw err
      };
      //  cb(null,data)
      resolve(data)
    });

  })
}

const deleteFile = async() => {
  try {
    await unlink(path.join(__dirname, '..', '..', '..' , 'test.json'));
    // console.log('successfully deleted test.json');
  } catch (error) {
    console.error('there was an error:', error.message);
  }
}
describe('',() => {

   let payload
   let otp
   let credentials
   beforeEach(() => {

    payload = {
      name: 'Thomas Wayne',
      email: 'test@example.com',
      password: 'test123',
      role: 'admin',
      avatar: {
          public_id: '123',
          url: 'http://example.com/tg.jpg'
      }
    }

   })
   basicSetup(deleteFile)


  describe('User API Endpoints', () => {

      it('Register a New User Successfully', async() => {

        const res =  await req.post('/api/v1/auth/register').send(payload)

        const {body} = res
        expect(res.statusCode).to.eql(200)
        expect(body.user.name).to.eql('Thomas Wayne')

        let regUser = await User.findOne({name: 'Thomas Wayne'})
        expect(body.user.email).to.eql(regUser.email)
       })

      it("Cannot Register with the same email", async() => {
        const user2 = await req.post('/api/v1/auth/register').send(payload)
        expect(user2.body.message).to.eql('Email already in use')
        expect(user2.statusCode).to.eql(400)

      })

      it('Login Existing User Successfully', async() => {

          const credentials = {
            email: 'test@example.com',
            password: 'test123'
          }
          const loginUser = await req.post('/api/v1/auth/login').send(credentials)

          expect(loginUser.statusCode).to.eql(200)
          expect(loginUser.body).to.not.have.property('token')
          let credit;
          const data = await readFileOtp(path.join(__dirname, '..', '..', '..' , 'test.json'))
          credit = JSON.parse(data)
          const verify = await req.post('/api/v1/auth/verify/otp').send(credit)
          // console.log(verify)
          // await writeFile('body.json', JSON.stringify(body, null, 4))
          expect(verify.statusCode).to.eql(200)


      })

      it('Login Error with invalid credentials', async() => {
        const credentials = {
          email: 'test1@example.com',
          password: 'test1234'
        }
        let inUser = await req.post('/api/v1/auth/login').send(credentials)
        expect(inUser.statusCode).to.equal(401)
      })

      it('Login Error with no credentials', async() => {
        const credentials = {
          email: '',
          password: 'test1234'
        }
        let wrongInput = await req.post('/api/v1/auth/login').send(credentials)

        expect(wrongInput.statusCode).to.equal(400)
        expect(wrongInput.body.message).to.eql('Please enter email & password')
      })

      it('Verification Error without the verification key.', async() => {
          const credentials = {
            verification_key: '',
            email: 'test@example.com',
            otp: 'Xfehwy'
          }

          const verify = await req.post('/api/v1/auth/verify/otp').send(credentials)
          expect(verify.statusCode).to.eql(400)
          expect(verify.body.message).to.eql('Verification Key is required')
      })

      it('Verification Error without email.', async() => {
        const credentials = {
          verification_key: 'e=hebcdhbfhbffbshkjaehweggwquhashodhhdhdghie',
          email: '',
          otp: 'Xfehwy'
        }

        const verify = await req.post('/api/v1/auth/verify/otp').send(credentials)
        expect(verify.statusCode).to.eql(400)
        expect(verify.body.message).to.eql('Email is required')
      })

      it('Verification Error without otp.', async() => {
        const credentials = {
          verification_key: 'e=hebcdhbfhbffbshkjaehweggwquhashodhhdhdghie',
          email: 'test@example.com',
          otp: ''
        }

        const verify = await req.post('/api/v1/auth/verify/otp').send(credentials)
        expect(verify.statusCode).to.eql(400)
        expect(verify.body.message).to.eql('Otp is required')
      })

      it('Verification Error: otp was not sent to this email', async() => {

        try {
          let info;
          const file = await readFileOtp(path.join(__dirname, '..', '..', '..' , 'test.json'))
          info = JSON.parse(file)
          const credentials = {
            verification_key: info.verification_key,
            email: 'test1@example.com',
            otp: info.otp
          }
          const verify = await req.post('/api/v1/auth/verify/otp').send(credentials)
          expect(verify.statusCode).to.eql(400)
          expect(verify.body.message).to.eql('OTP was not sent to this particular email')
          expect(verify.body.success).to.eql(false)

        } catch (error) {
          console.log(error)
        }

      })

      it('Verification Error: Invalid Otp', async() => {
        try {
          let info;
          const file = await readFileOtp(path.join(__dirname, '..', '..', '..' , 'test.json'))
          info = JSON.parse(file)
          const credentials = {
            verification_key: info.verification_key,
            email: info.email,
            otp: 'Vfdgey'
          }
          const verify = await req.post('/api/v1/auth/verify/otp').send(credentials)
          expect(verify.statusCode).to.eql(400)
          expect(verify.body.message).to.eql('Incorrect otp')
          expect(verify.body.success).to.eql(false)
        } catch (error) {
          console.log(error)
        }

      })
  })

  describe('Other User Logged In Requests/Admin Users', () => {

      it('Get logged In User Profile Successfully', async() => {
        const info = await req.get('/api/v1/me')
        expect(info.statusCode).to.eql(200)
      })

      it('Only logged in User and an Admin can retrieve all users', async() => {
        let info;
        const allUsers = await req.get('/api/v1/admin/users')
        const data = await readFileOtp(path.join(__dirname, '..', '..', '..' , 'test.json'))

        info = JSON.parse(data)
        // console.log('info: ', info)
        let newObj = {
            ...info,
            users: allUsers.body.users
        }
        await writeFile(path.join(__dirname, '..', '..', '..', 'test.json'), JSON.stringify(newObj, null, 4))

        // console.log(allUsers.body.users)
        expect(allUsers.body).to.have.property('users')
        expect(allUsers.statusCode).to.eql(200)


      })

      it('Only logged in User and an Admin can view users by id', async () => {


        let info
        const data = await readFileOtp(path.join(__dirname, '..', '..', '..' , 'test.json'))
        info = JSON.parse(data)


        const user = await req.get(`/api/v1/admin/user/${info.users[0]._id}`)
        // console.log(user)
        expect(user.statusCode).to.eql(200);
        expect(user.body).to.have.property('user');

      })

      it('Only logged in User and an Admin: Update User Info',  async() => {
        let info;

        const data = await readFileOtp(path.join(__dirname, '..', '..', '..' , 'test.json'));
        info = JSON.parse(data);
        const payload = {
          name: 'Mary Mary',
          email: 'waynerooney@example.com',
          role: 'admin'
        }
        const id = info.users[2]._id
        const user = await req.put(`/api/v1/admin/user/${id}`).send(payload);
        // console.log('u: ', user)
        expect(user.statusCode).to.equal(200);


      })

      it('Only logged in User and an Admin: View User Not Found', async () => {

        const user = await req.get(`/api/v1/admin/user/638672380233f066e3zf48d1`)
        // console.log(user)
        expect(user.statusCode).to.eql(404);
        expect(user.body.message).to.eql('User with id of 638672380233f066e3zf48d1 does not exist')

      })

      it('Only logged in User and an Admin: Delete User Successfully', async () => {
        let info;
        const data = await readFileOtp(path.join(__dirname, '..', '..', '..' , 'test.json'));
        info = JSON.parse(data);

        const user = await req.delete(`/api/v1/admin/user/${info.users[2]._id}`)
        // console.log(user)
        expect(user.statusCode).to.eql(200);
        expect(user.body.success).to.eql(true)

      })

      it('Only logged in User and an Admin: Active User cannot delete itself', async () => {
        let info;
        const data = await readFileOtp(path.join(__dirname, '..', '..', '..' , 'test.json'));
        info = JSON.parse(data);

        const loggedInUser = info.users.find(user => {
          return user.email === payload.email
        })
        const user = await req.delete(`/api/v1/admin/user/${loggedInUser._id}`)
        // console.log(user)
        expect(user.statusCode).to.eql(400);
        expect(user.body.message).to.eql('Active User Cannot Delete Itself')

      })

      it('Only logged in User and an Admin: Cannot Delete User that dont Exist', async () => {


        const user = await req.delete(`/api/v1/admin/user/638672380233f066e3zf48d1`)
        // console.log(user)
        expect(user.statusCode).to.eql(404);
        expect(user.body.message).to.eql(`Cannot Delete User: User not found with id: 638672380233f066e3zf48d1`)

      })

    })

})

