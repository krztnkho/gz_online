define( function( require ) {
	'use strict';

	var _ = require( 'underscore' );
	var Backbone = require( 'backbone' );
	var Marionette = require( 'marionette' );
	var template = require( 'text!tmpl/composite/userSkillNodeView.html' );

	return Backbone.Marionette.CompositeView.extend( {

		initialize: function() {
			this.collection = this.model.child;

		},
		appendHtml: function( collectionView, itemView ) {
			//itemView.

			collectionView.$( 'ul:first' ).append( itemView.el );
		},

		template: _.template( template ),
		tagName: 'li',

		ui: {},

		events: {},

		onRender: function() {
			if ( this.collection === undefined) {
				this.$( 'ul:first' ).remove();
			}
			var enabled = 'false';
			if ( this.model.attributes.openStatus === 1 ) {
				enabled = 'true';
				this.$el[0].firstElementChild.children[1].remove();
			}
			var highlight = this.model.attributes.highlight;
			this.$el[ 0 ].firstElementChild.setAttribute( 'enabled', enabled );
			this.$el[ 0 ].firstElementChild.setAttribute( 'highlight', highlight );

			if(highlight==='false'){
				this.$el[0].firstElementChild.children[1].remove();
			}

			if ( this.model.attributes.parent === null ) {
				this.$el[ 0 ].firstElementChild.setAttribute( 'highlight', 'true' );
			}


		}

	} );

} );