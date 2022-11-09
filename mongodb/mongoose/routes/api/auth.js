const router = require('express').Router()

//Get mongoDB connection and access to users collection
const db = require('../../connector')
const UserModel = require('../../models/user')

//Import authentication dependencies
const passport = require('passport')
const LocalStrategy = require('passport-local')
const session = require('express-session')
const flash = require('connect-flash')

router.use(flash())
router.use(session({
  secret: 'test-secret', resave: false, saveUninitialized: false
}))
router.use(passport.initialize())
router.use(passport.session())
passport.use(new LocalStrategy((firstName, password, authCheckDone) => {
  UserModel.findOne({
    firstName: req.body.firstName
  }).then(user => {
    if (!user) {
      return authCheckDone(null, false)} if (user.password != password) {
      return authCheckDone(null, false)}})
}))

passport.serializeUser((user, done) => {
  done(null, user._id)
})
passport.deserializeUser((id, done)=> {
  done(null, {
    id
  })
})

router.get('/login', (req, res, next) => {
  const errors = req.flash().error || []
  res.send('login', {
    errors
  })
})

router.post('/login', passport.authenticate('local'), (req, res, next) => {
  res.redirect('/secret')})

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated) {
    return next()}
  res.redirect('/login')
}

router.get('/secret', ensureAuthenticated, (req, res, next) => {
  res.send('Secret area!!!')})

module.exports = router