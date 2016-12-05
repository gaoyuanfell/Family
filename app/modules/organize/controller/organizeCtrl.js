/**
 * Created by Yuan on 2016/7/19.
 */
'use strict';
var mongoose = require("mongoose");
var Organize = mongoose.model('Organize');
var Page = require('../../base/page');
var Msg = require('../../../../config/massage')

exports.findList = function (req, res) {
    Page(req.body.pageIndex, req.body.pageSize, Organize, {}, (err, doc) => {
        if (err)
            res.send({ code: 500, msg: err });
        else
            res.send({ code: 200, doc: doc });
    })
};

exports.saveEntity = function (req, res) {
    var organize = new Organize(req.body);
    organize.save().then(
        (doc) => {
            res.send({ code: 200, doc: doc });
        },
        (err) => {
            res.statusCode = 500;
            res.send({ code: 500, msg: err });
        }
    )
};

exports.findById = function (req, res) {
    Organize.findOne({ _id: req.body._id }).then(
        (doc) => {
            res.send({ code: 200, doc: doc })
        },
        (err) => {
            res.statusCode = 500;
            res.send({ code: 500, msg: err });
        }
    )
};

exports.findAll = function (req, res) {
    Organize.find().then(
        (doc) => {
            res.send({ code: 200, doc: doc })
        },
        (err) => {
            res.statusCode = 500;
            res.send({ code: 500, msg: err });
        }
    )
};

/**
 * 获取父级下所有的子集
 */
exports.findNextAllById = function (req, res) {
    Organize.findOne({_id:req.body._id}).then(
        (doc) =>{
            if(!doc) res.send({code:200,msg:Msg.not_data});
            Organize.find({parentId:doc._id}).then(
                (arr) =>{
                    if(arr.length > 0){
                        doc.parentList = arr;
                        callback(doc, doc.parentList, 0, (data) => {
                            res.send({ code: 200, doc: data });
                        });
                    } else {
                        res.send({ code: 200, doc: doc });
                    }
                }
            );
        },
        (err) => {
            res.statusCode = 500;
            res.send({ code: 500, msg: err });
        }
    );

    /**
     * 获取子集所有的数据
     * @param doc
     * @param array
     * @param num
     * @param back
     */
    function callback(doc, array, num, back) {
        if (!num) {
            num = 0;
        }
        var arr = [];
        array.forEach((data) => {
            arr.push(Organize.find({ parentId: data._id }));
        });
        Promise.all(arr).then(
            (arr) => {
                num += arr.length;
                for (var i = 0, j = arr.length; i < j; i++) {
                    var data = arr[i];
                    if (data.length > 0) {
                        array[i].parentList = data;
                        callback(doc, array[i].parentList, --num, back);
                    } else {
                        --num;
                        num == 0 && back(doc);
                        console.info(num);
                    }
                }
            }
        );
    }
};