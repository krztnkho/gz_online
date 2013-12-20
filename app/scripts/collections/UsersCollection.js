define( function( require ) {
	'use strict';

	var Backbone  = require( 'backbone' );
	var UserModel = require( 'models/UserModel' );
	var util      = require( 'util' );

	/* Return a collection class definition */
	return Backbone.Collection.extend( {
		initialize : function() {},
		model      : UserModel,
		'baucis'   : util.baucisFetch,
		'url'      : '/users'
	} );
} );