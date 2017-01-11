/**
 * Created by moka on 2017/1/9.
 */

const processRequest = function(req, res) {
    fs.readFile(__dirname + '/socket.html',function(err,data){
        if(err){
            if (err) {
                res.writeHead(500);
                return res.end('Error loading socket.html');
            }
        }
        res.setHeader('Content-Type', 'text/html');
        res.writeHead(200);
        res.end(data);
    })
};

const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');
const session = require('./session');

module.exports = function (port) {
    let server = https.createServer({
        key: fs.readFileSync('./public/https/ca.key'),
        cert: fs.readFileSync('./public/https/ca.crt')
    },processRequest).listen(port);

    // let server = https.createServer(processRequest).listen(port)

    let WebSocketServer  = WebSocket.Server;

    let wss = new WebSocketServer({ server: server });

    /**
     * 用户信息 socket信息
     * 第一步：任务开始，建立socket回话，拟定编号。state 0 可以进入房间，1 不能进入房间。
     * 第二步：发布任务，建立socket回话，用户已编号进入任务房间，作为发布任务人的子集。
     * 第三步：任务开始，将内存的数据存入数据库。
     * @type {{}}
     */
    const $session = {};

    let $room = 100;//房间号

    wss.broadcast = function broadcast(data) {
        let ws = $session[data.toName];
        if(ws){
            ws.send(JSON.stringify(data))
        }
    };

    wss.on('connection', function connection(ws) {
        /**
         * type：1 创建房间 2：进入房间
         */
        ws.on('message', function (message) {
            let data = JSON.parse(message);
            console.info(data);
            let room = data.$room;
            let type = data.type;

            switch (+type){
                case 1:
                    if(!room){
                        let _room= ++$room;
                        let $session_room = $session[_room] = {
                            socket:this,
                            user:{
                                name:data.name
                            },
                            openid:data.name,
                            state:0,
                            room:_room,
                            sockets:[]
                        };
                        this.send(JSON.stringify({
                            name:'系统',
                            msg:'房间创建成功【'+ _room +'】',
                            type:1,
                            room:_room
                        }))

                        // $session_room.keepAlive = function () {
                        //     setTimeout(function () {
                        //
                        //     },60)
                        // }
                        // let keepAlive = 1; // 开启keepalive属性
                        // let keepIdle = 60; // 如该连接在60秒内没有任何数据往来,则进行探测
                        // let keepInterval = 5; // 探测时发包的时间间隔为5 秒
                        // let keepCount = 3; // 探测尝试的次数.如果第1次探测包就收到响应了,则后2次的不再发.
                    }
                    break;
                case 2:
                    if(room && $session[room]){
                        $session[room].sockets.push({
                            socket:this,
                            openid:data.name,
                            user:{
                                name:data.name
                            },
                        });
                        $session[room].socket.send(JSON.stringify({
                            name:'系统',
                            msg:'成功进入房间',
                            // sockets:$session[room].sockets.map(function (da) {
                            //     return da.user;
                            // }),
                            sockets:{
                                name:data.name
                            },
                            type:2
                        }))
                    }
                    break;
                case 3:
                    let name = data.name;
                    let sockets = $session[room].sockets;
                    if(name instanceof Array){
                        sockets.forEach(function (da) {
                            if(name.indexOf(da.openid) != -1){
                                da.socket.send(JSON.stringify({
                                    name:da.openid,
                                    msg:data.msg,
                                    type:3
                                }))
                            }
                        })
                    }else{
                        sockets.forEach(function (da) {
                            if(name === da.openid){
                                da.socket.send(JSON.stringify({
                                    name:da.openid,
                                    msg:data.msg,
                                    type:3
                                }))
                            }
                        })
                    }
                    break;
            }

            // let room = data.$room;
            // if(room){
            //     $session[room] = {
            //         socket:this,
            //         name:data.name,
            //         room:room,
            //     }
            // }

            // if(!$session[data.name]){
            //     $session[data.name] = this;
            // }
            // if(data.toName && !$session[data.toName]){
            //     data.msg = '此用户不在线';
            //     data.name = '系统';
            //     delete data.toName;
            //     this.send(JSON.stringify(data));
            // }else{
            //     wss.broadcast(data);
            // }
        });
        ws.send(JSON.stringify({name:'系统',msg:'你是第' + wss.clients.length + '位',type:3}));
    });
}