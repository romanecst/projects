var mongoose = require('mongoose');
const URI = require('./URI');

var options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology : true
}
mongoose.connect(URI, 
    options,         
    function(err) {
     console.log(err);
    }
);
