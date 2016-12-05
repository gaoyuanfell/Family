/**
 * Created by Yuan on 2016/7/19.
 */
'use strict';
let express = require('express');
var auth = require('../controller/authCtrl');

var namespace = '/auth';

module.exports = function (app) {
    let route = express.Router();
    route.post(namespace + "/findList.htm", auth.findList);
    route.post(namespace + "/saveEntity.htm", auth.saveEntity);
    app.use(route);
};