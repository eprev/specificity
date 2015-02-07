'use strict';

var utils = require('./utils'),
    parseQuery = require('./query/parser').parse;

module.exports = function (query, data, commandOptions) {

    function match(a, b) {
        for (var i = 0; i < 3; i++) {
            if (b[i] !== '*' && a[i] !== b[i]) {
                return false;
            }
        }
        return true;
    }

    try {
        var filterFn = (new Function(
            'match',
            'return function(o) { return ' + parseQuery(query) + '}'
        ))(
            match
        );
    } catch (e) {
        console.log('\n  error: invalid query\n');
        process.exit(4);
    }

    data.forEach(function (data) {

        var options = data.json.options;

        console.log('File:', data.file.gray);
        console.log();
        console.log('  Working directory:', options.cwd.gray);
        if (options.label) {
            console.log('  Label:', options.label.gray);
        }
        console.log();

        data.json.files['*'].series = data.json.files['*'].series.filter(filterFn);

        utils.printSelectors(data, commandOptions);

        console.log('\n  Total: ', data.json.files['*'].series.length);

    });
};
