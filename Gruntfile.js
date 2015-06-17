module.exports = function(grunt) {


    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        karma: {

            unit: {
                configFile: 'karma.conf.js'
            }
        },

        clean: {
            docs: ["docs"]
        },

        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js']
        },

        jsdoc : {
            src: ['src/**/*.js'],
            options: {
                destination: 'docs'
            }
        }

    });

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.registerTask("default", ['jshint','karma']);
    grunt.registerTask("docs", ['clean:docs', 'jsdoc']);


};