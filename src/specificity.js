'use strict';

exports.parse = function (files, options) {
    var result = {};
    console.log(files, options);
    return result;
};

/* exported getSpecificity */

var getSpecificity = exports.getSpecificity = function (selector) {
    var m, re, a = 0, b = 0, c = 0;
    // Pseudo-class :not is not considered as a pseudo-class
    selector = selector.replace(/:not\(([^)]*)\)/g, ' $1 ');
    // Count :before and :after as pseudo-elements
    re = /:(?!:)(before|after)+/g;
    m = selector.match(re);
    if (m) {
        c += m.length;
        selector = selector.replace(re, '');
    }
    // Count pseudo-elements
    re = /:(?=:)[A-Za-z0-9_-]+/g;
    m = selector.match(re);
    if (m) {
        c += m.length;
        selector = selector.replace(re, '');
    }
    // Count ID attributes
    re = /(#[A-Za-z0-9_-]+)/g;
    m = selector.match(re);
    if (m) {
        a += m.length;
        selector = selector.replace(re, '');
    }
    // Count attributes and pseudo-classes
    re = /(\[[^\]]*\]|(:|\.)[A-Za-z0-9_-]+)/g,
    m = selector.match(re);
    if (m) {
        b += m.length;
        selector = selector.replace(re, '');
    }
    // Count elements
    re = /(\w+)/g;
    m = selector.match(re);
    if (m) {
        c += m.length;
    }
    return [ a, b, c ];
};
