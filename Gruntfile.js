var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};
module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('serve', ['connect:serve', 'watch']);

    grunt.registerTask('dev', [
        'clean',
        'ngTemplateCache',
        'concat',
        'less',
        'copy'
    ]);

    grunt.registerTask('default', [
        'dev',
        'uglify',
        'cssmin'
    ]);

    grunt.initConfig({
        cmpnt: grunt.file.readJSON('bower.json'),
        banner: '/*! angularSlidesEditor v<%= cmpnt.version %> by Alex Slubsky(aslubsky@gmail.com) - ' +
            'https://github.com/aslubsky/angular-slides-editor - New BSD License */\n',
        clean: {

            working: {
                src: ['./.temp/views', './.temp/']
            }
        },
        copy: {
            styles: {
                files: [
                    {
                        src: './src/styles/main.less',
                        dest: './dist/angular-slides-editor.less'
                    }
                ]
            }
        },
        uglify: {
            js: {
                src: ['./dist/angular-slides-editor.js'],
                dest: './dist/angular-slides-editor.min.js',
                options: {
                    banner: '<%= banner %>',
                    sourceMap: function (fileName) {
                        return fileName.replace(/$/, '.map');
                    }
                }
            }
        },
        concat: {
            js: {
                src: [
                    'src/scripts/01-*.js',
                    'src/scripts/02-*.js',
                    'src/scripts/03-*.js',
                    'src/scripts/04-*.js',
                    'src/scripts/05-*.js',
                    //'src/scripts/06-*.js',
                    './.temp/scripts/views.js',
                    'src/scripts/07-*.js'
                ],
                dest: './dist/angular-slides-editor.js'
            }
        },
        less: {
            css: {
                files: {
                    './dist/angular-slides-editor.css': 'src/styles/main.less'
                }
            }
        },
        cssmin: {
            css: {
                files: {
                    './dist/angular-slides-editor.min.css': './dist/angular-slides-editor.css'
                },
                options: {
                    banner: '<%= banner %>'
                }
            }
        },
        watch: {
            css: {
                files: 'src/styles/*.less',
                tasks: ['less'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: 'src/scripts/*.js',
                tasks: ['concat'],
                options: {
                    livereload: true
                }
            },
            html: {
                files: 'src/angular-slides-editor/*.html',
                tasks: ['ngTemplateCache', 'concat'],
                options: {
                    livereload: true
                }
            }
        },
        connect: {
            options: {
                port: 8000,
                hostname: 'localhost'
            },
            serve: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '.')
                        ];
                    }
                }
            }
        },
        ngTemplateCache: {
            views: {
                files: {
                    './.temp/scripts/views.js': 'src/angular-slides-editor/*.html'
                },
                options: {
                    trim: 'src/',
                    module: 'angularSlidesEditor'
                }
            }
        }
    });
};
