/**
 * Created by Yuan on 2016/7/17.
 */
'use strict';
let express = require('express');
let wxNewsCtrl = require('../controller/wxNewsCtrl');

let namespace = '/weixin/news';

module.exports = function (app) {
    let route = express.Router();
    //保存图文
    route.post(namespace + '/saveEntity.htm', wxNewsCtrl.saveEntity);
    //图文列表
    route.post(namespace + "/findList.htm", wxNewsCtrl.findList);
    //图文
    route.post(namespace + "/findById.htm", wxNewsCtrl.findById);

    app.use(route);
};