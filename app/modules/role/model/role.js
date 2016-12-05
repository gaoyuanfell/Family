/**
 * Created by Yuan on 2016/7/19.
 * 角色
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoleSchema = new Schema({
    name: {
        type: String
    },
    authList: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Auth'
        }
    ],
    create_time: {type: Date, default: new Date()},
    update_time: {type: Date, default: new Date()},
    state:{
        type:Number,
        enum:[0,1],
        default:0
    }
});

RoleSchema.statics.findAllAuthById = function (id) {
    return this.findOne({ _id: id })
        .populate('authList').exec();
};

module.exports = function (db) {
    db.model('Role', RoleSchema, 'Role');
};