define( function( require ) {
	'use strict';

	var Marionette = require( 'marionette' );

	return Marionette.AppRouter.extend( {
		'appRoutes': {
			'user/skills': 'showSkills',
			'user/colleagues': 'showColleagues',
			'user/profile': 'showProfile',
			'user/:id': 'showProfile',
			'user*action' : 'showProfile'
		}
	} );

} );