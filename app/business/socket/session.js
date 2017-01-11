/**
 * Created by moka on 2017/1/10 0010.
 */
/**
 * 全局变量
 */

'use strict';
function Session() {
    this.$session = {};
}
Session.getInstance = function () {
    if(!Session.instance){
        Session.instance = new Session();
    }
    return Session.instance;
};

Session.sessionId = 100;

Session.prototype.createRoom = function (ws,data) {
    let sessionId = ++Session.sessionId;
    this.$session[sessionId] = {
        socket:ws,
        user:data,
        state:0,
        room:sessionId,
        sockets:[]
    }
}

module.exports = Session.getInstance();
