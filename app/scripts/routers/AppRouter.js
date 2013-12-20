define( function( require ) {
	'use strict';

	var Marionette = require( 'marionette' );

	return Marionette.AppRouter.extend( {
		'appRoutes': {
			'system*actions' : 'bootstrapSystemApp',
			'user*actions'   : 'bootstrapUserApp',
			'login'          : 'showLogin',
			'signup'         : 'showSignup',
			''               : 'showLogin'
		}
	} );

} );
