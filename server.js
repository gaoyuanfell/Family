/**
 * Created by moka on 16-7-18.
 */
"use strict";
const [express,config,mongoose,socket] = [
    require("./config/express"),
    require("./config/config"),
    require("mongoose"),
    require("./app/business/socket/socket")
]

mongoose.set('debug', true);
let options = {};
let db = mongoose.connect(config.url,options).connection;

db.once('open',function () {
    let app = express(db);
    
    socket(81);
    app.listen(config.port);

    console.log('MEAN.JS application started on port ' + config.port);
    //Assume 500 since no middleware responded
    app.use(function (err, req, res, next) {
        // if (!err.stack) return next();
        res.statusCode = 500;
        res.send({
            status: 500,
            url: req.originalUrl,
            error: err.stack
        })
    });

    // Assume 404 since no middleware responded
    app.use(function (req, res) {
        res.statusCode = 404;
        res.send({
            status: 404,
            url: req.originalUrl
        })
    });
});