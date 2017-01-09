/**
 * Created by moka on 16-7-18.
 */
"use strict";
var express = require('express'),
    path = require("path"),
    Url = require("url"),
    fs = require('fs'),
    // nwPath = process.execPath,
    // nwDir = path.dirname(nwPath),
    // session = require("express-session"),
    // mongoStore = require('connect-mongo')(session),
    // redisStore = require('connect-redis')(session),
    logger = require('morgan'),
    loggerPath = path.join(__dirname, '../logs'),
    fileStreamRotator = require('file-stream-rotator'),
    bodyParser = require("body-parser"),
    cookieParser = require("cookie-parser"),
    cors = require('cors'),
    config = require("./config"),
    Config = require("../app/config/config"),
    favicon = require('serve-favicon'),
    Redis = require('../app/modules/base/redis');

module.exports = function (db) {
    var app = express();
    app.use(cors());//跨域
    // app.set('showStackError', true);

    //日志记录
    // fs.existsSync(loggerPath) || fs.mkdirSync(loggerPath);
    // var accessLogStream = fileStreamRotator.getStream({
    //     date_format: 'YYYYMMDD',
    //     filename: path.join(loggerPath, 'log-%DATE%.log'),
    //     frequency: 'daily',
    //     verbose: false
    // })
    // var combined = ':remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length]bytes ":referrer" ":user-agent"';
    // app.use(logger(combined, { stream: accessLogStream, skip: function (req, res) { return res.statusCode < 0 } }));

    app.use(bodyParser.json(config.bodyParser.json));// for parsing application/json
    app.use(bodyParser.urlencoded(config.bodyParser.urlencoded));// for parsing application/x-www-form-urlencoded

    // CookieParser should be above session
    app.use(cookieParser());

    //静态文件 // Setting the app router and static folder
    app.use(express.static('public'));
    app.use('/uploads',express.static('uploads'));
    app.use(express.static('www',{index:'login.html'}));
    app.use(favicon('public/favicon/favicon.ico'));

    app.all('*.htm', function (req, res, next) {
        let url = Url.parse(req.originalUrl).pathname;
        let bo = config.whiteUrlList.indexOf(url) != -1;
        let token = req.get(Config.tokenHeaders);
        if(bo){
            Redis((client) => {
                client.get(`${token}`, (err, doc) => {
                    if (doc) {
                        client.expire(`${token}`, Config.sessionTtl);
                        client.quit();
                        if(url == '/user/login.htm'){
                            res.setHeader('Set-Cookie',Config.getCookie(token));
                            res.send({code:200,token:token});
                        }else{
                            next();
                        }
                    } else {
                        next();
                    }
                })
            });
        } else {
            Redis((client) => {
                client.get(`${token}`, (err, doc) => {
                    if (doc) {
                        client.expire(`${token}`, Config.sessionTtl);
                        client.quit();
                        next();
                    } else {
                        res.send({ code: 403 });
                    }
                })
            });
        }
    });

    // Globbing model files
    config.getGlobFiles("./app/modules/**/model/*.js").forEach(function (modelPath) {
        require(path.resolve(modelPath))(db);
    });
    //weixin
    // config.getGlobFiles("./app/business/weixin/model/**.js").forEach(function (modelPath) {
    //     require(path.resolve(modelPath))(db);
    // });

    // Globbing routes files
    config.getGlobFiles("./app/modules/**/route/*.js").forEach(function (modelPath) {
        require(path.resolve(modelPath))(app);
    });

    config.getGlobFiles("./app/modules/base/**Auto.js").forEach(function (modelPath) {
        require(path.resolve(modelPath))(app);
    });

    //weixin
    // config.getGlobFiles("./app/business/weixin/route/**.js").forEach(function (modelPath) {
    //     require(path.resolve(modelPath))(app);
    // });

    return app;
};