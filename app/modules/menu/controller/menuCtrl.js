'use strict';
let mongoose = require('mongoose');
let Menu = mongoose.model('Menu');
let Page = require('../../base/page');

exports.findList = function (req, res) {
    Page(req.body.pageIndex,req.body.pageSize,Menu,{},(err,doc) => {
        if (err)
            res.send({code: 500, msg: err});
        else
            res.send({code: 200, doc: doc});
    })
};

exports.saveEntity = function(req, res){
    let menu =  new Menu(req.body);
    menu.save().then(
        (doc) => {
            res.send({ code: 200, doc: doc });
        },
        (err) => {
            res.statusCode = 500;
            res.send({ code: 500, msg: err });
        }
    )
}
