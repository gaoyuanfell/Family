/**
 * Created by Yuan on 2016/7/17.
 */
'use strict';
let express = require('express');
let weixinPort = require('../controller/weixinPort');

let namespace = '/weixin';

module.exports = function (app) {
    let route = express.Router();
    //接口验证
    route.get(namespace, weixinPort.portVerified);
    //消息转接
    route.post(namespace, weixinPort.forwardNews);

    app.use(route);
};