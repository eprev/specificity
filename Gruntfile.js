'use strict';

module.exports = function (grunt) {

    grunt.config.init({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            test : {
                files: ['src/**/*.js', 'spec/**/*.js'],
                tasks: ['test']
            }
        },

        clean: {
            tests: ['spec/tmp', 'coverage']
        },

        jasmine_node: {
            src: {
                options: {
                    specs: './spec'
                }
            }
        },

        istanbul: {
            src: {
                options: {
                    specs: './spec'
                }
            }
        },

        jshint: {
            all: [
                'Gruntfile.js',
                'src/**/*.js',
                '!src/reports/server/**/*.js',
                'src/reports/server/js/main.js',
                'spec/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        }
    });

    grunt.registerMultiTask('jasmine_node', 'Run jasmine-node', function () {

        var options = this.options(),
            done = this.async();

        grunt.util.spawn({
            cmd: './node_modules/.bin/jasmine-node',
            args: [options.specs]
        }, function (error, result) {
            if (error) {
                grunt.log.error(error);
                grunt.log.write(result.stdout);
                done(false);
            } else {
                grunt.log.write(result.stdout);
                done();
            }
        });

    });

    grunt.registerMultiTask('istanbul', 'Run istanbul cover', function () {

        var options = this.options(),
            done = this.async();

        grunt.util.spawn({
            cmd: './node_modules/.bin/istanbul',
            args: [
                'cover',
                '--root', './src',
                '--verbose',
                '--hook-run-in-context',
                '--report', 'html',
                './node_modules/.bin/jasmine-node', '--', options.specs
            ]
        }, function (error, result) {
            if (error) {
                grunt.log.error(error);
                grunt.log.write(result.stdout);
                done(false);
            } else {
                grunt.log.write(result.stdout);
                done();
            }
        });

    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('test', ['clean', 'jshint', 'jasmine_node']);
    grunt.registerTask('coverage', ['clean', 'istanbul']);

    grunt.registerTask('default', ['test']);

};
