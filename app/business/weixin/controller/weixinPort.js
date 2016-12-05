/**
 * Created by moka on 16-8-9.
 */
'use strict';
let mongoose = require('mongoose');
let WxNews = mongoose.model('WxNews');
let WxKeyWord = mongoose.model('WxKeyWord');
let User = mongoose.model('User');
let crypto = require('crypto');
let config = require('../config');
let https = require('https');
let xml2js = require('xml2js');
let async = require('async');
/**
 * 获取与微信接口回话的凭证
 */
!function () {
    function getAccessToken(done) {
        let url = `https://${config.url}/cgi-bin/token?grant_type=client_credential&appid=${config.appID}&secret=${config.appsecret}`;
        let data = '';
        let req = https.request(url, (res) => {
            res.on('data', (d) => {
                data += d;
            });
            res.on('end', () => {
                console.info(data);
                done(data);
            })
        });
        req.on('error', (e) => {
            console.error(e);
        });
        req.end();
    }

    /*    getAccessToken((data) => {
            if(data){
                config.access_token = JSON.parse(data).access_token;
            }
        });*/
    setInterval(function () {
        console.info(config.access_token);
        getAccessToken((data) => {
            if (data) {
                config.access_token = JSON.parse(data).access_token;
            }
        });
    }, 60 * 1000 * 30);
} ();

/**
 * 微信接口验证
 * @param req
 * @param res
 */
exports.portVerified = function (req, res) {
    let token = config.token;
    let signature = req.query.signature;
    let timestamp = req.query.timestamp;
    let nonce = req.query.nonce;
    let echostr = req.query.echostr;

    console.info(req.query);

    let str = Array.of(token, timestamp, nonce).sort().join('');
    let sha1 = crypto.createHash('sha1');
    let sha1Str = sha1.update(str).digest('hex');

    console.info(sha1Str == signature);
    if (sha1Str == signature) {
        res.send(echostr);
    } else {
        res.send(false);
    }
};

//消息回复类型
let switchMasType = {
    text: msgTypeText,
    image: msgTypeImage,
    voice: msgTypeVoice,
    shortvideo: msgTypeVideo,
    video: msgTypeVideo,
    music: '',
    news: msgTypeNews,
    event: msgTypeEvent,
    location: msgTypeLocation
};

exports.forwardNews = function (req, res) {
    let xml = '';
    req.on('data', (data) => {
        xml += data
    });
    req.once('end', () => {
        xml2js.parseString(xml, { explicitArray: false }, (err, result) => {
            if (err) {
                res.send({ code: 500, msg: err })
            } else {
                //查找是否关键字
                async.series({
                    keyWord: function (done) {
                        let reg = new RegExp(result.xml.Content, 'g');
                        WxKeyWord.findOne({ keyword: { $elemMatch: { name: reg } } }).then(
                            (doc) => {
                                done(null, doc);
                            },
                            (err) => {
                                done(err);
                            }
                        )
                    }
                }, function (err, data) {
                    if (!data.keyWord) {
                        res.send('success');
                    } else {
                        switchMasType[data.keyWord.type](result, data.keyWord, function (data) {
                            res.send(data);
                        })
                    }
                });
            }
        })
    });
};


let materialType = {
    'text': textMaterial,
    'image': imageMaterial,
    'voice': voiceMaterial,
    'video': videoMaterial,
    'news': newsMaterial
};

function textMaterial() {

}

function imageMaterial() {

}

function voiceMaterial() {

}

function videoMaterial() {

}

function newsMaterial(result, params, done) {
    let builder = new xml2js.Builder({ rootName: 'xml', xmldec: {}, cdata: true, headless: true });
    result.xml.MsgType = params.type;
    WxNews.findOne({ _id: params[params.type][0] }).then(
        (doc) => {
            result.xml.ArticleCount = doc.articles.length;
            let article = result.xml.Articles = { item: [] };
            doc.articles.forEach((data) => {
                article.item.push({
                    Title: data.title,
                    Description: data.description,
                    PicUrl: data.picUrl,
                    Url: data.url
                })
            });
            let xmlBuffer = builder.buildObject(result.xml);
            done && done(xmlBuffer);
        },
        (err) => {
            console.info(err)
        }
    );
}

