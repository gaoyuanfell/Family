var WebSocket = require('ws');
var https = require('https');
var fs = require('fs');
var url = require('url');
var port = 8089;

var processRequest = function(req, res) {
    fs.readFile(__dirname + '/www/socket.html',function(err,data){
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

var server = https.createServer({
    key: fs.readFileSync('./public/https/ca.key'),
    cert: fs.readFileSync('./public/https/ca.crt')
},processRequest).listen(port)

// var server = https.createServer(processRequest).listen(port)

var WebSocketServer  = WebSocket.Server;

var wss = new WebSocketServer({ server: server })

const session = {};

wss.broadcast = function broadcast(data) {
    var ws = session[data.toName];
    if(ws){
        ws.send(JSON.stringify(data))
    }
};

wss.on('connection', function connection(ws,data) {
    ws.on('message', function (message) {
        var data = JSON.parse(message);
        if(!session[data.name]){
            session[data.name] = this;
        }
        if(data.toName && !session[data.toName]){
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

// module.exports = function () {
    
// }