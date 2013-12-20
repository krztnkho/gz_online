define( function( require ) {
	'use strict';

	var _ = require( 'underscore' );
	var $ = require( 'jquery' );
	var Marionette = require( 'marionette' );
	var template = require( 'text!tmpl/item/userProfileView.html' );

	// Return a ItemView class definition
	return Marionette.ItemView.extend( {

		initialize : function ( options ) {
			var self = this;

			_.bindAll( this );

			_.each( options, function ( value, key ) {
				self[ key ] = value;
			} );

			return this;
		},

		template : _.template( template ),

		tagName: 'tr',
		//className : 'panel panel-warning',

		// ui selector cache
		ui : {
		},

		// Ui events hash
		events : {
		},

		// on render callback
		onRender : function () {
		}

	} );

} );