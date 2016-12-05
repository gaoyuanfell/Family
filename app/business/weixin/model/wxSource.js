/**
 * Created by moka on 16-8-18.
 */
'use strict';
let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let WxSourceSchema = new Schema({
    title: {
        type: String
    },
    url: {
        type: String
    },
    type: {
        type: String,
        enum: [1, 2, 3],
        default: 1
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    companyId: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
    create_time: { type: Date, default: new Date() },
    update_time: { type: Date, default: new Date() }
});

module.exports = function (db) {
    db.model('WxSource', WxSourceSchema, 'WxSource');
};