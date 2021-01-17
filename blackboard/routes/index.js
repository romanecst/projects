var express = require('express');
var router = express.Router();

var articleModel = require('../models/articles')
var orderModel = require('../models/orders')
var usersModel = require('../models/users')

/* GET home page. */
router.get('/', async function(req, res, next) {
  var outOfStock = await articleModel.find(
    {stock:0}
  );
  var numStock = outOfStock.length;
  var unread = []
  var admin = await usersModel.findById('5c52e4efaa4beef85aad5e52');
  var messages = admin.messages;
  for(var i=0; i<messages.length; i++){
    if(messages[i].read==false){
      unread.push(messages[i].read)
    }
  };
  var numUnread = unread.length;
  var inProgress = []
  var tasks = admin.tasks;
  for(var i=0; i<tasks.length; i++){
    if(tasks[i].dateCloture!=null){
      inProgress.push(tasks[i].dateCloture)
    }
  };
  var numTasks = inProgress.length;
  res.render('index', {numStock, numUnread, numTasks});
});

/* GET tasks page. */
router.get('/tasks-page', async function(req, res, next) {
  var admin = await usersModel.findById('5c52e4efaa4beef85aad5e52');
  var tasks = admin.tasks;
  res.render('tasks', {tasks});
});

/* GET Messages page. */
router.get('/messages-page', async function(req, res, next) {
  var admin = await usersModel.findById('5c52e4efaa4beef85aad5e52');
  var messages = admin.messages;
  res.render('messages', {messages});
});

/* GET Users page. */
router.get('/users-page', async function(req, res, next) {
  var users = await usersModel.find(
    {status: "customer"}
  );
  res.render('users', {users});
});

/* GET Catalog page. */
router.get('/catalog-page', async function(req, res, next) {

  var articles = await articleModel.find();

  res.render('catalog', {articles});
});

/* GET Orders-list page. */
router.get('/orders-list-page', async function(req, res, next) {

  var orders = await orderModel.find();
  
  res.render('orders-list', {orders});
});

/* GET Order detail page. */
router.get('/order-page', async function(req, res, next) {

  var order = await orderModel.findById(req.query.id)
                              .populate('articles')
                              .exec()

  res.render('order', {order});
});

/* GET chart page. */
router.get('/charts', async function(req, res, next) {
  var aggregate = usersModel.aggregate();
  aggregate.group({ _id : "$gender", usercount: { $sum: 1 }});
  var data = await aggregate.exec();
  if(data[0]._id=='male'){
    var male = data[0].usercount;
    var female = data[1].usercount;
  }else{
    var female = data[0].usercount;
    var male = data[1].usercount;
  };
  var users = await usersModel.find();
  var msg = [];
  var read = 0;
  var unread = 0;
  users.forEach(el =>{
    msg.push(el.messages)
    });
  msg.forEach(el =>{
    for(var i=0; i<el.length; i++){
      if(el[i].read == true){
        read++;
      }else{
        unread++;
      }
    }
  });
  var aggregateC = orderModel.aggregate();
  aggregateC.group({ _id : "$status_shipment", expcount: { $sum: 1 }});
  var dataC = await aggregateC.exec();
  if(dataC[0]._id==true){
    var exp = dataC[0].expcount;
    var noExp = dataC[1].expcount;
  }else{
    var exp = dataC[1].expcount;
    var noExp = dataC[0].expcount;
  };
  var aggregateA = orderModel.aggregate();
  aggregateA.match({"status_payment":'validated'});
  aggregateA.group({ _id : {month:{$month: '$date_insert' }}, cda: { $sum: "$total" }});
  var dataorders = await aggregateA.exec();
  console.log(dataorders);
  res.render('charts', {male, female, read, unread, exp, noExp});
});



module.exports = router;
