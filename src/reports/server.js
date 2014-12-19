'use strict';

var express = require('express');
var path = require('path');

module.exports = function (data, reportOptions) {
    var app = express();
    app.use(express.static(path.join(__dirname, 'server')));
    app.get('/data', function (req, res, next) {
        res.json(data);
    });
    app.listen(reportOptions.serverPort, function () {
        console.log('Server is running on http://localhost:' + reportOptions.serverPort + '/');
        console.log('Press Ctrl + C to stop it.');
    });
};

