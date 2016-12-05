/**
 * Created by Yuan on 2016/7/19.
 */
'use strict';
var mongoose = require("mongoose");
var TagsUser = mongoose.model('TagsUser');
let Page = require('../../base/page');

exports.findList = function (req, res) {
    Page(req.body.pageIndex, req.body.pageSize, TagsUser, { populate: ['tagId', 'userId'] }, (err, doc) => {
        if (err)
            res.send({ code: 500, msg: err });
        else
            res.send({ code: 200, doc: doc });
    })
};

exports.saveEntity = function (req, res) {
    var role = new TagsUser(req.body);
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
/**
 * [findTagUser description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.findTagUser = function (req, res) {
    TagsUser.find({ tagId: req.body.tagId, userId: req.body.userId })
        .populate('User')
        .populate('Tags')
        .then(
        (doc) => {
            res.send({ code: 200, doc: doc });
        },
        (err) => {
            res.statusCode = 500;
            res.send({ code: 500, msg: err });
        }
        )
};
