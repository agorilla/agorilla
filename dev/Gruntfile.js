module.exports = function (grunt) {

	grunt.initConfig({

		sass: {
			dist: {
				files: {
					'../dist/css/style.css': 'sass/style.scss'
				}
			}
		},

		autoprefixer: {
			build: {
				src: '../dist/css/style.css',
				dest: '../dist/css/style.css'
			},
			options: {
				// available options:
				// https://github.com/nDmitry/grunt-autoprefixer#options
				browsers: [ '> 1%', 'last 2 versions' ]
			}
		}

	});

	// Load Grunt tasks automatically
	require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });

	// Default task(s).
	// ORDER IS IMPORTANT
	grunt.registerTask('default', [
		'sass',
		'autoprefixer'
	]);

};