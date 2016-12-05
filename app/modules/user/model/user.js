/**
 * Created by Yuan on 2016/7/17.
 * 用户
 */
'use strict';
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let UserSchema = new Schema({
    user: {
        type: String,
        required: [true, '请填写用户名']
    },
    password: {
        type: String,
        required: [true, '请填写密码']
    },
    userDetailId: {
        type: Schema.Types.ObjectId,
        ref: 'UserDetail'
    },
    organizeId: {
        type: Schema.Types.ObjectId,
        ref: 'Organize'
    },
    companyId: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
    roleId: {
        type: Schema.Types.ObjectId,
        ref: 'Role'
    },
    roleName: String,
    organizeName: String,
    companyName: String,
    type: {
        type: String,
        enum: [0, 1],
        default: 0
    },
    valid: {
        type: Number,
        default: 0
    },
    sort:Number,
    create_time: {type: Date, default: new Date()},
    update_time: {type: Date, default: new Date()},
    state:{
        type:Number,
        enum:[0,1],
        default:0
    }
});

UserSchema.statics.findUsersById = function (id) {
    return this.findOne({ _id: id })
        .populate('userDetailId')
        .populate('organizeId')
        .populate('companyId')
        .populate('roleId')
        .exec();
};

UserSchema.statics.updatePassword = function (body) {
    return this.update({ _id: body._id }, { password: body.password }).exec();
};

UserSchema.statics.errorSend = function (res, err) {
    res.statusCode = 500;
    res.send({ code: 500, msg: err });
};

module.exports = function (db) {
    db.model('User', UserSchema, 'User');
};