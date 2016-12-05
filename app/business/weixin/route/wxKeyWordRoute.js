/**
 * Created by moka on 16-8-15.
 */
'use strict';
let express = require('express');
let wxKeyWordCtrl = require('../controller/wxKeyWordCtrl');

let namespace = '/weixin/keyword';

module.exports = function (app) {
    let route = express.Router();

    route.post(namespace + '/saveEntity.htm', wxKeyWordCtrl.saveEntity);

    route.post(namespace + "/findList.htm", wxKeyWordCtrl.findList);

    route.post(namespace + "/findById.htm", wxKeyWordCtrl.findById);

    route.post(namespace + "/findByKey.htm", wxKeyWordCtrl.findByKey);

    app.use(route)
};