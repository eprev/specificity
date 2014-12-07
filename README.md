# Specificity [![Build Status](https://travis-ci.org/eprev/specificity.svg?branch=master)](https://travis-ci.org/eprev/specificity) [![NPM Version](https://img.shields.io/npm/v/node-specificity.svg)](https://www.npmjs.org/package/node-specificity)

Explore your CSS! Specificity uses PostCSS processor to parse CSS files and collects information about selectors specificity in these files. As a result you get JSON with the following structure:

```js
{
    '*': FILE,   // Container of the specific file. Pseudo-file '*' refers to all files.
    options: {
        cwd: '~' // Working directory. All files have names relative to this directory.
    }
}
```

`FILE`’s structure:

```js
{
    series: SERIES
    important: {
        min: 0,
        max: 0,
        avg: 0,
        med: 0
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
    distrib: {
        '0,0,1': 1,
        '0,0,2': 1,
        '0,1,0': 1,
        /* ~ */
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

## Road Map

* Support different reports
* Filtering: all or unique selectors
