module.exports = function(grunt) {

    "use strict";

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        clean: {
            docs: ["./docs/"]
        },

        jshint: {

            options : {
                jshintrc : '.jshintrc',
                ignores : [
                ]
            },
            all: ['Gruntfile.js', 'src/**/*.js']
        },

        jsdoc : {
            src: ['src/**/*.js'],
            options: {
                destination: 'docs'
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.registerTask("docs", ['clean:docs', 'jsdoc']);
    grunt.registerTask("lint", ['jshint']);


};