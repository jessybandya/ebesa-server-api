const db = require('../connector.js')

//import User model
//import UserModel from '../models/user.js'
const UserModel = require('../models/user.js')

const newUser = UserModel.create({
  firstName: 'Marcus',
  lastName: 'Rashford',
  password: '54321'
})


//It works.