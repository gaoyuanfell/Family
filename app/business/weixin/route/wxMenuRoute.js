/**
 * Created by Yuan on 2016/7/17.
 */
'use strict';
let express = require('express');
let wxMenuCtrl = require('../controller/wxMenuCtrl');

let namespace = '/weixin/menu';

module.exports = function (app) {
    let route = express.Router();
    //保存微信菜单
    route.post(namespace + '/saveMenuEntity.htm', wxMenuCtrl.saveMenuEntity);
    //发布微信菜单
    route.get(namespace + '/releaseMenu.htm', wxMenuCtrl.releaseMenu);

    app.use(route);
};