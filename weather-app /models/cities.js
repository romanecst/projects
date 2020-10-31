var mongoose = require('mongoose');
var citySchema = mongoose.Schema({
    name: String,
    url: String,
    desc: String,
    tempmax: Number,
    tempmin: Number,
    lon: Number,
    lat: Number,
    userid: Array
});

var cityModel = mongoose.model('city',citySchema);

module.exports = cityModel;