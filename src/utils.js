'use strict';

/* exported colors */

var Table = require('cli-table'),
    colors = require('colors');

function tab(str) {
    return str.replace(/^/mg, '  ');
}

function splitSelector(selector, maxLength) {
    if (maxLength > 0) {
        var chunks = selector.split(/\s+/);
        var lines = [],
            line,
            nextLine;
        for (var i = 0, c = chunks.length; i < c; i++) {
            if (line) {
                nextLine = line + ' ' + chunks[i];
                if (nextLine.length > maxLength) {
                    lines.push(line);
                    line = chunks[i];
                } else {
                    line = nextLine;
                }
            } else {
                line = chunks[i];
            }
        }
        if (line) {
            lines.push(line);
        }
        return lines;
    } else {
        return [selector];
    }
}

function printSelectors(data, commandOptions) {
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
    var maxLength = commandOptions.columnSize;
    data.json.files['*'].series.forEach(function (o) {
        var lines = splitSelector(o.selector, maxLength);
        lines.forEach(function (line, i) {
            var row = [];
            if (i === 0) {
                row.push(
                    (o.important ? line.red : line) + (lines.length > 1 ? ' →'.gray : '')
                );
                if (options.uniqueSelectors) {
                    row.push(data.json.uniqueSelectors[o.selector]);
                }
                row.push(
                    o.weight,
                    o.important ? o.important.toString().red : 0,
                    o.file + ':' + o.start.line + (o.start.column > 1 ? '|' + o.start.column : '')
                );
            } else {
                row.push(
                     ('+' + i + ' ').gray + (o.important ? line.red : line) + (i < lines.length - 1 ? ' →'.gray : '')
                );
                if (options.uniqueSelectors) {
                    row.push('.'.gray);
                }
                row.push(
                    '.'.gray,
                    '.'.gray,
                    '.'.gray
                );
            }
            table.push(row);
        });
    });
    console.log(tab(table.toString()));
}

exports.printSelectors = printSelectors;
