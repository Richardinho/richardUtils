module.exports = function(grunt) {


    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        karma: {

            unit: {
                configFile: 'karma.conf.js'
            }
        },

        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js']
        }

    });

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask("default", ['jshint','karma']);


};