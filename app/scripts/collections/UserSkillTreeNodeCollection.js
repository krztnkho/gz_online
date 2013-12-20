define( function( require ) {
	'use strict';

	var Backbone = require( 'backbone' );
	var _ = require( 'underscore' );
	var util = require( 'util' );

	var UserSkillTreeNodeModel = Backbone.Model.extend( {
		'initialize': function() {
			//console.log(this.child);
			var child = this.get( 'children' );
			var value = this.get( 'openStatus' );

			if ( this.get( 'parent' ) === null ) {
				this.set( 'highlight', 'true');
			}

			if ( child ) {
				this.child = new UserSkillTreeNodeCollection( child );
				_.each( this.child.models, function( mdl ) {
					if ( value === 1 ) {
						mdl.set( 'highlight', 'true' );
					} else {
						mdl.set( 'highlight', 'false' );
					}

				} );
			}

		}
	} );

	var UserSkillTreeNodeCollection = Backbone.Collection.extend( {
		'model': UserSkillTreeNodeModel
	} );

	return UserSkillTreeNodeCollection;

} );