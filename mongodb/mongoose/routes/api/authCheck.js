authCheck = (req, res, next) => {
  if (!req.user) {
    res.send(console.log('Try again.'))
    res.redirect('/signin')
  } else {
    next()
  }
}