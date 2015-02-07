'use strict';

/* exported colors */

var Table = require('cli-table'),
    colors = require('colors');

function tab(str) {
    return str.replace(/^/mg, '  ');
}

function printSelectors(data) {
    var options = data.json.options,
        head = ['selector'],
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
}

exports.printSelectors = printSelectors;
