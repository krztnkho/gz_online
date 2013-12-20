define( function( require ) {
	'use strict';

	var _             = require( 'underscore' );
	var Backbone      = require( 'backbone' );
	var Marionette    = require( 'marionette' );
	var SkillTreeView = require( 'views/composite/UserSkillTreeView' );

	return Backbone.Marionette.CollectionView.extend( {

		itemView: SkillTreeView

	} );

} );