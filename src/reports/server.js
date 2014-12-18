'use strict';

var express = require('express');

module.exports = function (data, reportOptions) {
    data.forEach(function (data) {
        var options = data.json.options;

        var app = express();

        app.listen(reportOptions.serverPort);

    });
};

