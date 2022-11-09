const db = require('../connector.js')

//import User model
const UserModel = require('../models/user.js')

UserModel.findOneAndUpdate({firstName: 'Jesse'}, { firstName: 'Ellis' }, 
{new: true}
  )

//It works!