/**
 * Created by Yuan on 2016/7/19.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TagsSchema = new Schema({
    tagId:{
        type:Schema.Types.ObjectId,
        ref:'Tags',
        required:[true]
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:[true]
    }
});

module.exports = function (db) {
    db.model('TagsUser', TagsSchema,'TagsUser');
};
