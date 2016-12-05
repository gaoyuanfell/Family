/**
 * Created by moka on 16-8-15.
 */
'use strict';
let mongoose = require('mongoose');
let WxKeyWord = mongoose.model('WxKeyWord');
let Page = require('../../../modules/base/page');

exports.findList = function (req, res) {
    Page(req.body.pageIndex, req.body.pageSize, WxKeyWord, {}, (err, doc) => {
        if (err)
            res.send({ code: 500, msg: err });
        else
            res.send({ code: 200, doc: doc });
    })
};

exports.findById = function (req, res) {
    WxKeyWord.findById(req.body._id).then(
        (doc) => {
            res.send({ code: 200, doc: doc });
        },
        (err) => {
            res.statusCode = 500;
            res.send({ code: 500, msg: err });
        }
    )
};

exports.findByKey = function (req, res) {
    let reg = new RegExp(req.body.name, 'g');
    WxKeyWord.findOne({ keyword: { $elemMatch: { name: reg } } }).then(
        (doc) => {
            if (doc.keyword) {

            }
            res.send({ code: 200, doc: doc });
        },
        (err) => {
            res.statusCode = 500;
            res.send({ code: 500, msg: err });
        }
    )
};

exports.saveEntity = function (req, res) {
    var wxKeyWord = new WxKeyWord(req.body);
    wxKeyWord.save(req.body).then(
        (doc) => {
            res.send({ code: 200, doc: doc });
        },
        (err) => {
            res.statusCode = 500;
            res.send({ code: 500, msg: err });
        }
    )
};