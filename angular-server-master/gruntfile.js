module.exports = (grunt) => {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		ngAnnotate: {
			options: {
				singleQuotes: true
			},
			dist: {
				files: {
					'./client/dist/min-safe/js/controllers/account_form.js': ['./client/controllers/account_form.js'],
					'./client/dist/min-safe/js/controllers/account.js': ['./client/controllers/account.js'],
					'./client/dist/min-safe/js/controllers/cardNavController.js': ['./client/controllers/cardNavController.js'],
					'./client/dist/min-safe/js/controllers/checkout.js': ['./client/controllers/checkout.js'],
					'./client/dist/min-safe/js/controllers/loginController.js': ['./client/controllers/loginController.js'],
					'./client/dist/min-safe/js/controllers/mypostingController.js': ['./client/controllers/mypostingController.js'],
					'./client/dist/min-safe/js/controllers/navController.js': ['./client/controllers/navController.js'],
					'./client/dist/min-safe/js/controllers/opt1Controller.js': ['./client/controllers/opt1Controller.js'],
					'./client/dist/min-safe/js/controllers/opt2Controller.js': ['./client/controllers/opt2Controller.js'],
					'./client/dist/min-safe/js/controllers/opt3Controller.js': ['./client/controllers/opt3Controller.js'],
					'./client/dist/min-safe/js/controllers/signupController.js': ['./client/controllers/signupController.js'],
					'./client/dist/min-safe/js/controllers/view1Controller.js': ['./client/controllers/view1Controller.js'],
					'./client/dist/min-safe/js/main.js': ['./client/main.js']
				}
			}
		},
		concat: {
			js: {
				src: ['./client/dist/min-safe/js/main.js', './client/dist/min-safe/js/controllers/*.js'],
				dest: './client/dist/app.js'
			}
		},
		uglify: {
			js: {
				src: ['./client/dist/app.js'],
				dest: './client/dist/app.min.js'
			}
		}
	})
	
	grunt.loadNpmTasks('grunt-contrib-concat')	
	grunt.loadNpmTasks('grunt-contrib-uglify')	
	grunt.loadNpmTasks('grunt-ng-annotate')

	grunt.registerTask('default', ['ngAnnotate', 'concat', 'uglify'])	
}