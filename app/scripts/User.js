define( function( require ) {
	'use strict';

	// ## Import statements

	// Libs

	var Backbone   = require( 'backbone' );
	var Marionette = require( 'marionette' );

	// Project scripts
	var Router     = require( 'routers/UserRouter' );
	var Controller = require( 'controllers/UserController' );

	// App instantiation
	var App = new Marionette.Application();

	// ## Initializers
	// The regions for the application
	App.on( 'initialize:before', function( options ) {
		if ( options.regions ) {
			App.addRegions( options.regions );
		}
	} );

	// Session init
	App.addInitializer( function( options ) {
		if ( options.session ) {
			App.session = options.session;
		}
		if ( options.Vent ) {
			App.Vent = options.Vent;
		}
	} );

	App.addInitializer( function() {
		// Controller init
		App.Controller = new Controller( {
			//'session' : App.session,
			'App': App,
			'Vent': App.Vent
		} );

		// Router init
		App.Router = new Router( {
			'controller': App.Controller
		} );

	} );

	// Restart history for new router
	App.on( 'initialize:after', function() {
		if ( Backbone.History.started === true ) {
			Backbone.history.stop();
		}

		Backbone.history.start();
	} );

	return App;
} );