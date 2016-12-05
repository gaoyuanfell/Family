/**
 * Created by Yuan on 2016/7/26.
 */
"use strict";
var async = require('async');
/**
 * 分页
 * @param page
 * @param pageSize
 * @param Model
 * @param options
 * @param callback
 */
module.exports = function (page, pageSize, Model, options, callback) {
    var populate = options.populate || '';
    var queryParams = options.queryParams || {};
    var sortParams = options.sortParams || {};
    page = page || 1;
    pageSize = pageSize || 5;
    var start = (page - 1) * pageSize;
    var $page = {
        pageIndex: page,
        pageSize: pageSize
    };
    async.parallel({
        count: function (done) {  // 查询数量
            Model.count(queryParams).exec(function (err, count) {
                done(err, count);
            });
        },
        records: function (done) {   // 查询一页的记录
            Model.find(queryParams).skip(+start).limit(+pageSize).populate(populate).sort(sortParams).exec(function (err, doc) {
                done(err, doc);
            });
        }
    }, function (err, results) {
        var count = results.count;
        $page.pageCount = Math.ceil((count - 1) / pageSize);
        $page.results = results.records;
        callback(err, $page);
    });
};