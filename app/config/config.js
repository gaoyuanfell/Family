/**
 * Created by moka on 16-7-29.
 */
module.exports = {
    tokenHeaders: 'express-token-key',
    sessionTtl: 30 * 60, //m
    getCookie:function(value,name,time){
        name = name || this.tokenHeaders;
        time = time || this.sessionTtl * 1000;
        let nowDate = new Date(time);
        return `${name}=${value}; path=/; expires=${nowDate.toGMTString()};`
    }
};