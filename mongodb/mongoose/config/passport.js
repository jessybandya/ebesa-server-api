//https://www.digitalocean.com/community/tutorials/api-authentication-with-json-web-tokensjwt-and-passport

// load all the things we need
const passport = require('passport');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const localStrategy = require('passport-local').Strategy;

const db = require('../connector')
const UserModel = require('../models/user');

// LOCAL SIGNUP
// we are using named strategies since we have one for login and one for signup
passport.use('local-signup', new localStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  async (email, password, done) => {
    try {const user = await UserModel.create({
        email, password
      })
      console.log(`Welcome!`)
      return done(null, user);
      }
     catch (error) {
      console.log(`Signup error: ${error}`)
      done(error)
      }
  }));

// LOCAL LOGIN
passport.use('local-login', new localStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
},
  async (req, email, password, done) => {
    try {
      const user = await UserModel.findOne({
        email
      });

      //Validating password
      if (user == null) {
        console.log("User not initialized")
      } else {
        console.log('User found.')
        const validate = await user.isValidPassword(password);
        if (!validate) {
          console.log('Wrong password'); return done(null, false, {
            message: 'Wrong Password'
          });
        } else {
          if(!user.firstName){
          console.log(`Welcome, ${user._id}!`)
          } else{console.log(`Welcome, ${user.firstName}!`)}
          return done(null, user)}};
    } catch (error) {
      console.log('Error found in local-login' + error)
      return done(null, error);
    }}));

//Verifying the JWT
/*passport.use('jwt', new JWTstrategy(
  {
    secretOrKey: process.env.JWT_TOKEN_SECRET,
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()},
  (token, done) => {
    console.log('Verifier running...')
    try {
      console.log('JWT verified.')
      done(null, token.user);
    } catch (error) {
      console.log('JWT Verification failed.')
      done(error);
    }
  }
)
);*/

passport.use(new JWTstrategy({
  secretOrKey: process.env.JWT_TOKEN_SECRET,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  passReqToCallback: true
}, (payload, done) => {
  User.findById(payload.id)
  .then(user => {
    if (user) {
      console.log('user found by middleware')
      return done(null, user);
    }

    return done(null, false);
  })
  .catch(err => {
    return done(err, false);
  });
}
));

module.exports = passport