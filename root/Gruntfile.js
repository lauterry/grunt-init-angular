module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        assetsDir: 'app',
        distDir: 'dist',

        'bower-install': {
            target: {
                html: '<%= assetsDir %>/index.html',
                ignorePath: '<%= assetsDir %>/',
                jsPattern: '<script type="text/javascript" src="{{filePath}}"></script>',
                cssPattern: '<link rel="stylesheet" href="{{filePath}}" >'
            }
        },
        clean: {
            dist: ['.tmp', '<%= distDir %>']
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= assetsDir %>',
                    dest: '<%= distDir %>/',
                    src: [
                        'index.html',
                        'img/**'
                    ]
                }]
            }
        },
        ngmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/js',
                    src: '*.js',
                    dest: '.tmp/concat/js'
                }]
            }
        },
        useminPrepare: {
            html: '<%= assetsDir %>/index.html'
        },
        usemin: {
            html: '<%= distDir %>/index.html'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all : {
                src : ['<%= assetsDir %>/js/**/*.js']
            }
        }{% if (revision) { %},
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= distDir %>/js/{,*/}*.js',
                        '<%= distDir %>/css/{,*/}*.css'
                    ]
                }
            }
        }{% } %},
        watch: {
            options: {
                livereload: true
            },
            js: {
                files: ['<%= assetsDir %>/js/**/*.js'],
                tasks: ['newer:jshint' {% if (test) { %}, 'karma:dev_unit:run' {% } %}]
            },
            html : {
                files: ['<%= assetsDir %>/**/*.html']
            },
            css: {
                files: ['<%= assetsDir %>/css/**/*.css']{% if (csslint) { %},
                tasks: ['csslint']
                {% } %}
            }{% if (csspreprocessor === 'sass') { %},
            scss: {
                files : ['<%= assetsDir %>/scss/**/*.scss'],
                tasks: ['newer:sass:all']
            }{% } %}
        }{% if (csslint) { %},
        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            all : {
                src : ['<%= assetsDir %>/css/**/*.css']
            }
        }{% } %},
        connect: {
            dev_server: {
                options: {
                    port: 8888,
                        base: '<%= assetsDir %>',
                        keepalive: false,
                        livereload: true,
                        open: true
                }
            },
            dist_server : {
                options: {
                    port: 8887,
                        base: '<%= assetsDir %>',
                        keepalive: false,
                        livereload: false,
                        open: false
                }
            }{% if (complexity) { %},
            plato : {
                options: {
                    port: 8889,
                        base: 'reports/complexity',
                        keepalive: true,
                        open: true
                }
            }{% } %}
        }{% if (test) { %},
        karma: {
            dev_unit: {
                options: {
                    configFile: 'test/conf/unit-test-conf.js',
                        background: true,  // The background option will tell grunt to run karma in a child process so it doesn't block subsequent grunt tasks.
                        singleRun: false,
                        autoWatch: true,
                        reporters: ['progress']
                }
            },
            e2e: {
                options: {
                    configFile: 'test/conf/e2e-test-conf.js'
                }
            },
            dist_unit: {
                options: {
                    configFile: 'test/conf/unit-test-conf.js',
                        background: false,
                        singleRun: true,
                        autoWatch: false,
                        reporters: ['progress', 'coverage'],
                        coverageReporter : {
                            type : 'html',
                            dir : '../reports/coverage'
                        }
                }
            }
        }{% } %}{% if (complexity) { %},
        plato : {
            options: {
                jshint : grunt.file.readJSON('.jshintrc'),
                    title : '{%= title %}'
            },
            all : {
                files: {
                    'reports/complexity': ['<%= assetsDir %>/js/**/*.js']
                }
            }
        }{% } %}{% if (csspreprocessor === 'sass') { %},
        sass: {
            options : {
                style : 'expanded',
                trace : true
            },
            all: {
                files: [{
                    expand: true,
                    cwd: '<%= assetsDir %>/scss',
                    src: ['**/*.scss'],
                    dest: '<%= assetsDir %>/css',
                    ext: '.css'
                }]
            }
        }{% } %}
    });

    {% if (test) { %}grunt.registerTask('test:e2e', ['connect:dist_server', 'karma:e2e']);{% } %}
    {% if (test) { %}grunt.registerTask('test:unit', ['connect:dist_server', 'karma:dist_unit:start']);{% } %}
    {% if (complexity) { %}grunt.registerTask('report', ['plato', 'connect:plato']);{% } %}
    grunt.registerTask('dev', ['connect:dev_server', {% if (test) { %}  'karma:dev_unit:start',  {% } %} 'watch']);
    grunt.registerTask('package', ['jshint', 'clean', 'useminPrepare', 'copy', 'concat', 'ngmin', 'uglify', {% if (csspreprocessor === 'sass') { %}'sass',{% } %} 'cssmin' {% if (revision) { %}, 'rev'{% } %},  'usemin']);
    grunt.registerTask('default', ['package'{%if(test){%}, 'connect:dist_server', 'karma:dist_unit:start', 'karma:e2e'{% } %} {% if (complexity) { %} ,'plato'{% } %}]);


};