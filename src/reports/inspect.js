'use strict';

/* exported colors */

var utils = require('../utils'),
    Table = require('cli-table'),
    bars = require('../../vendors/bars'),
    colors = require('colors');

function toFixed(v) {
    if (v === null || typeof v === 'undefined') {
        return '-';
    } else if (Array.isArray(v)) {
        return v.map(toFixed);
    } else {
        return parseInt(v) === v ? v : v.toFixed(2);
    }
}

function tab(str) {
    return str.replace(/^/mg, '  ');
}

function printSummary(data) {
    var multiple = Object.keys(data.json.files).length > 1,
        head      = [''],
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
    var table = new Table({
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
}

module.exports = function (data, commandOptions) {
    data.forEach(function (data) {

        var options = data.json.options;

        console.log('File:', data.file.gray);
        console.log();
        console.log('  Working directory:', options.cwd.gray);
        if (options.label) {
            console.log('  Label:', options.label.gray);
        }

        if (commandOptions.selectors) {
            console.log();
            utils.printSelectors(data, commandOptions);
        }

        if (commandOptions.summary) {
            console.log();
            printSummary(data);
        }

        if (commandOptions.charts) {
            console.log();
            console.log(bars(data.json.files['*'].distrib, { bar: '∙'.gray }));

        }

    });
};
