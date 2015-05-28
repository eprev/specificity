'use strict';

var express = require('express');
var path = require('path');

function compact(data) {
    data.forEach(function (profile) {
        var files = profile.json.files;
        Object.keys(files).forEach(function (file) {
            var fo = files[file];
            // Replace series property by the actual number of selectors
            fo.series = fo.series ? fo.series.length : 0;
        });
        // Delete the list of unique selectors
        delete profile.json.uniqueSelectors;
    });
}

module.exports = function (data, reportOptions) {
    compact(data);
    var app = express();
    app.use(express.static(path.join(__dirname, 'server')));
    app.get('/data', function (req, res) {
        res.json(data);
    });
    app.listen(reportOptions.serverPort, function () {
        console.log('Server is running on http://localhost:' + reportOptions.serverPort + '/');
        console.log('Press Ctrl + C to stop it.');
    });
};

