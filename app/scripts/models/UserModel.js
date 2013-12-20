define( function( require ) {
	'use strict';

	var Backbone   = require( 'backbone' );
	var validation = require( 'backbone.validation' );
	var _          = require( 'underscore' );
	var util	= require('util');
	_.extend( Backbone.Model.prototype, validation.mixin );
	_.extend( validation.patterns, {
		email: /[a-zA-Z0-9]+\.[a-zA-Z0-9]+@globalzeal\.net/, // Accepts only globalzeal emails,
		password: /(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[^a-zA-Z]).{6,}/
	} );

	/* Return a model class definition */
	return Backbone.Model.extend( {
		'idAttribute': '_id',

		'initialize': function() {},

		'defaults': {},

		'validation': {
			'email': {
				'pattern': 'email',
				'required': true,
				'msg': 'Please enter a valid globalzeal email.'
			},

			'password': [ {
				'minLength': 6,
				'msg': 'Password length should be at least 6 characters.'
			}, {
				'pattern': 'password',
				'msg': 'Password should contain at least 1 lowercase, 1 uppercase and 1 numeric character.'
			} ]
		},

		'url': function() {
			if ( this.isNew() ) {
				return '/users';
			} else {
				return '/users/' + this.id;
			}
		},
		'baucis' : util.baucisFetch

	} );
} );