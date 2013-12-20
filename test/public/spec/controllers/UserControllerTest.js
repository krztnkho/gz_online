define( function( require ) {
	'use strict';
	var UserController = require( 'controllers/UserController' );
	var App            = require( 'App' );
	var Vent           = require( 'Vent' );
	describe( 'Marionette - User', function() {
		describe( 'Controller', function() {
			it( 'should be an instance of User Controller', function() {
				var userControl = new UserController( {
					'App': App,
					'Vent': Vent
				} );

				userControl.should.be.an.instanceof( UserController );

			} );

			it( 'more tests to be placed' );
		} );

		describe( 'Skills View', function() {
			// code
			it( 'should display the skills tree' );

			it( 'should display the number of skills the user has completed' );

			it( 'should enable the skills that has been completed by the user.' );

			it( 'should be able to access the first level as new user' );

			it( 'should be able to access the second level when first level is completed' );

			it( 'should be able to access the third level when first and second level is completed' );

			it( 'should have a hover view for each skill' );

			it( 'should be able to logout (session coordinate)' );

			it( 'should save data to DB so that any changes will be reflected on the profile.' );

		} );
	} );
} );
