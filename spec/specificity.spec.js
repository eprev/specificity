'use strict';

var specUtils = require('./utils'),
    specificity = specUtils.specificity;

describe('working of getSpecificity() function', function () {

    beforeEach(specUtils.setupMatchers);

    it('should count elements and pseudo-elements', function () {
        expect(
            specificity.getSpecificity('a')
        ).toEqual(
            [0, 0, 1]
        );
        expect(
            specificity.getSpecificity('a span')
        ).toEqual(
            [0, 0, 2]
        );
        expect(
            specificity.getSpecificity(':before')
        ).toEqual(
            [0, 0, 1]
        );
        expect(
            specificity.getSpecificity('div:before')
        ).toEqual(
            [0, 0, 2]
        );
        expect(
            specificity.getSpecificity('div::after')
        ).toEqual(
            [0, 0, 2]
        );
    });

    it('should count classes and pseudo-classes', function () {
        expect(
            specificity.getSpecificity('a:link:first-child')
        ).toEqual(
            [0, 2, 1]
        );

        expect(
            specificity.getSpecificity('.link')
        ).toEqual(
            [0, 1, 0]
        );

        expect(
            specificity.getSpecificity('.link.active')
        ).toEqual(
            [0, 2, 0]
        );
    });

    it('should ignore :not as pseudo-class but consider specificity of the placed selector', function () {
        expect(
            specificity.getSpecificity('.link:not(a)')
        ).toEqual(
            [0, 1, 1]
        );
    });

    it('should count attributes as classes', function () {
        expect(
            specificity.getSpecificity('.link[external]:before')
        ).toEqual(
            [0, 2, 1]
        );
    });

    it('should count ids', function () {
        expect(
            specificity.getSpecificity('#footer * > *')
        ).toEqual(
            [1, 0, 0]
        );
    });

    it('should work with complex selectors', function () {
        expect(
            specificity.getSpecificity('body #header #menu .item a.link:visited::after')
        ).toEqual(
            [2, 3, 3]
        );
    });

});
