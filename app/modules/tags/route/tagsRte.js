/**
 * Created by Yuan on 2016/7/19.
 */
'use strict';
let express = require('express');
var tags = require('../controller/tagsCtrl');

var namespace = '/tags';

module.exports = function (app) {
    let route = express.Router();
    route.post(namespace + "/findList.htm", tags.findList);
    route.post(namespace + "/saveEntity.htm", tags.saveEntity);
    app.use(route);
};