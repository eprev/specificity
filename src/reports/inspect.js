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
        console.log('File:', data.file.gray);
        console.log();
        console.log('  Working directory:', data.json.options.cwd.gray);

        console.log();

        var table = new Table({
            head     : [ 'selector', 'specificity', '!',     'location' ],
            colAligns: [ 'left',     'right',       'right', 'left' ],
            style: {
                head: [ 'green' ],
                compact: true
            }
        });
        data.json.files['*'].series.forEach(function (o) {
            table.push([
                o.important ? o.selector.red : o.selector,
                o.weight,
                o.important ? o.important.toString().red : 0,
                o.file + ':' + o.start.line + (o.start.column > 1 ? '|' + o.start.column : '')
            ]);
        });
        console.log(tab(table.toString()));

        console.log();

        var multiple = Object.keys(data.json.files).length > 1;
        var head      = [''],
            colAligns = ['right'],
            colWidths = [5];
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
