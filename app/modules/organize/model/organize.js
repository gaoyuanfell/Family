/**
 * Created by Yuan on 2016/7/19.
 * 机构
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrganizeSchema = new Schema({
    name: {
        type: String
    },
    agencyNumber:{
        type:String
    },
    parentId: Schema.Types.ObjectId,
    parentList:Array,
    sort:{
        type:Number
    },
    create_time: {type: Date, default: new Date()},
    update_time: {type: Date, default: new Date()},
    state:{
        type:Number,
        enum:[0,1],
        default:0
    }
});

module.exports = function (db) {
    db.model('Organize', OrganizeSchema, 'Organize');
};
