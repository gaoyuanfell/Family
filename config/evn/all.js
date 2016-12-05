/**
 * Created by moka on 16-7-18.
 */
"use strict";

module.exports = {
    baseUrl:'//127.0.0.1',
    fileUrl:'//127.0.0.1',
    url:'mongodb://127.0.0.1/moka',
    port: 80,
    bodyParser: {
        json: { limit: '150kb' },
        urlencoded: { extended: true }
    },
    mongoStore: {
        url: 'mongodb://127.0.0.1/session',
        collection: 'Sessions'
    },
    redisStore: {
        host: "127.0.0.1",
        port: 6379,
        db: 0,
        ttl: 20,
        prefix: 'moka'
    },
    //请求白名单
    whiteUrlList: [
        '/user/login.htm',
        '/weixin',
        '/load/profile.htm'
    ]
};
