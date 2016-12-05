/**
 * Created by Yuan on 2016/7/19.
 */
'use strict';
let express = require('express');
var organize = require('../controller/organizeCtrl');

var namespace = '/organize';

module.exports = function (app) {
    let route = express.Router();
    route.get(namespace + "/findAll.htm", organize.findAll);
    route.post(namespace + "/findList.htm", organize.findList);
    route.post(namespace + "/findById.htm", organize.findById);
    route.post(namespace + "/saveEntity.htm", organize.saveEntity);
    route.post(namespace + "/findNextAllById.htm", organize.findNextAllById);
    app.use(route);
};