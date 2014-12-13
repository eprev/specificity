'use strict';

/* exported colors */

var Table = require('cli-table'),
    bars = require('bars'),
    colors = require('colors');

function toFixed(v) {
    if (Array.isArray(v)) {
        return v.map(toFixed);
    } else {
        return parseInt(v) === v ? v : v.toFixed(2);
    }
}

function tab(str) {
    return str.replace(/^/mg, '  ');
}

module.exports = function (data) {
    data.forEach(function (data) {

        var options = data.json.options;

        console.log('File:', data.file.gray);
        console.log();
        console.log('  Working directory:', options.cwd.gray);

        console.log();

        var head = ['selector'],
            colAligns = ['left'];
        if (options.uniqueSelectors) {
            head.push('#');
            colAligns.push('right');
        }
        head.push('specificity', '!', 'location');
        colAligns.push('right', 'right', 'left');
        var table = new Table({
            head     : head,
            colAligns: colAligns,
            style: {
                head: [ 'green' ],
                compact: true
            }
        });
        data.json.files['*'].series.forEach(function (o) {
            var row = [
                o.important ? o.selector.red : o.selector
            ];
            if (options.uniqueSelectors) {
                row.push(data.json.uniqueSelectors[o.selector]);
            }
            row.push(
                o.weight,
                o.important ? o.important.toString().red : 0,
                o.file + ':' + o.start.line + (o.start.column > 1 ? '|' + o.start.column : '')
            );
            table.push(row);
        });
        console.log(tab(table.toString()));

        console.log();

        var multiple = Object.keys(data.json.files).length > 1;
        head      = [''];
        colAligns = ['right'];
        var colWidths = [5];
        if (multiple) {
            head.push(
                'file'
            );
            colWidths.push(
                12
            );
            colAligns.push(
                'left'
            );
        }
        head.push(
            'specificity', 'a', 'b', 'c', '!'
        );
        colWidths.push(
            16, 8, 8, 8, 8
        );
        colAligns.push(
            'right', 'right', 'right', 'right', 'right'
        );
        table = new Table({
            head     : head,
            colWidths: colWidths,
            colAligns: colAligns,
            style: {
                head: [ 'green' ],
                compact: true
            }
        });

        ['max', 'avg', 'med'].forEach(function (prop, i) {

            if (multiple && i) {
                table.push({
                    '': ['', '', '', '', '', '']
                });
            }

            for (var file in data.json.files) {
                var o = data.json.files[file];
                var row = {};
                row[prop] = [];
                if (multiple) {
                    row[prop].push(file);
                }
                row[prop].push(
                    toFixed(o.weight[prop]), toFixed(o.weight_a[prop]), toFixed(o.weight_b[prop]), toFixed(o.weight_c[prop]), toFixed(o.important[prop])
                );
                table.push(row);
            }

        });

        console.log(tab(table.toString()));

        console.log();

        console.log(bars(data.json.files['*'].distrib, { bar: '∙'.gray }));

    });
};
