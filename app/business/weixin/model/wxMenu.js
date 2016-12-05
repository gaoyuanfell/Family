/**
 * 微信菜单 最多两级
 * Created by moka on 16-8-8.
 */
'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let WxMenuSchema = new Schema({
    name: {
        type: String
    },
    type: {
        type: String

    },
    key: {
        type: String
    },
    url: {
        type: String
    },
    parentId: {
        type: Schema.Types.ObjectId
    },
    countMenu: {
        type: Number,
        default: 0
    }
});

module.exports = function (db) {
    db.model('WxMenu', WxMenuSchema, 'WxMenu');
};