const morgan = require("morgan");
var fs = require('fs')
var path = require('path')

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
var accessLogErrorStream = fs.createWriteStream(path.join(__dirname, 'accessError.log'), { flags: 'a' })

const setupLogging = (app) => {
    app.use(morgan('combined', { stream: accessLogStream, skip: function (req, res) { return res.statusCode > 400 } }));
    app.use(morgan('combined', { stream: accessLogErrorStream, skip: function (req, res) { return res.statusCode < 400 } }));
}

exports.setupLogging = setupLogging;