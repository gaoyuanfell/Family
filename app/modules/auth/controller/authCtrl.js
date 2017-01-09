/**
 * Created by Yuan on 2016/7/19.
 */
'use strict';
let mongoose = require("mongoose");
let Auth = mongoose.model('Auth');
let Page = require('../../base/page');

exports.findList = function (req, res) {
    Page(req.body.pageIndex, req.body.pageSize, Auth, {}, (err, doc) => {
        if (err)
            res.send({ code: 500, msg: err });
        else
            res.send({ code: 200, doc: doc });
    })
};

exports.saveEntity = function (req, res) {
    let auth = new Auth(req.body);
    auth.save(req.body).then(
        (doc) => {
            res.send({ code: 200, doc: doc });
        },
        (err) => {
            res.statusCode = 500;
            res.send({ code: 500, msg: err });
        }
    )
};