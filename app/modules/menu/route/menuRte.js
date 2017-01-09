'use strict';
let express = require('express');
let menu = require('../controller/menuCtrl');

let namespace = '/menu';

module.exports = function(app){
    let route = express.Router();
    route.post(namespace + '/findList.htm',menu.findList);
    app.use(route);
}