function msgTypeNews(result, params, done) {
    let FromUserName = result.xml.FromUserName;
    result.xml.FromUserName = result.xml.ToUserName;
    result.xml.ToUserName = FromUserName;
    materialType[params.type](result, params, function (data) {
        done(data)
    });
    return true;
}

function msgTypeText(result, done) {
    let builder = new xml2js.Builder({ rootName: 'xml', xmldec: {}, cdata: true, headless: true });
    let FromUserName = result.xml.FromUserName;
    result.xml.FromUserName = result.xml.ToUserName;
    result.xml.ToUserName = FromUserName;
    let xmlBuffer = builder.buildObject(result.xml);
    done && done(xmlBuffer);
    return true;
}

function msgTypeImage(result, done) {
    let builder = new xml2js.Builder({ rootName: 'xml', xmldec: {}, cdata: true, headless: true });
    let FromUserName = result.xml.FromUserName;
    result.xml.FromUserName = result.xml.ToUserName;
    result.xml.ToUserName = FromUserName;
    result.xml.Image = {
        MediaId: result.xml.MediaId
    };
    let xmlBuffer = builder.buildObject(result.xml);
    done && done(xmlBuffer);
    return true;
}

function msgTypeVoice(result, done) {
    let builder = new xml2js.Builder({ rootName: 'xml', xmldec: {}, cdata: true, headless: true });
    let FromUserName = result.xml.FromUserName;
    result.xml.FromUserName = result.xml.ToUserName;
    result.xml.ToUserName = FromUserName;
    result.xml.Voice = {
        MediaId: result.xml.MediaId
    };
    let xmlBuffer = builder.buildObject(result.xml);
    done && done(xmlBuffer);
    return true;
}

function msgTypeVideo(result, done) {
    let builder = new xml2js.Builder({ rootName: 'xml', xmldec: {}, cdata: true, headless: true });
    let FromUserName = result.xml.FromUserName;
    result.xml.FromUserName = result.xml.ToUserName;
    result.xml.ToUserName = FromUserName;
    result.xml.MsgType = 'video';
    result.xml.Video = {
        MediaId: result.xml.MediaId,
        Title: '测试',
        Description: '测试测试测试，重要的事情需要说三遍'
    };
    let xmlBuffer = builder.buildObject(result.xml);
    done && done(xmlBuffer);
    return true;
}

function msgTypeLocation(result, done) {
    console.info(result);
    done && done('success');
    // let builder = new xml2js.Builder({rootName:'xml',xmldec:{},cdata:true,headless:true});
    // let FromUserName = result.xml.FromUserName;
    // result.xml.FromUserName = result.xml.ToUserName;
    // result.xml.ToUserName = FromUserName;
    // result.xml.MsgType = 'text';
    // result.xml.Content = '谢谢你的关注！';
    // let xmlBuffer = builder.buildObject(result.xml);
    // done && done(xmlBuffer);
    return true;
}

function msgTypeEvent(result, done) {
    switch (result.xml.Event) {
        case 'unsubscribe':
            done && done('success');
            break;
        case 'subscribe':
            let builder = new xml2js.Builder({ rootName: 'xml', xmldec: {}, cdata: true, headless: true });
            let FromUserName = result.xml.FromUserName;
            result.xml.FromUserName = result.xml.ToUserName;
            result.xml.ToUserName = FromUserName;
            result.xml.MsgType = 'text';
            result.xml.Content = '谢谢你的关注！';
            let xmlBuffer = builder.buildObject(result.xml);
            done && done(xmlBuffer);
            break;
        case 'LOCATION':
            console.info(result);
            done && done('success');
            break;
    }
    return true;
}