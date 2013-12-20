define( function( require ) {
	'use strict';

	var SignupLayout = require( 'views/layout/SignupLayout' );
	var Marionette   = require( 'marionette' );
	var Backbone     = require( 'backbone' );
	var Vent         = require( 'Vent' );

	describe( 'SignupLayout', function() {
		var view;

		before( function() {
			view = new SignupLayout();
			view.render();
		} );

		after( function() {
			view.remove();
		} );

		it( 'should be an instance of SignupLayout Layout', function() {
			var signupLayout = new SignupLayout();
			signupLayout.should.be.an.instanceof( SignupLayout );
		} );

		it( 'should show spinner when event triggered', function ( done ) {

			view.on( 'ajaxSpinner', function( opts ) {
				view.$el.find( '.spinner' ).should.have.length( 1 );
				done();
			} );

			view.trigger( 'ajaxSpinner', {
				'spin' : true
			} );

		} );

		describe( 'Errors', function() {

			it( 'should display errors when submitted with invalid attribute', function( done ) {

				var $el = view.$el;

				view.ui.email.val('test.foo@bar.com'); // Invalid email
				view.ui.password.val('testpass'); // Invalid password
				view.ui.verifyPassword.val('testpass');

				$el.submit();

				view.on( 'SignupLayout:error', function( errors ) {
					done();
				} );

			} );

		} );

	} );

} );