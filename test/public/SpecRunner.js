( function () {
	'use strict';

	require.config( {

		'baseUrl' : '../../app',

		'paths' : {
			// lives in the test directory
			'spec'                     : '../../test/public/spec',

			// Test libs
			'mocha'                    : 'bower_components/mocha/mocha',
			'chai'                     : 'bower_components/chai/chai',
			'sinon'                    : 'bower_components/sinon/lib/sinon',
			'sinon.chai'               : 'bower_components/sinon-chai/lib/sinon-chai',

			// Libraries and utility scripts
			'jquery'                   : 'bower_components/jquery/jquery',
			'bootstrap'                : 'bower_components/bootstrap/docs/assets/js/bootstrap',
			'underscore'               : 'bower_components/lodash/dist/lodash',
			'backbone'                 : 'bower_components/backbone/backbone',
			'marionette'               : 'bower_components/backbone.marionette/lib/core/amd/backbone.marionette',
			'backbone.babysitter'      : 'bower_components/backbone.babysitter/lib/amd/backbone.babysitter',
			'backbone.wreqr'           : 'bower_components/backbone.wreqr/lib/amd/backbone.wreqr',
			'backbone.localStorage'    : 'bower_components/backbone.localStorage/backbone.localStorage',
			'backbone.validation'      : 'bower_components/backbone-validation/dist/backbone-validation-amd',
			'text'                     : 'bower_components/requirejs-text/text',
			'async'                    : 'bower_components/async/lib/async',
			'jquery-cookie'            : 'bower_components/jquery-cookie/jquery.cookie',
			'modernizr'                : 'bower_components/modernizr/modernizr',
			'fine-uploader'            : 'bower_components/fine-uploader/build/jquery.fineuploader',
			'base64'                   : 'bower_components/base64', // *! utility to encode/decode
			'porthole'                 : 'bower_components/porthole/src/porthole.min', // *! platform <--> app communication
			'shim'                     : 'bower_components/shim', // *! utility for object prototypes
			'spinjs'                   : 'bower_components/spinjs/spin',
			'MiddlewareRouter'         : 'scripts/MiddlewareRouter',
			'bootbox'				   : 'bower_components/bootbox/bootbox',

			// root folders
			'models'                   : 'scripts/models',
			'collections'              : 'scripts/collections',
			'views'                    : 'scripts/views',
			'controllers'			   : 'scripts/controllers',
			'routers'                  : 'scripts/routers',
			'util'					   : 'scripts/util',
			'tmpl'                     : 'templates',

			// Base application level classes
			'App'                      : 'scripts/Application',
			'System'                   : 'scripts/System',
			'User'					   : 'scripts/User',
			'Communicator'             : 'scripts/Communicator',
			'Vent'                     : 'scripts/Vent',
			'RegionManager'            : 'scripts/RegionManager',
			'Router'                   : 'scripts/routers/AppRouter',
			'Controller'               : 'scripts/controllers/AppController',
			'RequestResponse'          : 'scripts/RequestResponse'
		},

		'shim' : {
			'jquery' : {
				'exports': '$'
			},

			'bootstrap' : {
				'deps' : [ 'jquery' ]
			},

			'porthole' : {
				'exports' : 'Porthole'
			},

			'backbone' : {
				'deps'    : [ 'underscore', 'jquery' ],
				'exports' : 'Backbone'
			},

			'fine-uploader' : {
				'deps' : [ 'jquery' ]
			},

			'jquery-cookie' : {
				'deps' : [ 'jquery' ]
			}

		}
	},
	require(
		[ 'jquery', 'spec/testSuite' ],
		function( $, testSuite ) {

			/* on dom ready require all specs and run */
			$( function () {
				require( testSuite.specs, function () {

					if ( window.mochaPhantomJS ) {
						mochaPhantomJS.run();
					} else {
						mocha.run();
					}

				} );
			} );
		} )
	);

} ).call( this );