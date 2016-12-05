/**
 * Created by moka on 16-7-18.
 */
var express = require("./config/express"),
    config = require("./config/config"),
    mongoose = require("mongoose");

mongoose.set('debug', true);
var options = {};
var db = mongoose.connect(config.url,options).connection;

db.once('open',function () {
    var app = express(db);
    app.listen(config.port);
    console.log('MEAN.JS application started on port ' + config.port);
});