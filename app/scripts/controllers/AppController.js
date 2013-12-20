define( function( require ) {
	'use strict';

	var Marionette = require( 'marionette' );
	var Backbone   = require( 'backbone' );
	var _          = require( 'underscore' );

	var Session = require( 'models/SessionModel' );
	var Reqres  = require( 'RequestResponse' );

	var views = {
		'SignupLayout' : require( 'views/layout/SignupLayout' ),
		'ErrorView'    : require( 'views/ErrorView' ),
		'NavLayout'    : require( 'views/layout/NavLayout' ),
		'LoginLayout'  : require( 'views/layout/LoginLayout' )
	};

	var applications = {
		'SystemApp' : require( 'System' ),
		'UserApp'   : require( 'User' )
	};

	return Marionette.Controller.extend( {

		initialize: function( options ) {
			this.App  = this.options.App;
			this.Vent = this.options.Vent;
			_.bindAll( this );

			return this;
		},

		showLogin: function( event ) {
			var loginLayout = new views.LoginLayout();
			var content = this.App.content;

			if ( !Reqres.request( 'sessionAuthenticated' ) ) {
				Session.token( {
					'success': function() {
						content.show( loginLayout );
					},
					'error': function() {
						// Show some error
					}
				} );
			} else {
				this.App.router.navigate( 'signup' );

			}
			this._setMenu();
		},
		/*
		showLogin : function( event ) {
			var loginLayout = new views.LoginLayout();
			this.App.content.show( loginLayout );
			this._setMenu();
		},
*/
		showSignup: function( event ) {
			var signupLayout = new views.SignupLayout();
			var content = this.App.content;

			Session.token( {
				'success': function() {
					content.show( signupLayout );
				}
			} );
			this._setMenu();
		},

		// sub applications bootstrap
		bootstrapSystemApp: function() {
			this.bootstrapApp( 'System', applications.SystemApp );
		},

		bootstrapUserApp: function() {
			this.bootstrapApp( 'User', applications.UserApp );
		},

		// app helper function
		bootstrapApp: function( appName, app ) {
			var self = this;

			if ( !self[ appName ] ) {
				self[ appName ] = app;
				self[ appName ].start( {
					'regions': {
						'content': self.App.content
					},
					'Vent': self.Vent
				} );
			}
		},
		_setMenu: function() {
			this.App.menu.show( new views.NavLayout() );
		}

	} );

} );