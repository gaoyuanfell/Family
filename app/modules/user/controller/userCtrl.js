/**
 * Created by Yuan on 2016/7/17.
 */
'use strict';
let mongoose = require("mongoose");
let User = mongoose.model('User');
let UserDetail = mongoose.model('UserDetail');
var Role = mongoose.model('Role');
let Page = require('../../base/page');
let Redis = require('../../base/redis');
let Config = require('../../../config/config');
let Msg = require('../../../../config/massage');
let crypto = require('crypto');
let async = require('async');

exports.findList = function (req, res) {
    Page(req.body.pageIndex, req.body.pageSize, User, {}, (err, doc) => {
        if (err)
            res.send({ code: 500, msg: err });
        else
            res.send({ code: 200, doc: doc });
    })
};

exports.findById = function (req, res) {
    User.findOne(req.body._id).then(
        (doc) => {
            res.send({ code: 200, doc: doc });
        },
        (err) => {
            User.errorSend(res, err);
        }
    )
};

exports.findUsersById = function (req, res) {
    User.findUsersById(req.body._id).then(
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
    User.findOne({user:req.body.user}).then(
        (doc) => {
            if(doc){
                res.send({code:500,doc:doc,msg:Msg.user_add});
            }else{
                addUser();
            }

        }
    );
    function addUser() {
        let _id = new mongoose.Types.ObjectId;
        req.body.userDetailId = _id;
        let user = new User(req.body);
        user.save().then(
            (doc) => {
                let userDetails = new UserDetail({ _id: _id, userId: doc._id });
                userDetails.save().then();
                res.send({ code: 200, doc: doc });
            },
            (err) => {
                res.statusCode = 500;
                res.send({ code: 500, msg: err });
            }
        );
    }
};

exports.updatePassword = function (req, res) {
    User.updatePassword(req.body).then(
        (doc) => {
            res.send({ code: 200, doc: doc });
        },
        (err) => {
            res.statusCode = 500;
            res.send({ code: 500, msg: err });
        }
    )
};

exports.removeEntityById = function (req, res) {
    User.remove({ _id: req.body._id }).then(
        (doc) => {
            removeUserDetail(req.body._id);
            res.send({ code: 200, doc: doc });
        },
        (err) => {
            res.statusCode = 500;
            res.send({ code: 500, msg: err });
        }
    );
    function removeUserDetail(id) {
        UserDetail.remove({ userId: id }).then();
    }
};

exports.login = function (req, res) {
    User.findOne({ user: req.body.user, password: req.body.password }).then(
        (doc) => {
            if (!doc) {
                res.send({ code: 404 });
            } else {
                let md5 = crypto.createHash('md5');
                var sessionId = md5.update(`${doc._id}`).digest('hex');
                res.set(Config.tokenHeaders, sessionId);
                async.series({
                    user: function (done) {
                        User.findUsersById({ _id: doc._id }).then(
                            (doc) => {
                                done(null, doc);
                            },
                            (err) => {
                                done(err);
                            }
                        )
                    },
                    auth: function (done) {
                        Role.findAllAuthById({ _id: doc.roleId }).then(
                            (doc) => {
                                done(null, doc);
                            },
                            (err) => {
                                done(err);
                            }
                        )
                    }
                }, function (err, result) {
                    var _session = { user: result.user, authList: result.auth };
                    Redis((client) => {
                        client.set(`${sessionId}`, JSON.stringify(_session));
                        client.expire(`${sessionId}`, Config.sessionTtl);
                        client.quit();
                        res.send({ code: 200, doc: doc, token: sessionId });
                    });
                });
            }
        },
        (err) => {
            res.statusCode = 500;
            res.send({ code: 500, msg: err });
        }
    )
};

exports.loginOut = function (req, res) {
    let token = req.get('express-token-key');
    Redis((client) => {
        client.del(`${token}`);
        client.quit();
        res.send({ code: 200 });
    });
};