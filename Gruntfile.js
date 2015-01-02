module.exports = function (grunt) {

	// Project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// Compile Sass to CSS using node-sass
		// https://github.com/sindresorhus/grunt-sass
		sass: {
			dev: {
				options: {
					sourceMap: false
				},
				files: {
					'dev/css/main.css': 'dev/sass/main.scss'
				}
			}
		},

		// Include all files alphabetically from a folder
		// https://github.com/DennisBecker/grunt-sass-globbing/
		sass_globbing: {
			dev: {
				files: {
					'dev/sass/import/config.scss': 'dev/sass/config/**/*.scss',
					'dev/sass/import/mixins.scss': 'dev/sass/mixins/**/*.scss',
					'dev/sass/import/base.scss': 'dev/sass/base/**/*.scss',
					'dev/sass/import/pattern.scss': 'dev/sass/pattern/**/*.scss',
					'dev/sass/import/modules.scss': 'dev/sass/modules/**/*.scss',
					'dev/sass/import/site.scss': 'dev/sass/site/**/*.scss'
				}
			}
		},

		// Combine matching media queries into one media query definition
		// https://www.npmjs.org/package/grunt-combine-media-queries
		cmq: {
			options: {
				log: false
			},
			dev: {
				files: {
					'dev/css': ['dev/css/*.css']
				}
			}
		},

		// Parse CSS and add vendor-prefixed CSS properties using the Can I Use database
		// https://github.com/nDmitry/grunt-autoprefixer
		autoprefixer: {
			options: {
				browsers: ['last 2 versions', 'ie >= 9', 'ios >= 7', 'android >= 4']
			},
			dev: {
				options: {
					map: {
						prev: 'dev/css/'
					}
				},
				src: 'dev/css/*.css'
			}
		},

		// SVG icon workflow with PNG fallback for legacy browsers
		// https://github.com/filamentgroup/grunticon
		grunticon: {
			icons: {
				files: [{
					expand: true,
					cwd: 'dev/img/icons/input',
					src: ['*.svg'],
					dest: "dev/img/icons/output"
				}],
				options: {
					cssprefix: '.icon-',
					dynamicColorOnly: true,
					pngfolder: 'fallback',
					loadersnippet: 'grunticon.js',
					template: 'dev/img/icons/templates/icon-css.hbs',
					previewhtml: 'icon.html'
				}
			}
		},

		// Concatenate JS files
		// https://github.com/gruntjs/grunt-contrib-concat
		concat: {

			// JS that needs to be loaded in <head>
			head: {
				files: [
					{
						src: [
							'dev/js/head/vendor/*.js'
						],
						dest: 'dev/js/head.js',
						nonull: true
					}
				]
			},

			// Main JS which is loaded before the </body>
			main: {
				files: [{
					src: [
						'dev/js/main/vendor/*.js'/*,
						 'dev/js/main*//*.js'*/
					],
					dest: 'dev/js/main.js',
					nonull: true
				}]
			}
		},

		// Copy files
		copy: {
			icons: {
				files: [
					{expand: true, cwd: 'dev/img/icons/output', src: '*.css', dest: 'dev/css/icons'},
					{expand: true, cwd: 'dev/img/icons/output/fallback', src: '**', dest: 'dev/css/icons/fallback'},
				]
			},

			dist: {
				files: [
					{expand: true, cwd: 'dev/css/', src: '**', dest: 'dist/css/'},
					{expand: true, cwd: 'dev/js/', src: '*.js', dest: 'dist/js/'},
					{expand: true, cwd: 'dev/img/', src: '*', dest: 'dist/img/'},
					{expand: true, cwd: 'dev', src: '*.*', dest: 'dist/'},
					{expand: true, cwd: 'dev', src: 'CNAME', dest: 'dist/'},
				]
			}
		},

		// Clean folders
		clean: {
			icons: ['dev/icons/output/*', 'dev/css/icons/*'],
			dist: ['dist/*']
		},

		// Linting for JavaScript
		// https://github.com/gruntjs/grunt-contrib-jshint
		// https://github.com/denkwerk/standards/blob/master/JS/js-standard.md
		jshint: {
			options: {
				'bitwise': true,
				'browser': true,
				'camelcase': true,
				'curly': true,
				'devel': true,
				'eqeqeq': true,
				'immed': true,
				'jquery': true,
				'maxcomplexity': 25,
				'maxdepth': 5,
				'maxlen': 160,
				'maxparams': 10,
				'maxstatements': 450,
				'newcap': true,
				'undef': true,
				'unused': false,
				'noarg': true,
				'nonew': true,
				'quotmark': true,
				'trailing': false,
				'white': false,
				'laxbreak': true,
				'laxcomma': true,
				'sub': true,
				'loopfunc': true,
				'predef': ['_', 'jQuery', '$', 'debug', 'debugInfo', 'debugError', 'debugDir']
			},
			all: ['dev/js/main/*.js'/*, 'dev/js/modules*//*.js'*/]
		},

		// CSS minify
		cssmin: {
			dist: {
				files: [{
					cwd: 'dist/css',
					src: ['*.css', '*/**.css'],
					dest: 'dist/css',
					expand: true
				}]
			}
		},

		// SVG minify
		svgmin: {
			options: {
				plugins: [
					{removeViewBox: false},
					{removeUselessStrokeAndFill: true},
					{cleanupIDs: false}
				]
			},
			dist: {
				files: [
					{
						expand: true,
						cwd: 'dev/img',
						src: ['*.svg'],
						dest: 'dev/img',
						ext: '.svg'
					}
				]
			}
		},

		// JS minify
		uglify: {
			dist: {
				files: [
					{
						expand: true,
						cwd: 'dist/js/',
						src: '**/*.js',
						dest: 'dist/js/'
					}
				]
			}
		},

		// Process HTML
		processhtml: {
			dev: {
				files: {
					'dev/index.html': ['dev/html/index.html']
				}
			},
			dev_modify: {
				files: {
					'dev/index.html': ['dev/index.html']
				}
			},

			dist: {
				files: {
					'dist/index.html': ['dist/index.html']
				}
			}
		},

		// Replace content
		replace: {
			dev: {
				options: {
					patterns: [
						{
							match: /\..\//g,
							replacement: ''
						}
					]
				},
				files: [
					{expand: true, flatten: true, src: ['dev/*.html'], dest: 'dev/'}
				]
			},

			dist: {
				options: {
					patterns: [
						{
							match: '/dev/',
							replacement: '/'
						}
					],
					usePrefix: false
				},
				files: [
					{expand: true, flatten: true, src: ['dist/js/*.js'], dest: 'dist/js/'}
				]
			}
		},

		// HTML miniy
		htmlmin: {
			options: {
				removeComments: true,
				collapseWhitespace: true
			},

			dist: {
				files: [{
					expand: true,
					cwd: 'dist/',
					src: '*.html',
					dest: 'dist/'
				}]
			}
		},

		// Run shell commands
		shell: {
			options: {
				stderr: false
			},

			// Deploys distribution folder to Github Pages branch
			// https://gist.github.com/cobyism/4730490
			deploy: {
				command: 'git subtree push --prefix dist origin gh-pages'
			}
		},

		// Listen for changes and init tasks
		// https://github.com/gruntjs/grunt-contrib-watch
		watch: {
			options: {
				nospawn: true,
				livereload: true
			},
			sass: {
				files: [
					'dev/sass/**/*.scss'
				],
				tasks: ['dev-sass'],
				options: {
					atBegin: true
				}
			},
			js: {
				files: [
					'dev/js/**/*.js'
				],
				tasks: ['dev-js'],
				options: {
					atBegin: true
				}
			},
			html: {
				files: [
					'dev/html/**/*.html'
				],
				tasks: ['dev-html'],
				options: {
					atBegin: true
				}
			},
			icons: {
				files: [
					'dev/img/icons/input/*.svg',
					'dev/img/icons/templates/*.*'
				],
				tasks: ['icon']
			},
			svg: {
				files: [
					'dev/img/*.svg'
				],
				tasks: ['svg']
			}
		}
	});

	// Load Grunt tasks automatically
	require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

	// Sass dev task
	grunt.registerTask('dev-sass', ['sass_globbing', 'sass', 'autoprefixer', 'cmq']);

	// JavaScript dev task
	grunt.registerTask('dev-js', ['concat', 'jshint']);

	// HTML dev task
	grunt.registerTask('dev-html', ['processhtml:dev', 'processhtml:dev_modify', 'replace:dev']);

	// Combined dev task
	grunt.registerTask('dev', ['dev-sass', 'dev-js', 'dev-html']);

	// Copy dist task
	grunt.registerTask('dist-copy', ['clean:dist', 'copy:dist']);

	// Modify dist task
	grunt.registerTask('dist-modify', ['cssmin', 'uglify', 'replace:dist', 'processhtml:dist', 'htmlmin']);

	// Combined dist task
	grunt.registerTask('dist', ['dist-copy', 'dist-modify']);

	// Icon generation task
	grunt.registerTask('icon', ['clean:icons', 'grunticon', 'copy:icons']);

	// SVG optimization task
	grunt.registerTask('svg', ['svgmin']);

	// Build task
	grunt.registerTask('build', ['dev', 'dist']);

	// Deploy task
	grunt.registerTask('deploy', ['shell:deploy']);

	// Default task
	grunt.registerTask('default', ['dev', 'icon', 'svg']);
};
