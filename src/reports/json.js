'use strict';

var inspect = require('util').inspect;

module.exports = function (data) {
    data.forEach(function (data) {
        console.log('File:', data.file);
        console.log(inspect(data.json, { depth: null, colors: true }));
    });
};

