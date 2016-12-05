/**
 * Created by Yuan on 2016/7/17.
 */
"use strict";
let express = require('express');
var UserDetail = require("../controller/userDetailCtrl");

var namespace = '/userDetail';

module.exports = function (app) {
    let route = express.Router();
    route.post(namespace + "/findList.htm", UserDetail.findList);
    route.post(namespace + "/findById.htm", UserDetail.findById);
    app.use(route);
};