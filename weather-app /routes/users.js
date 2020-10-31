var express = require('express');
var router = express.Router();
var userModel = require('../models/user');

/* GET users listing. */
router.get('/logout', function(req, res, next) {
  req.session.user = {};
  res.redirect('/');
});

router.post('/sign-up', async function(req, res, next) {
  var exist = await userModel.findOne(
    {email: req.body.email}
  );
  if(exist == null){
  var newUser = new userModel({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });
  req.session.user = newUser;
  await newUser.save();

  res.redirect('/weather');
  }else{
    var alert = false;
    res.render('login',{alert, exist});
  }
});

router.post('/sign-in', async function(req, res, next) {
  var user = await userModel.findOne(
    {email: req.body.email}
  );
  if(user == null){
    res.render('login');
  }else if (user.email == req.body.email && user.password == req.body.password){
    req.session.user = user;
    res.redirect('/weather');
  }else{
    var alert = true;
    var exist = null;
    res.render('login', {alert, exist});
  }
});
module.exports = router;
