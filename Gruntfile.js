module.exports = function(grunt) {
    const sass = require('node-sass');

    require('load-grunt-tasks')(grunt);
    
    grunt.initConfig({
        sass: {
            options: {
                implementation: sass,
                sourceMap: true,
            },
            dist: {
                options: {
                    style: 'expanded',
                    require: 'susy'
                },
                files: {
                    'src/style/app.css': 'src/style/app.scss'
                }
            }
        },
        cssmin: {
            options: {
                mergeIntoShorthands: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'public/app.min.css': ['src/style/app.css'],
                    'src/style/app.min.css': ['src/style/app.css']
                }
            }
        },
        watch: {
            css: {
                files: '**/*.scss',
                tasks: ['sass', 'cssmin']
            }
        },
    });

    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('default', ['cssmin', 'watch']);
}