'use strict';
let express = require('express');
var privilege = require('../controller/privilegeCtrl');

var namespace = '/privilege';

module.exports = function(app){
    let route = express.Router();
    route.post(namespace + '/findList.htm',privilege.findList);
    app.use(route);
}
