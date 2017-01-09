/**
 * Created by Yuan on 2016/7/19.
 */
'use strict';
let mongoose = require("mongoose");
let Tags = mongoose.model('Tags');
let TagsUser = mongoose.model('TagsUser');
let Page = require('../../base/page');

exports.findList = function (req, res) {
    Page(req.body.pageIndex, req.body.pageSize, Tags, {}, (err, doc) => {
        if (err)
            res.send({ code: 500, msg: err });
        else
            res.send({ code: 200, doc: doc });
    })
};

exports.saveEntity = function (req, res) {
    let role = new Tags(req.body);
    role.save(req.body).then(
        (doc) => {
            res.send({ code: 200, doc: doc });
        },
        (err) => {
            res.statusCode = 500;
            res.send({ code: 500, msg: err });
        }
    )
};