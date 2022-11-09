const db = require('../connector.js')

//import User model
const UserModel = require('../models/user.js')


var data = UserModel.findOne({
  firstName: 'Ellis'
}, function (error, result) {
  if (error) {
    throw error;
  } 
  else {console.log(result);}
});

module.exports = data
//It works.