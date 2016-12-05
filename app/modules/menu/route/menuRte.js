'use strict';
let express = require('express');
var menu = require('../controller/menuCtrl');

var namespace = '/menu';

module.exports = function(app){
    let route = express.Router();
    route.post(namespace + '/findList.htm',menu.findList);
    app.use(route);
}