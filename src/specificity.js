'use strict';

var fs = require('fs'),
    postcss = require('postcss'),
    path = require('path');

exports.parse = function (files, options) {

    if (!options.cwd) {
        options.cwd = '';
    }

    function cmp(prop){
        return function(a, b) {
            return a[prop] >= b[prop] ? 1 : -1;
        };
    }

    var multiple = files.length > 1,
        result = {
            '*': {
                series: []
            }
        },
        series = result['*'].series;

    files.forEach(function (file) {
        var css = fs.readFileSync(path.join(options.cwd, file), 'utf8'),
            root = postcss.parse(css, { safe: true });
        if (multiple) {
            result[file] = {
                series: []
            };
        }
        root.eachRule(function (rule) {
            var important = 0;
            rule.eachDecl(function (decl) {
                if (decl.important) {
                    important++;
                }
            });
            rule.selectors.forEach(function (selector) {
                var weight = getSpecificity(selector);
                var o = {
                    selector: selector,
                    important: important,
                    weight: weight,
                    file: file,
                    start: rule.source.start,
                    end: rule.source.end
                };
                series.push(o);
            });
        });
    });

    series = series.sort(cmp('weight'));

    if (multiple) {
        series.forEach(function(o) {
            result[o.file].series.push(o);
        });
        for (var i in result) {
            profile(result[i])
        }
    } else {
        profile(result['*'])
    }

    function median(series) {
        var n = series.length;
        if (n % 2) {
            return series[ (n + 1) / 2 ];
        } else {
            var a = series[ n/2 ],
                b = series[ n/2 +1 ];
            if (Array.isArray(a)) {
                return [0, 1, 2].map(function (i) {
                    return (a[i] + b[i]) / 2;
                });
            } else {
                return (a + b) / 2;
            }
        };
    }

    function profile(data) {
        data['important'] = {
                'min'  : Infinity,
                'max'  : 0,
                'avg'  : 0,
                'med'  : 0
            };
        data['weight_a'] = {
                'min'  : Infinity,
                'max'  : 0,
                'avg'  : 0,
                'med'  : 0
            };
        data['weight_b'] = {
                'min'  : Infinity,
                'max'  : 0,
                'avg'  : 0,
                'med'  : 0
            };
        data['weight_c'] = {
                'min'  : Infinity,
                'max'  : 0,
                'avg'  : 0,
                'med'  : 0
            };
        data['weight'] = {
                'min'  : [Infinity, Infinity, Infinity],
                'max'  : [0, 0, 0],
                'avg'  : [0, 0, 0],
                'med'  : [0, 0, 0]
            };
        function check(v, prop) {
            if (v > data[prop].max) {
                data[prop].max = v;
            }
            if (v < data[prop].min) {
                data[prop].min = v;
            }
            if (Array.isArray(v)) {
                data[prop].avg[0] += v[0];
                data[prop].avg[1] += v[1];
                data[prop].avg[2] += v[2];
            } else {
                data[prop].avg += v;
            }
        }
        function fin(prop) {
            if (Array.isArray(data[prop].avg)) {
                data[prop].avg[0] /= n;
                data[prop].avg[1] /= n;
                data[prop].avg[2] /= n;
            } else {
                data[prop].avg /= n;
            }
        }
        var distrib = data.distrib = {};
        var n = data.series.length;
        var a = [], b = [], c = [], abc = [];
        data.series.forEach(function (o, i) {
            check(o.important, 'important');
            check(o.weight[0], 'weight_a');
            check(o.weight[1], 'weight_b');
            check(o.weight[2], 'weight_c');
            check(o.weight,    'weight');
            a.push(o.weight[0]);
            b.push(o.weight[1]);
            c.push(o.weight[2]);
            abc.push(o.weight);
            var sw = o.weight.join(',');
            if (distrib[sw]) {
                distrib[sw]++;
            } else {
                distrib[sw] = 1;
            }
        });
        fin('important');
        fin('weight_a');
        fin('weight_b');
        fin('weight_c');
        fin('weight');
        data.weight_a.med = median(a);
        data.weight_b.med = median(b);
        data.weight_c.med = median(c);
        data.weight.med   = median(abc);
    }

    result.options = options;

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
