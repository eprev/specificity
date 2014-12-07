# Specificity [![Build Status](https://travis-ci.org/eprev/specificity.svg?branch=master)](https://travis-ci.org/eprev/specificity) [![NPM Version](https://img.shields.io/npm/v/node-specificity.svg)](https://www.npmjs.org/package/node-specificity)

Explore your CSS!

Specificity parses your CSS files and collects information about selectors specificity. As a result you get JSON with the following structure:

```js
{
    '*': FILE,   // Container of the specific file. Pseudo-file '*' refers to the data of all files.
    'main.css': FILE,
    /* ... */
    'print.css': FILE,
    options: {
        cwd: '/deploy/static/css' // Working directory. All files have names relative to this directory.
    }
}
```

`FILE`’s structure:

```js
{
    series: SERIES // Sorted out selectors by their specificity
    important: {   // Data on using of `!important` directive
        min: 0,    // Min value (number of selector)
        max: 0,    // Max value (number of selector)
        avg: 0,    // Average value (number of selector)
        med: 0     // Median (number of selector)
    },
    weight_a: {
        /* --//-- */
    },
    weight_b: {
        /* --//-- */
    },
    weight_c: {
        /* --//-- */
    },
    weight:  {
        /* --//-- */
    },
    distrib: { // Specificity distribution
        '0,0,1': 1,
        '0,0,2': 1,
        '0,1,0': 1,
        /* ... */
        '1,0,0': 1,
        '2,3,3': 1
    }
}
```

`SERIES` is an array of objects:

```js
{
    selector: 'a', // Selector
    important: 0,  // Number of its rules with the `!important` directive
    weight: [ 0, 0, 1 ], // It’s specificity
    file: 'main.css',    // Name of the file where this selector has been found
    start: { line: 1, column: 1 }, // Start offset within the file
    end: { line: 1, column: 4 } }  // End offset
}
```

## Install

```
$ npm install -g node-specificity
```
