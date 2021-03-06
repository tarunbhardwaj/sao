module.exports = function(grunt) {

  var _ = grunt.util._;
  var locales = ["bg_BG", "ca_ES", "cs_CZ", "de_DE", "es_AR", "es_CO", "es_EC",
  "es_ES", "fr_FR", "ja_JP", "lt_LT", "nl_NL", "ru_RU", "sl_SI"];
  var jsfiles = [
      'src/sao.js',
      'src/rpc.js',
      'src/pyson.js',
      'src/session.js',
      'src/model.js',
       'src/tab.js',
       'src/screen.js',
       'src/view.js',
       'src/action.js',
       'src/common.js',
       'src/window.js',
       'src/wizard.js'
  ];

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    xgettext: {
        locale: {
            files: {
                javascript: jsfiles
            },
            options: {
                functionName: "Sao.i18n.gettext",
                potFile: "locale/messages.pot"
            },
        }
    },
    shell: {
        options: {
            failOnError: true
        },
        msgmerge: {
            command: _.map(locales, function(locale) {
                var po = "locale/" + locale + ".po";
                return "msgmerge -U " + po + " locale/messages.pot;";
            }).join("")
        },
        po2json: {
            command: _.map(locales, function(locale) {
                var po = "locale/" + locale + ".po";
                var json = "locale/" + locale + ".json";
                return "./node_modules/.bin/po2json-gettextjs " +
                    po + " " + json + ";";
            }).join("")
        }
    },
    concat: {
        dist: {
            src: jsfiles,
            dest: 'dist/<%= pkg.name %>.js'
        }
    },
    jshint: {
        dist: {
            options: {
                jshintrc: 'src/.jshintrc'
            },
            src: ['dist/<%= pkg.name %>.js']
        },
        grunt: {
            src: ['Gruntfile.js']
        },
        tests: {
            options: {
                jshintrc: 'tests/.jshintrc'
            },
            src: ['tests/*.js']
        }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %>-<%= pkg.version %> | GPL-3\n' +
        'This file is part of Tryton.  ' +
        'The COPYRIGHT file at the top level of\n' +
        'this repository contains the full copyright notices ' +
        'and license terms. */\n'
      },
      dist: {
        src: 'dist/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    less: {
        dev: {
            options: {
                paths: ['src']
            },
            files: {
                'dist/<%= pkg.name %>.css': 'src/*.less'
            }
        },
        'default': {
            options: {
                paths: ['src'],
                yuicompress: true
            },
            files: {
                'dist/<%= pkg.name %>.min.css': 'src/*.less'
            }
        }
    },
    watch: {
        scripts: {
            files: ['src/*.js'],
            tasks: ['concat', 'jshint']
        },
        styles: {
            files: ['src/*.less'],
            tasks: 'less:dev'
        }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-xgettext');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['concat', 'jshint', 'uglify', 'less:default']);
  grunt.registerTask('dev', ['concat', 'jshint', 'less:dev']);
  grunt.registerTask('msgmerge', ['shell:msgmerge']);
  grunt.registerTask('po2json', ['shell:po2json']);

};
