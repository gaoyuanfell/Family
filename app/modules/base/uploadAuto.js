/**
 * Created by Yuan on 2016/7/27.
 */
"use strict";
let multer = require('multer');
let uuid = require('uuid');
let fs = require('fs');
let config = require('../../../config/config');
let child_process = require('child_process');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let _date = new Date();
        let _path = `uploads/${_date.getFullYear()}/${_date.getMonth() + 1}/${_date.getDate()}`;
        
        //采用百度 WebUploader 分片上传技术
        let guid = req.body.guid;
        let chunk = req.body.chunk;
        let chunks = req.body.chunks;
        if(chunks){
            _path += `/${guid}`;
            file.chunks = chunks;
        }
        
        let _array = _path.split('/');
        let _p = '';
        _array.forEach((data) => {
            _p += data + '/';
            if (!fs.existsSync(_p)) fs.mkdirSync(_p);
        });
        cb(null, _path)
    },
    filename: function (req, file, cb) {
        //采用百度 WebUploader 分片上传技术
        let chunk = req.body.chunk;
        let chunks = req.body.chunks;
        if(chunks){
            file.filename = chunk + '-' + file.originalname;
        }else{
            file.filename = uuid.v4() + '-' + file.originalname;
        }
        file.host = config.fileUrl;
        cb(null, file.filename)
    }
});

let upload = multer({
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
    let as = fs.createWriteStream(target);
    forEachWrite(0,source,as);
    function forEachWrite(index,array,writeStream){
        let s = fs.createReadStream(array[index]);
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
    let files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            let curPath = path + "/" + file;
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
        let files = req.files;
        files.forEach(function(file,index){
            file.fileUrl = `${file.host}/${file.destination}/${file.filename}`;
        })
        res.send({code: 200, doc: files})
    })

    //上传成功后 将分片的文件合并成一个文件
    app.post('/load/profileCount.htm', function (req, res) {
        let data = req.body;
        let chunks = data.chunks;
        let originalname = data.originalname;
        let destination = data.destination;
        let files = [];
        for(let i = 0; i<chunks; i++){
            files.push(`${destination}/${i}-${originalname}`)
        }
        let target = destination.substr(0,destination.lastIndexOf('/')+1) + `${uuid.v4()}-${originalname}`;
        fileCount(target,files,function(){
            deleteFolderRecursive(destination);
            data.path = target;
            res.send({code: 200,doc:[data]});
        })
    })
};
