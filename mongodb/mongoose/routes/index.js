const router = require('express').Router();
const apiRoutes = require('./api');
const passport = require('passport')
const keys = require('../config/keys');
const {apiURL} = keys.app;

const api = `/${apiURL}`;

// api routes
//router.use('/user', passport.authenticate('jwt',{session: false}), secureRoute);
router.use(api, apiRoutes);
router.use(api, (req, res) => res.status(404).json('No API route found'));

module.exports = router;