define( function( require ) {
	'use strict';

	var _ = require( 'underscore' );
	var $ = require( 'jquery' );
	var Backbone = require( 'backbone' );
	var Marionette = require( 'marionette' );

	// require models
	var models = {
		User: require( 'models/UserModel' )
		//Skills : require('models/SkillModel'),
	};

	// require collections
	var collections = {
		Users: require( 'collections/UsersCollection' )
	};

	// require layouts
	var layouts = {
		System: require( 'views/layout/SystemLayout' )
	};

	// require views
	var views = {
		SystemMenuView: require( 'views/item/SystemMenuView' ),
		SystemContentsView: require( 'views/composite/SystemContentsView' ),
		SystemUserView: require( 'views/item/SystemUserView' ),
		SystemAssessorView: require( 'views/item/SystemAssessorView' ),
		SystemSkillView: require( 'views/item/SystemSkillView' )
	};

	return Marionette.Controller.extend( {
		initialize: function( options ) {
			var self = this;

			_.bindAll( this );

			_.each( options, function( value, key ) {
				self[ key ] = value;
			} );

			this.showDefault();

			return this;
		},

		showDefault: function() {
			this.layout = this._getLayout();
			this.App.content.show( this.layout );
		},

		showUsers: function() {
			this._setActiveMenu();
			var self = this;
			var User = new models.User( {
				selectedMenu: 'Users'
			} );

			var Users = new collections.Users();

			// var self = this;

			Users.baucis( {
				'conditions': {
					'role': 2
				}
			} ).then( function( response ) {
				var view = new views.SystemContentsView( {
					model: User,
					collection: new collections.Users( response ),
					itemView: views.SystemUserView
				} );

				self.layout.contentRegion.show( view );
			} );
		},

		showAssessors: function() {
			this._setActiveMenu();

			var assessors = [ {
				_id: 0,
				fName: 'James',
				lName: 'Santos'
			}, {
				_id: 1,
				fName: 'Elizar',
				lName: 'Pepino'
			}, {
				_id: 2,
				fName: 'George',
				lName: 'Cordero'
			} ];

			var User = new models.User( {
				selectedMenu: 'Assessors'
			} );

			var view = new views.SystemContentsView( {
				model: User,
				collection: new collections.Users( assessors ),
				itemView: views.SystemAssessorView
			} );

			this.layout.contentRegion.show( view );
		},

		showSkills: function() {
			this._setActiveMenu();

			var User = new models.User( {
				selectedMenu: 'Skills'
			} );

			var view = new views.SystemContentsView( {
				model: User,
				collection: new collections.Users(),
				itemView: views.SystemSkillView
			} );

			this.layout.contentRegion.show( view );
		},

		_getLayout: function() {
			var systemLayout = new layouts.System();

			this.listenTo( systemLayout, 'render', function() {
				this._showMenuAndContent( systemLayout );
			}, this );

			return systemLayout;
		},

		_showMenuAndContent: function() {
			this._addMenu( this.layout.menuRegion );

			this.showUsers( this.layout.contentRegion, 'Users' );
		},

		_addMenu: function() {
			var User = new models.User( {
				usersCtr: 3,
				assessorsCtr: 3,
				skillsCtr: 3
			} );

			this.menu = new views.SystemMenuView( {
				model: User
			} );

			this.layout.menuRegion.show( this.menu );
		},

		_setActiveMenu: function() {
			var currentRoute = '#' + Backbone.history.fragment;
			var menuOptions = this.menu.ui.menuOptions;
			var hashes = [];

			menuOptions.parent().siblings().removeClass( 'active' );

			_.each( menuOptions, function( value, key ) {
				hashes.push( value.hash );

				if ( currentRoute === value.hash ) {
					$( menuOptions[ key ] ).parent().addClass( 'active' );
				}
			} );

			// Set default active menu if current route has no match in the options hashes
			if ( $.inArray( currentRoute, hashes ) === -1 ) {
				$( menuOptions[ 0 ] ).parent().addClass( 'active' );
			}
		}

	} );

} );