var express = require('express');
var router = express.Router();
const stripe = require('stripe')('sk_test_51HfQFACHHl93Y5PiB4Xj6Uhh0Z2AYkqwbWFWHxOWAl2HuOl30KtYL2jmhYuOD1HkE8nIOwMoOW4J8PZfMryH111D00sKZkJFfP');
var dataBike = [{
  src:'images/bikeshop-assets/bike-1.jpg',
  nom: 'BJKC45',
  prix: 579,
  express: true
},{
  src:'images/bikeshop-assets/bike-2.jpg',
  nom: 'ZOOK7',
  prix: 799,
  express: true
},{
  src:'images/bikeshop-assets/bike-3.jpg',
  nom: 'LIKO89',
  prix: 839,
  express: false
},{
  src:'images/bikeshop-assets/bike-4.jpg',
  nom: 'GEW08',
  prix: 1249,
  express: true
},{
  src:'images/bikeshop-assets/bike-5.jpg',
  nom: 'KIWIT',
  prix: 899,
  express: false
},{
  src:'images/bikeshop-assets/bike-6.jpg',
  nom: 'NASAY',
  prix: 1399,
  express: true
}];


var frais = 30;
var fraisEx = 130;
var livraison = 0;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {dataBike});
});

router.get('/shop', function(req, res, next) {
  if(req.session.card == undefined){
    req.session.card = [];
    req.session.card.push(req.query);
  }else{
    var inCard = false;
    for(var i=0; i<req.session.card.length; i++){
      if(req.session.card[i].name == req.query.name){
        req.session.card[i].quantity++;
        inCard = true;
      };
    }
    if(inCard == false){
      req.session.card.push(req.query);
    };
  };
  var total = 0;
  var relais = 50;
  for (var i = 0; i<req.session.card.length; i++){
    total += req.session.card[i].price*req.session.card[i].quantity
    relais += 20*req.session.card[i].quantity
    };
    if(total > 2000 && total < 4000){
      frais = 15;
      fraisEx = 65; 
    }else if(total > 4000){
      frais = 0; 
      fraisEx = 0;
    }else{
      frais=30;
      fraisEx = 130;
    };
  res.render('shop', {dataCardBike: req.session.card , total, frais, fraisEx, relais, livraison});
});

router.get('/delete-shop', function(req, res, next) {
  req.session.card.splice(req.query.item,1);
  var total = 0;
  var relais = 50;
  for (var i = 0; i<req.session.card.length; i++){
    total += req.session.card[i].price*req.session.card[i].quantity
    relais += 20*req.session.card[i].quantity
    };
    if(total > 2000 && total < 4000){
      frais = 15;
      fraisEx = 65; 
    }else if(total > 4000){
      frais = 0; 
      fraisEx = 0;
    }else{
      frais=30;
      fraisEx = 130;
    };
  res.render('shop', {dataCardBike: req.session.card, total, frais, fraisEx, relais, livraison });
});

router.post('/update-shop', function(req, res, next) {
  req.session.card[req.body.index].quantity = req.body.quantity;
  var total = 0;
  var relais = 50;
  for (var i = 0; i<req.session.card.length; i++){
  total += req.session.card[i].price*req.session.card[i].quantity
  relais += 20*req.session.card[i].quantity
  };
  if(total > 2000 && total < 4000){
    frais = 15;
    fraisEx = 65; 
  }else if(total > 4000){
    frais = 0; 
    fraisEx = 0;
  }else{
    frais=30;
    fraisEx = 130;
  };
  res.render('shop', {dataCardBike: req.session.card, total, frais, fraisEx, relais, livraison });
});

router.post('/livraison', function(req, res, next) {
  livraison = parseInt(req.body.liv);
  var total = 0;
  var relais = 50;
  for (var i = 0; i<req.session.card.length; i++){
  total += req.session.card[i].price*req.session.card[i].quantity
  relais += 20*req.session.card[i].quantity
  };
  console.log(total);
  if(total > 2000 && total < 4000){
    frais = 15;
    fraisEx = 65; 
  }else if(total > 4000){
    frais = 0; 
    fraisEx = 0;
  }else{
    frais=30;
    fraisEx = 130;
  };
  res.render('shop', {dataCardBike: req.session.card, total, frais, fraisEx, relais, livraison });
});

router.post('/create-checkout-session', async (req, res) => {
  var stripeCard = [];
  for(var i=0; i<req.session.card.length; i++){
    stripeCard.push(
      {
      price_data: {
        currency: 'eur',
        product_data: {
          name: req.session.card[i].name,
        },
        unit_amount: req.session.card[i].price*100,
      },
      quantity: req.session.card[i].quantity,
    }
    );
  };
  stripeCard.push(
    {
    price_data: {
      currency: 'eur',
      product_data: {
        name: "Frais de port",
      },
      unit_amount: livraison*100,
    },
    quantity: 1,
  }
  );
  console.log(stripeCard);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: stripeCard,
    mode: 'payment',
    success_url: 'http://localhost:3000/success',
    cancel_url: 'http://localhost:3000',
  });
  console.log(session.id);
  res.json({ id: session.id });
});

router.get('/success', function(req, res, next) {
  res.render('confirm');
});

module.exports = router;
//Name: req.query.name, Price:req.query.price, Src:req.query.src
