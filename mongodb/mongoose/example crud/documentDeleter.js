const db = require('../connector.js')

//import User model
const UserModel = require('../models/user.js')


UserModel.deleteOne({ firstName: /*Specify a value*/ }).then(function(){
    console.log("Data deleted"); // Success
}).catch(function(error){
    console.log(error);
})


//It works.