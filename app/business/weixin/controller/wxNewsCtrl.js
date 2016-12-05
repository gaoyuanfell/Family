/**
 * Created by moka on 2016/8/14.
 */
'use strict';
let mongoose = require('mongoose');
let WxNews = mongoose.model('WxNews');
let Page = require('../../../modules/base/page');

exports.findList = function (req, res) {
    Page(req.body.pageIndex, req.body.pageSize, WxNews, {}, (err, doc) => {
        if (err)
            res.send({ code: 500, msg: err });
        else
            res.send({ code: 200, doc: doc });
    })
};

exports.findById = function (req, res) {
    WxNews.findOne({ _id: req.body._id }).then(
        (doc) => {
            res.send({ code: 200, doc: doc });
        },
        (err) => {
            res.statusCode = 500;
            res.send({ code: 500, msg: err });
        }
    )
};

exports.saveEntity = function (req, res) {
    var wxNews = new WxNews(req.body);
    if (wxNews.articles && (wxNews.articles.length > 10 || 　wxNews.articles.length == 0)) {
        res.send({ code: 500, msg: '图文消息个数，限制为1 - 10条以内' });
    } else {
        wxNews.save(req.body).then(
            (doc) => {
                res.send({ code: 200, doc: doc });
            },
            (err) => {
                res.statusCode = 500;
                res.send({ code: 500, msg: err });
            }
        )
    }
};