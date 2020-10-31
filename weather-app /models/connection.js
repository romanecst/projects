var mongoose = require('mongoose');

var options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology : true
}
mongoose.connect('mongodb+srv://romane:roma04@cluster0.bu6a5.mongodb.net/weatherapp?retryWrites=true&w=majority', 
    options,         
    function(err) {
     console.log(err);
    }
);
