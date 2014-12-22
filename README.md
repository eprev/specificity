# Specificity [![Build Status](https://travis-ci.org/eprev/specificity.svg?branch=master)](https://travis-ci.org/eprev/specificity) [![NPM Version](https://img.shields.io/npm/v/node-specificity.svg?style=flat)](https://www.npmjs.org/package/node-specificity)

Explore your CSS through visualization! Specificity parses your CSS files and collects information about selectors specificity in profiles. You can use `specificiy`’s reports to explore these profiles or write your own.

## Using

Installing:

```
$ npm install -g node-specificity
```

Specificy provides the following commands:

* Firstly, you need to create a profile. Run `parse` command to create it. Profile is a regular JSON file.
* Next, since you have created the profile, you can explore it by using `explore` command. You just need to specify the report.

If you type `node-specificity parse --help` or `node-specificty explore --help` you will get some usage examples.

Specificity supports the following reports: `inspect` (is used by default), `server` and `json`.

### `server`

Starts a local web server that allows you to explore the specified profiles in any browser.

![](docs/server-distribution.png)

### `inspect`

Prints the list of selectors, specificity, using of `!important` directive and location in the file. Prints max, min, average and median values of specificity in the summary. Outputs the specificty distribution histogram.

### `json`

Prints out the contents of the profile.

### Example

In the example below `specificity` creates a profile and outputs it to the standart input of another `specificty` process that prints out the default report results.

```
$ pwd
/deploy/static/

$ node-specificity parse --directory=css **/*.css | node-specificity explore -
File: -

  Working directory: /deploy/static/css

  ┌───────────────────────────────────────────────────┬─────────────┬───┬────────────────┐
  │ selector                                          │ specificity │ ! │ location       │
  ├───────────────────────────────────────────────────┼─────────────┼───┼────────────────┤
  │ h5                                                │       0,0,1 │ 0 │ main.css:117   │
  │ input                                             │       0,0,1 │ 0 │ main.css:11    │
  │ h6                                                │       0,0,1 │ 0 │ main.css:122   │
  │ body                                              │       0,0,1 │ 0 │ main.css:6     │
  ...
  │ .post__content pre .smalltalk .class              │       0,3,1 │ 0 │ main.css:422   │
  │ .post__content pre .clojure .attribute            │       0,3,1 │ 0 │ main.css:468   │
  │ .post__content pre .rules .value .number          │       0,4,1 │ 0 │ main.css:422   │
  │ .post__content pre .ruby .symbol .string          │       0,4,1 │ 0 │ main.css:422   │
  └───────────────────────────────────────────────────┴─────────────┴───┴────────────────┘

  ┌─────┬────────────────┬────────┬────────┬────────┬────────┐
  │     │    specificity │      a │      b │      c │      ! │
  ├─────┼────────────────┼────────┼────────┼────────┼────────┤
  │ max │          0,4,1 │      0 │      4 │      3 │      0 │
  │ avg │    0,1.71,0.85 │      0 │   1.71 │   0.85 │      0 │
  │ med │          0,2,1 │      0 │      2 │      1 │      0 │
  └─────┴────────────────┴────────┴────────┴────────┴────────┘

  0,0,1 | ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙                       | 32
  0,0,2 | ∙                                                            | 1
  0,0,3 | ∙                                                            | 1
  0,1,0 | ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙                         | 30
  0,1,1 | ∙∙                                                           | 2
  0,1,2 | ∙∙∙∙                                                         | 3
  0,2,0 | ∙∙                                                           | 2
  0,2,1 | ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙      | 46
  0,3,1 | ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ | 50
  0,4,1 | ∙∙                                                           | 2
```

## Profile structure

Specificity parses your CSS files and collects information about selectors specificity. As a result you get JSON with the following structure:

```js
{
    files: {
        '*': FILE,   // Container of the specific file. Pseudo-file '*' refers to the data of all files.
        'main.css': FILE,
        /* ... */
        'print.css': FILE,
    },
    options: {
        cwd  : '/deploy/static/css', // Working directory. All files have names relative to this directory.
        label: '2014-12', // You can assign an arbitrary label to each profile.
        uniqueSelectors: false // If set to True, then the profile doesn't contain repeating selectors.
    }
}
```

`FILE`’s structure:

```js
{
    series: SERIES // Sorted out selectors by their specificity
    important: {   // Using of `!important` directive
        min: 0,    // Min value (number of selector)
        max: 0,    // Max value (number of selector)
        avg: 0,    // Average value (number of selector)
        med: 0     // Median (number of selector)
    },
    weight_a: {    // Using of IDs in selectors
        /* --//-- */
    },
    weight_b: {    // Using of classes, pseudo-classes and attributes in selectors
        /* --//-- */
    },
    weight_c: {    // Using of elements and pseudo-elements in selectors
        /* --//-- */
    },
    weight:  {     // Contains min, max, average and median specificity
        /* --//-- */
    },
    distrib: { // Specificity distribution (specificity => number of selectors)
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
