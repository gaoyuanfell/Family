/**
 * 关键字
 * Created by moka on 16-8-15.
 */
'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let WxKeyWordSchema = new Schema({
    name: {
        type: String
    },
    keyword: [
        {
            name: {
                type: String
            },
            type: {
                type: String,
                enum: [0, 1],
                default: 0
            }
        }
    ],
    type: {
        type: String,
        enum: ['text', 'image', 'voice', 'video', 'news']
    },
    text: [{
        type: String
    }],
    image: [{
        type: String
    }],
    voice: [{
        type: String
    }],
    video: [{
        type: String
    }],
    news: [{
        type: String
    }],
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
    db.model('WxKeyWord', WxKeyWordSchema, 'WxKeyWord');
};