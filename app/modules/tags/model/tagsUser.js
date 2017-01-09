/**
 * Created by Yuan on 2016/7/19.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let TagsSchema = new Schema({
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
