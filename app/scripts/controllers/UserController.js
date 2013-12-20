define( function( require ) {
	'use strict';

	var _ = require( 'underscore' );
	var $ = require( 'jquery' );
	var Backbone = require( 'backbone' );
	var Marionette = require( 'marionette' );
	var async = require( 'async' );
	var Session = require('models/SessionModel');
	// require models
	var models = {
		'User': require( 'models/UserModel' )
		// 'Session': require('models/SessionModel')
	};

	// require collections
	var collections = {
		'Users': require( 'collections/UsersCollection' ),
		'UserSkillTreeNodeCollection': require( 'collections/UserSkillTreeNodeCollection' ),
		'SkillsCollection': require( 'collections/SkillsCollection' )
	};

	// require layouts
	var layouts = {
		'User': require( 'views/layout/UserLayout' )
	};

	// require views
	var views = {
		//UserMenuView: require( 'views/item/UserMenuView' ),
		//UserSkillView: require( 'views/item/UserSkillView' ),
		UserContentsView: require( 'views/composite/UserContentsView' ),
		UserColleaguesView: require( 'views/item/UserColleaguesView' ),

		'UserMenuView': require( 'views/item/UserMenuView' ),
		'UserSkillContentsView': require( 'views/composite/UserSkillContentsView' ),
		'UserSkillTreeView': require( 'views/composite/UserSkillTreeView' ),
		'UserSkillTreeRoot': require( 'views/collection/UserSkillTreeRoot' ),
		//for user profile delete lang ni inig abot kang francis
		'UserProfileContentsView': require( 'views/composite/UserProfileContentsView' ),
		'UserProfileView': require( 'views/item/UserProfileView' )
	};
	var globalVars = {
		_id: '52b1481732ff9dc511000001',
		_users: null
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
		_getUserSkills: function( id, next ) {
			var User = new models.User();
			var result;
			User.baucis( {
				'conditions': {
					'_id': id
				}
			} ).then( function( response ) {
				if ( response[ 0 ] !== undefined && response[ 0 ].skills ) {
					result = ( response[ 0 ].skills );
				} else {
					result = [];
				}
				next( result );
			} );

		},
		_getAdminSkillTemplate: function( skills, next ) {
			var self = this;
			var SkillsCollection = new collections.SkillsCollection();
			var skillTreeTemplate;
			SkillsCollection.baucis().then( function( collection, response ) {
				if ( response === 'success' ) {
					skillTreeTemplate = self._buildJSONSkillTree( null, collection, [], skills );
				} else {
					skillTreeTemplate = [];
				}
				next( skillTreeTemplate );
			} );
		},
		_countUserSkills: function( id, next ) {
			var User = new models.User();
			User.baucis( {
				'conditions': {
					'_id': id
				}
			} ).then( function( response ) {
				var count = response[ 0 ].skills.length || 0;
				next(count);
			} );
		},
		showSkills: function() {
			this._setActiveMenu();
			var self = this;
		var id = Session.get('_id');

			async.waterfall( [
				//TODO: get the id of user later
				//this is the userSkills send userID sample: '52b01616938423a614000008'
				function( callback ) {
					// Code
					self._getUserSkills( id, function( skills ) {
						callback( null, skills );
					} );
				},
				//this is the skilltreetemplate (template of all the skills)
				function( skills, callback ) {
					// Code
					self._getAdminSkillTemplate( skills, function( treeTemplate ) {
						var results = [];
						results[ 0 ] = treeTemplate;
						if ( treeTemplate.length === 0 ) {

							results[ 1 ] = '<br/>&nbsp;<span class="glyphicon glyphicon-wrench"></span>&nbsp;&nbsp;No skill tree available yet.';
						}
						callback( null, results );
					} );

				}


			], function( error, output ) {
				// Code
				//TODO : compare skillTreeTemplate vs userSkill and change status to a method

				var User = new models.User( {
					selectedMenu: 'Skills',
					msg: output[ 1 ]
				} );
				var skillTree = new collections.UserSkillTreeNodeCollection( output[ 0 ] );
				var skillTreeView = new views.UserSkillTreeRoot( {
					collection: skillTree
				} );

				var view = new views.UserSkillContentsView( {
					model: User,
					collection: skillTree,
					itemView: views.UserSkillTreeView
				} );

				self.layout.contentRegion.show( view );
			} );

		},

		showColleagues: function() {
			this._setActiveMenu();

			//Sample id. This should be taken from the currently logged in user.
			//var users = this._getUsers();

			var User = new models.User( {
				selectedMenu: 'Colleagues'
			} );

			var self = this;
			var id = Session.get('_id');

			var users = [];
			User.fetch( {
				'success': function( model, response, options ) {
					for ( var key in response ) {
						users.push( response[ key ] );
					}

					users = _.without( users, _.findWhere( users, {
						'_id': id
					} ) );

					_.each( users, function( u ) {
						if ( u && u.registrationDate ) {
							u.registrationDate = new Date( Date.parse( u.registrationDate ) );
						}
					} );

					var view = new views.UserContentsView( {
						model: User,
						collection: new collections.Users( users ),
						itemView: views.UserColleaguesView
					} );

					self.layout.contentRegion.show( view );
				},
				'error': function() {
					return null;
				}
			} );


		},

		_getLayout: function() {
			var userLayout = new layouts.User();
			this.listenTo( userLayout, 'render', function() {
				this._showMenuAndContent( userLayout );
			}, this );

			return userLayout;
		},

		_showMenuAndContent: function() {
			this._addMenu( this.layout.menuRegion );
			this._updateMenuBadgeCount();

		},
		_addMenu: function() {
			var self = this;


			//TODO: get ID from session
			self.menuModel = new models.User( {
				'colleaguesCtr': 0,
				'skillsCtr': 0
			} );

			self.menu = new views.UserMenuView( {
				model: self.menuModel
			} );

			self.layout.menuRegion.show( self.menu );
		},
		_getUserInfo: function( id, next ) {
			var User = new models.User();
			User.baucis( {
				'conditions': {
					'_id': id
				}
			} ).then( function( userinfo ) {

				var res = userinfo[ 0 ] || {
					fName: 'test',
					lName: 'test'
				};
				next( res );

			} );
		},
		showProfile: function() {
			this._setActiveMenu();
			var self = this;
			//TODO: get session id for globals.testId


			var id = Session.get('_id');
			async.waterfall( [

				function( callback ) {
					self._getUserInfo( Session.get('_id'), function( userdata ) {
						var User = new models.User( {
							'selectedMenu': 'Profile Information',
							'fName': userdata.fName,
							'lName': userdata.lName

						} );
						callback( null, User );
					} );

				},
				function( User, callback ) {
					self._getUserSkills( Session.get('_id'), function( skills ) {
						callback( null, User, skills );
					} );
				},
				function( User, userInfo, callback ) {
					var view = new views.UserProfileContentsView( {
						model: User,
						collection: new collections.Users( userInfo ),
						itemView: views.UserProfileView
					} );
					callback( null, view );
				}

			], function( err, view ) {
				self.layout.contentRegion.show( view );
			} );
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

		},
		_buildJSONSkillTree: function( parentId, skillCollection, skillTree, skills ) {
			_.each( skillCollection, function( element, index, list ) {
				_.each( skills, function( skill ) {
					if ( element.name === skill.name ) {
						element.openStatus = skill.openStatus;
					}
				} );
				if ( element.parent === null ) {
					skillTree.push( element );
				} else {
					var parent = _.findWhere( list, {
						_id: element.parent
					} );

					if ( !parent.children ) {
						_.extend( parent, {
							children: []
						} );
					}

					parent.children.push( element );
				}
			} );
			skillTree = JSON.parse( JSON.stringify( skillTree ) );
			return skillTree;
		},
		_updateMenuBadgeCount: function() {
			var self = this;
				var id = Session.get('_id');

			//this.menuModel
			self._countUserSkills( id, function( count ) {
				self.menuModel.set( {
					'skillsCtr': count
				} );
			} );
		}
	} );
} );