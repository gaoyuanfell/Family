'use strict';
let mongoose = require('mongoose');
let Privilege = mongoose.model('Privilege');
let Page = require('../../base/page');

exports.findList = function (req, res) {
    Page(req.body.pageIndex,req.body.pageSize,Privilege,{},(err,doc) => {
        if (err)
            res.send({code: 500, msg: err});
        else
            res.send({code: 200, doc: doc});
    })
};