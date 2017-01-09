/**
 * 菜单
 */
'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let MenuSchema = new Schema({
    name:{
        type:String
    },
    url:{
        type:String
    },
    icon:{
        type:String
    },
    sort:{
        type:Number
    },
    parentId:{
        type:Schema.Types.ObjectId
    },
    create_time: {type: Date, default: new Date()},
    update_time: {type: Date, default: new Date()},
    state:{
        type:Number,
        enum:[0,1],
        default:0
    }
})

module.exports = function (db) {
    db.model('Menu', MenuSchema,'Menu');
};