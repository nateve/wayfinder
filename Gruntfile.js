'use strict';


module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-clean');

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  grunt.initConfig({
    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          '*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    }, 
    watch: {
        js: {
            files: ['{,*/}*.js'],
            tasks: ['newer:jshint:all'],
            options: {
                livereload: true
            }
        },
        livereload: {
            options: {
                livereload: true
            },
            files: [
                '{,*/}*.html',
                'css/{,*/}*.css'
            ]
        }
    }
  });

  grunt.registerTask('simple', [
    'jshint:all'
  ]);

  grunt.registerTask('reload', [
    'watch'
  ]);


};
