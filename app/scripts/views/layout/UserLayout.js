define( function( require ) {
	'use strict';

	var _ = require( 'underscore' );
	var Marionette = require( 'marionette' );
	var template = require( 'text!tmpl/layout/userLayout.html' );


	// Return a Layout class definition
	return Marionette.Layout.extend( {

		initialize: function( options ) {
			var self = this;

			_.bindAll( this );

			_.each( options, function( value, key ) {
				self[ key ] = value;
			} );

			return this;
		},

		template: _.template( template ),

		className: 'row',

		// Layout sub regions
		regions: {
			'menuRegion': '#menu-region',
			'contentRegion': '#content-region'
		},

		// ui selector cache
		ui: {},

		// Ui events hash
		events: {},

		// on render callback
		onRender: function() {}

	} );

} );