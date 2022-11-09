/*Code from Moz://a website

Link
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose

*/
require('dotenv').config({
  path: require('find-config')('.env')})

//Import the mongoose module
var mongoose = require('mongoose').set('debug', true);





const uri = process.env.CONNECTION_URL;


mongoose.connect(uri, {
  useNewUrlParser: true, useUnifiedTopology: true
});

//Optional. Used to improve performance.
//mongoose.set('autoIndex', false);

//Get the default connection
var db = mongoose.connection;

//Check for connection or notify of errors
db.once('open', _ => {
  console.log('Database connected!')})

db.on('error', err => {
  console.error('connection error:', err)})

module.exports = db;