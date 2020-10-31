var express = require('express');
var router = express.Router();
var request = require("sync-request");
var cityModel = require('../models/cities');
var userModel = require('../models/user');

var err = '';
var cities;

router.get('/', function(req, res, next) {
  var alert = false;
  var exist = null;
  res.render('login',{alert, exist});
});


router.get('/weather', async function(req, res, next) {
  if(req.session.user == undefined){
    res.redirect('/');
  }else if(await userModel.findOne(req.session.user)== null){
    res.redirect('/');
  }else{
  cities = await cityModel.find(
    {userid: { $all: [req.session.user._id] } }
  );
  res.render('weather', { cityList: cities, err, user: req.session.user.username});
  };
});

router.post('/addcity', async function(req, res, next) {
  var result = request("GET", `https://api.openweathermap.org/data/2.5/weather?q=${req.body.city}&appid=9a2a5e9dc748c7c0ba9473ff7c6864be&units=metric`);
  var inAPI = true;
  err="";
  if(result.statusCode == 404){
    inAPI = false;
    err = 'City not found';
  }else{
    var resultJSON = JSON.parse(result.getBody());

    var inArray  = await cityModel.findOne(
      {name: req.body.city}
    );
    if(inArray == null){
    var newCity = new cityModel({
      name: req.body.city,
      url: `http://openweathermap.org/img/wn/${resultJSON.weather[0].icon}@2x.png`,
      desc: resultJSON.weather[0].main,
      tempmax: Math.round(resultJSON.main.temp_max),
      tempmin: Math.round(resultJSON.main.temp_min),
      lon: resultJSON.coord.lon,
      lat: resultJSON.coord.lat,
      userid: []
    });
    await newCity.save();
    };
    var id = await userModel.findOne(
      {name: req.body.city, 
      userid: { $all: [req.session.user._id] } }
    );
    if(id == null){
      await cityModel.updateOne(
        {name: req.body.city},
        { $push: {userid: req.session.user._id} }
      );
    };
    cities = await cityModel.find(
      {userid: { $all: [req.session.user._id] } }
    );
  }
  res.render('weather', { cityList: cities, err, user: req.session.user.username});
});

router.get('/delete-city', async function(req, res, next) {
  del = await cityModel.findOne({ name: req.query.name});
  if(del.userid.length == 1){
  await cityModel.deleteOne({ name: req.query.name});
  }else{
    await cityModel.updateOne(
      {name: req.query.name},
      { $pull: {userid: req.session.user._id} }
    );
  }
  cities = await cityModel.find(
    {userid: { $all: [req.session.user._id] } }
  );
  res.render('weather', { cityList: cities, err, user: req.session.user.username});
});

router.get('/update', async function(req, res, next) {
  cities = await cityModel.find();
  for(let i=0; i<cities.length; i++){
    var result = request("GET", `https://api.openweathermap.org/data/2.5/weather?q=${cities[i].name}&appid=9a2a5e9dc748c7c0ba9473ff7c6864be&units=metric`);
    var resultJSON = JSON.parse(result.getBody());
    await cityModel.updateOne(
      { name: cities[i].name}, 
      {
        url: `http://openweathermap.org/img/wn/${resultJSON.weather[0].icon}@2x.png`,
        desc: resultJSON.weather[0].main,
        tempmax: Math.round(resultJSON.main.temp_max),
        tempmin: Math.round(resultJSON.main.temp_min)
      }
    );
  };
  cities = await cityModel.find(
    {userid: { $all: [req.session.user._id] } }
  );
  res.render('weather', { cityList: cities, err, user: req.session.user.username });
});

module.exports = router;
