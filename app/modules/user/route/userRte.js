/**
 * Created by Yuan on 2016/7/17.
 */
"use strict";
let express = require('express');
let User = require("../controller/userCtrl");

let namespace = '/user';

module.exports = function (app) {
    let route = express.Router();
    route.post(namespace + "/login.htm", User.login);
    route.get(namespace + "/loginOut.htm", User.loginOut);
    route.post(namespace + "/findList.htm", User.findList);
    route.post(namespace + "/findById.htm", User.findById);
    route.post(namespace + "/findUsersById.htm", User.findUsersById);
    route.post(namespace + "/updatePassword.htm", User.updatePassword);
    route.post(namespace + "/saveEntity.htm", User.saveEntity);
    route.post(namespace + "/removeEntityById.htm", User.removeEntityById);
    app.use(route);
};