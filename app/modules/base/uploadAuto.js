/**
 * Created by Yuan on 2016/7/27.
 */
"use strict";
var multer = require('multer');
var uuid = require('uuid');
var fs = require('fs');
var config = require('../../../config/config');
var child_process = require('child_process');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var _date = new Date();
        var _path = `uploads/${_date.getFullYear()}/${_date.getMonth() + 1}/${_date.getDate()}`;
        
        //采用百度 WebUploader 分片上传技术
        var guid = req.body.guid;
        var chunk = req.body.chunk;
        var chunks = req.body.chunks;
        if(chunks){
            _path += `/${guid}`;
            file.chunks = chunks;
        }
        
        var _array = _path.split('/');
        var _p = '';
        _array.forEach((data) => {
            _p += data + '/';
            if (!fs.existsSync(_p)) fs.mkdirSync(_p);
        });
        
        cb(null, _path)
    },
    filename: function (req, file, cb) {
        //采用百度 WebUploader 分片上传技术
        var chunk = req.body.chunk;
        var chunks = req.body.chunks;
        if(chunks){
            file.filename = chunk + '-' + file.originalname;
        }else{
            file.filename = uuid.v4() + '-' + file.originalname;
        }
        file.host = config.fileUrl;
        cb(null, file.filename)
    }
});

var upload = multer({
    storage: storage,
    limits: {

    },
    fileFilter: function (req, file, cb) {
        cb(null, true)
    }
});

/**
 * 文件合并 依赖 node fs模块
 * @param {String} target 目标文件
 * @param {Array or String} source 源文件 可多个地址
 */
function fileCount(target,source,callback){
    var as = fs.createWriteStream(target);
    forEachWrite(0,source,as);
    function forEachWrite(index,array,writeStream){
        var s = fs.createReadStream(array[index]);
        s.on('data',function(chunk){
            writeStream.write(chunk);
        });
        s.on('error',function(){
            callback && callback()
        })
        s.on('end',function(){
            if(index < array.length-1){
                forEachWrite(++index,array,writeStream);
            }else{
                callback && callback()
            }
        })
    }
}

//删除文件夹下的所有文件或文件夹
function deleteFolderRecursive(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

module.exports = function (app) {
    //文件上传
    app.post('/load/profile.htm', upload.any(), function (req, res) {
        var files = req.files;
        res.send({code: 200, doc: files})
    })

    //上传成功后 将分片的文件合并成一个文件
    app.post('/load/profileCount.htm', function (req, res) {
        var data = req.body;
        var chunks = data.chunks;
        var originalname = data.originalname;
        var destination = data.destination;
        var files = [];
        for(var i = 0; i<chunks; i++){
            files.push(`${destination}/${i}-${originalname}`)
        }
        var target = destination.substr(0,destination.lastIndexOf('/')+1) + `${uuid.v4()}-${originalname}`;
        fileCount(target,files,function(){
            deleteFolderRecursive(destination);
            data.path = target;
            res.send({code: 200,doc:[data]});
        })
    })
};
