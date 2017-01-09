/**
 * Created by Yuan on 2016/7/19.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CompanySchema = new Schema({
    name: {
        type: String
    },
    rul:{
        type:String
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
    db.model('Company', CompanySchema, 'Company');
};