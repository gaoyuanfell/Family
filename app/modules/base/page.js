/**
 * Created by Yuan on 2016/7/26.
 */
"use strict";
let async = require('async');
/**
 * 分页
 * @param page
 * @param pageSize
 * @param Model
 * @param options
 * @param callback
 */
module.exports = function (page, pageSize, Model, options, callback) {
    let populate = options.populate || '';
    let queryParams = options.queryParams || {};
    let sortParams = options.sortParams || {};
    page = page || 1;
    pageSize = pageSize || 5;
    let start = (page - 1) * pageSize;
    let $page = {
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
        let count = results.count;
        $page.pageCount = Math.ceil((count - 1) / pageSize);
        $page.results = results.records;
        callback(err, $page);
    });
};