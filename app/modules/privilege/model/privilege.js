'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PrivilegeSchema = new Schema({
    master:{
        type:String
    },
    masterValue:{
        type:Schema.Types.ObjectId  
    },
    access:{
        type:String
    },
    sccessValue:{
        type:Schema.Types.ObjectId
    },
    operation:{
        type:Number,
        enum:[0,1],
        default:0
    },
    sort:{type:Number},
    create_time: {type: Date, default: new Date()},
    update_time: {type: Date, default: new Date()},
    state:{
        type:Number,
        enum:[0,1],
        default:0
    }
})

module.exports = function(db){
    db.model('Privilege',PrivilegeSchema,'Privilege');
}