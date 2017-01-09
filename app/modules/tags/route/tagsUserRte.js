/**
 * Created by Yuan on 2016/7/19.
 */
'use strict';
let express = require('express');
let tagsUser = require('../controller/tagsUserCtrl');

let namespace = '/tagsUser';

module.exports = function (app) {
    let route = express.Router();
    route.post(namespace + "/findList.htm",tagsUser.findList);
    route.post(namespace + "/saveEntity.htm",tagsUser.saveEntity);
    route.post(namespace + "/findTagUser.htm",tagsUser.findTagUser);
    app.use(route);
};