/**
 * Created by moka on 16-7-29.
 */
'use strict';
let redis = require('redis');
let async = require('async');

module.exports = function (callback) {
    let client = redis.createClient();
    async.parallel({
        init: function (done) {
            client.on("connect", function () {
                done(null, client);
            });
        }
    }, function (err, results) {
        let client = results.init;
        callback(client, redis);
    });
};