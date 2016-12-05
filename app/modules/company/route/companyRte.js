/**
 * Created by Yuan on 2016/7/19.
 */
'use strict';
let express = require('express');
var role = require('../controller/companyCtrl');

var namespace = '/company';

module.exports = function (app) {
    let route = express.Router();
    route.get(namespace + "/findAll.htm", role.findAll);
    route.post(namespace + "/findList.htm", role.findList);
    route.post(namespace + "/saveEntity.htm", role.saveEntity);
    app.use(route);
};