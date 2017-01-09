/**
 * Created by Yuan on 2016/7/19.
 */
'use strict';
let mongoose = require("mongoose");
let Company = mongoose.model('Company');

let Page = require('../../base/page');

exports.findList = function (req, res) {
    Page(req.body.pageIndex, req.body.pageSize, Company, {}, (err, doc) => {
        if (err)
            res.send({ code: 500, msg: err });
        else
            res.send({ code: 200, doc: doc });
    })
};

exports.findAll = function (req, res) {
    Company.find().then(
        (doc) => {
            res.send({ code: 200, doc: doc })
        },
        (err) => {
            res.statusCode = 500;
            res.send({ code: 500, msg: err });
        }
    )
};

exports.saveEntity = function (req, res) {
    let company = new Company(req.body);
    company.save(req.body).then(
        (doc) => {
            res.send({ code: 200, doc: doc });
        },
        (err) => {
            res.statusCode = 500;
            res.send({ code: 500, msg: err });
        }
    )
};