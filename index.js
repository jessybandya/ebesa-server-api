require('dotenv').config({
    path: require('find-config')('.env')})
  
  const express = require("express");
  const mongoose = require("mongoose");
  const app = express();
  const cors = require("cors");
  const routes = require('./mongodb/mongoose/routes')
  const morgan = require('morgan');
  
  //Authentication
  const passport = require('passport');
  require('./mongodb/mongoose/config/passport');
  const flash = require('connect-flash');
  const cookieParser = require('cookie-parser');
  const bodyParser = require('body-parser');
  const session = require('express-session');
  const MongoStore = require('connect-mongo');
  
  //Storing uri for MongoStore

  const uri = process.env.CONNECTION_URL
  
  const URI = uri
  mongoose.connect(URI, {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true
  }, err => {
      if(err) throw err;
      console.log('Connected to mongodb')
  })
  //Get connection to MongoDB Atlas
  const db = require('./mongodb/mongoose/connector')
  //db.Promise = global.Promise
  
  
  app.use(express.json())
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  
  
  /*app.use(cookieParser(
    process.env.MONGODB_SESSION_SECRET
  ));
  
  
  app.use(session({
    store: MongoStore.create({
      mongoUrl: uri
    }),
    secret: process.env.MONGODB_SESSION_SECRET,
    resave: false, //confirm this value
    saveUninitialized: true, cookie: {
      secure: true,
      maxAge: process.env.SESSION_EXPIRY
    }
  }));
  app.use(passport.session());*/// session secret
  app.use(passport.initialize());
  app.use(flash())
  app.use(cors())
  
  const port = process.env.PORT || 5000;
  app.use(morgan('dev'))
  
  // ==== if it is in a production environment...
  if (process.env.NODE_ENV === 'production') {
    const path = require('path')
    console.log('YOU ARE IN THE PRODUCTION ENV')
    app.use('/static', express.static(path.join(__dirname, '../build/static')))
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '../build/'))
    })
  }
  
  
  //Route addition
  app.use(routes)
  
  app.listen(port, () => {
    //var host = server.address().address
    /* perform a database connection when server starts
    db.connectToServer(function (err) {
      if (err) console.error(err);
    });*/
    console.log(`Server is now running on port: ${port}!`);
  });
  
  app.timeout = 5000