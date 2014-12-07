var diff = require('diff');

exports.specificity = require('..');

exports.setupMatchers = function () {

    this.addMatchers({
        toEqualJSON: function (expected) {

            var actualString = typeof this.actual === 'string' ? this.actual : JSON.stringify(this.actual),
                expectedString = typeof expected === 'string' ? expected : JSON.stringify(expected);

            this.message = function () {
                var msg = '';
                diff.diffChars(actualString, expectedString).forEach(function (part) {
                    var color = part.added ? '\033[42m' : part.removed ? '\033[41m' : '\033[1;30m';
                    msg += color + part.value + '\033[0m';
                });
                return msg;
            };

            return actualString === expectedString;

        },
        toThrowMatch: function (expected) {
            var actual = this.actual,
                notText = this.isNot ? ' not' : '';
            try {
                actual();
            } catch (e) {
                this.message = function () {
                    return 'Expected function' + notText + ' to throw ' + expected + ', but it threw ' + e;
                };
                return expected.test(e);
            }
            this.message = function () {
                return 'Expected function' + notText + ' to throw ' + expected;
            };
            return false;
        }
    });

};
