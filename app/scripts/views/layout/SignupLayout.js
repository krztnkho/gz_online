define( function( require ) {
	'use strict';

	var _          = require( 'underscore' );
	var Spinner    = require( 'spinjs' );
	var Backbone   = require( 'backbone' );
	var Marionette = require( 'marionette' );

	var Vent            = require( 'Vent' );
	var RequestResponse = require('RequestResponse');

	var Session   = require( 'models/SessionModel');
	var UserModel = require( 'models/UserModel' );

	var ErrorView        = require( 'views/ErrorView' );
	var SignupLayoutTmpl = require( 'text!tmpl/views/layout/SignupLayout_tmpl.html' );

	/* Return a ItemView class definition */
	return Marionette.Layout.extend( {

		'initialize': function() {
			this.on( 'ajaxSpinner', this.ajaxSpinner );

			var opts = {
				lines     : 13, // The number of lines to draw
				length    : 0, // The length of each line
				width     : 10, // The line thickness
				radius    : 25, // The radius of the inner circle
				corners   : 1, // Corner roundness (0..1)
				rotate    : 0, // The rotation offset
				direction : 1, // 1: clockwise, -1: counterclockwise
				color     : '#000', // #rgb or #rrggbb or array of colors
				speed     : 2, // Rounds per second
				trail     : 60, // Afterglow percentage
				shadow    : false, // Whether to render a shadow
				hwaccel   : false, // Whether to use hardware acceleration
				className : 'spinner', // The CSS class to assign to the spinner
				zIndex    : 2e9, // The z-index (defaults to 2000000000)
				top       : 'auto', // Top position relative to parent in px
				left      : 'auto' // Left position relative to parent in px
			};

			this.spinner = new Spinner( opts );
		},

		'template': _.template( SignupLayoutTmpl ),

		'regions': {
			'emailError': '#email-error',
			'passwordError': '#password-error'
		},

		/* ui selector cache */
		'ui': {
			'email': '#input-email',
			'password': '#input-password',
			'verifyPassword': '#input-verify-password'
		},

		/* Ui events hash */
		'events': {
			'submit': 'createUser'
		},

		'createUser': function( event ) {
			event.preventDefault();

			var self = this;
			var options = {};
			var user;

			this.regionManager.each( function( region ) {
				region.close();
			} );

			var email = this.ui.email.val();
			var password = this.ui.password.val();
			var verifyPassword = this.ui.verifyPassword.val();

			if ( password === verifyPassword ) {
				user = new UserModel();

				user.set( {
					'email': email,
					'password': password
				}, {
					'validate': true
				} );

				user.on( 'validated:valid', function() {
					self.trigger( 'ajaxSpinner', {
						'spin': true
					} );

					Session.fetch( {
						'email'    : user.get( 'email' ),
						'password' : user.get( 'password' ),
						'signup'   : true,
						'error'    : function() {
							self.trigger( 'ajaxSpinner', { 'spin': false } );
						}
					} );
				} );

				user.on( 'validated:invalid', function( model, errors ) {
					self.trigger( 'SignupLayout:error', errors );

					_.each( errors, function( message, attr ) {
						self._setErrors( attr, message );
					} );
				} );
			} else {
				this._setErrors( 'password', 'Password does not match.' );
			}
		},

		'ajaxSpinner': function( opts ) {
			if ( opts.spin ) {
				var elem = this.spinner.spin();
				this.$el.find( '.account-wall' ).append( elem.el )
					.css( { 'opacity': 0.5 } );
				this.$el.find( '.spinner' ).css( {
					'position': 'absolute',
					'top': '50%',
					'left': '50%'
				} );

				this.$el.find( '#submit' ).attr( 'disabled', '' );
			} else {
				this.spinner.stop();
				this.$el.find( '#submit' ).removeAttr( 'disabled' );
			}
		},

		'_setErrors': function( attr, message ) {
			var view = this[ attr + 'Error' ];

			if ( view instanceof Marionette.Region ) {
				var error = {
					'message': message
				};

				view.show( new ErrorView( {
					model: new Backbone.Model( error )
				} ) );
			}
		},

		/* on render callback */
		'onRender': function() {}

	} );

} );