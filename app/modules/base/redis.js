/**
 * Created by moka on 16-7-29.
 */
'use strict';
var redis = require('redis');
var async = require('async');

module.exports = function (callback) {
    var client = redis.createClient();
    async.parallel({
        init: function (done) {
            client.on("connect", function () {
                done(null, client);
            });
        }
    }, function (err, results) {
        var client = results.init;
        callback(client, redis);
    });
};