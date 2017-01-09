'use strict';
let express = require('express');
let privilege = require('../controller/privilegeCtrl');

let namespace = '/privilege';

module.exports = function(app){
    let route = express.Router();
    route.post(namespace + '/findList.htm',privilege.findList);
    app.use(route);
}
