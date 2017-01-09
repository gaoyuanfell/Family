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

module.exports = function (port) {
    let server = https.createServer({
        key: fs.readFileSync('./public/https/ca.key'),
        cert: fs.readFileSync('./public/https/ca.crt')
    },processRequest).listen(port)

    // let server = https.createServer(processRequest).listen(port)

    let WebSocketServer  = WebSocket.Server;

    let wss = new WebSocketServer({ server: server })

    /**
     * 用户信息 socket信息
     * 第一步：任务开始，建立socket回话，拟定编号。
     * 第二步：发布任务，建立socket回话，用户已编号进入任务房间，作为发布任务人的子集。
     * 第三步：任务开始，将内存的数据存入数据库。
     * @type {{}}
     */
    const $session = {};

    const $room = 100;//房间号

    wss.broadcast = function broadcast(data) {
        let ws = $session[data.toName];
        if(ws){
            ws.send(JSON.stringify(data))
        }
    };

    wss.on('connection', function connection(ws) {
        ws.on('message', function (message) {
            console.info(ws === this);
            let data = JSON.parse(message);
            // let room = data.$room;
            // if(room){
            //     $session[room] = {
            //         socket:this,
            //         name:data.name,
            //         room:room,
            //     }
            // }

            if(!$session[data.name]){
                $session[data.name] = this;
            }
            if(data.toName && !$session[data.toName]){
                data.msg = '此用户不在线';
                data.name = '系统';
                delete data.toName;
                this.send(JSON.stringify(data));
            }else{
                wss.broadcast(data);
            }
        });
        ws.send(JSON.stringify({name:'系统',msg:'你是第' + wss.clients.length + '位'}));
    });
}