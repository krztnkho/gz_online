define( function( require ) {
	'use strict';

	var _ = require( 'underscore' );
	var Backbone = require( 'backbone' );
	var Marionette = require( 'marionette' );
	var Vent = require( 'Vent' );
	var UserModel = require( 'models/UserModel' );
	var Session = require( 'models/SessionModel' );
	var Reqres  = require( 'RequestResponse' );

	var ErrorView = require( 'views/ErrorView' );
	var LoginLayoutTmpl = require( 'text!tmpl/views/layout/LoginLayout_tmpl.html' );

	/* Return a ItemView class definition */
	return Marionette.Layout.extend( {

		'initialize': function() {},

		'template': _.template( LoginLayoutTmpl ),

		'regions': {
			'loginError:': '#login-error',
		},

		/* ui selector cache */
		'ui': {
			'email': '#input-email',
			'password': '#input-password',
		},

		/* Ui events hash */
		'events': {
			'submit': 'login'
		},

		'login': function( event ) {
			var self = this;
			this.regionManager.each( function( region ) {
				region.close();
			} );

			var email = this.ui.email.val();
			var password = this.ui.password.val();

			Session.fetch( {
				'email'    : email,
				'password' : password,
				'success'  : function( resp ) {
					//Backbone.history.navigate('#user');
				},
				'error': function( xhr, status, error ) {
					console.log( error );
				}
			} );


					if(!Reqres.request('sessionAuthenticated')){
							Backbone.history.navigate('#user', true);
					}else{
						console.log('Chaka doll');
					}


			return false;
		}
	} );

} );