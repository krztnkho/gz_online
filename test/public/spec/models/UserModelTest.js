define( function( require ) {
	'use strict';

	var UserModel    = require( 'models/UserModel' );
	var LocalStorage = require( 'backbone.localStorage' );
	var _            = require( 'underscore' );
	var User;

	describe( 'UserModel', function() {

		before( function() {
			User = UserModel.extend( {
				localStorage: new LocalStorage( 'user-model' )
			} );
		} );

		it( 'should be an instance of UserModel', function() {
			var userModel = new User();
			userModel.should.be.an.instanceof( UserModel );
		} );

		it( 'should save', function( done ) {
			var user = new User( {
				'_id': 1,
				'email': 'test.foo@globalzeal.net',
				'password': 'Testpass1',
				'fname': 'Foo',
				'lname': 'Bar'
			} );

			user.save( null, {
				success: function( model, response ) {
					expect( model.get( 'fname' ) ).to.equal( 'Foo' );
					expect( model.get( 'lname' ) ).to.equal( 'Bar' );

					done();
				}
			} );

		} );

		it( 'should fetch', function( done ) {
			var user = new User( {
				'_id': 1
			} );

			user.fetch( {
				'success': function( model, response ) {
					expect( model.get( 'fname' ) ).to.equal( 'Foo' );
					expect( model.get( 'lname' ) ).to.equal( 'Bar' );

					done();
				}
			} );

		} );

		describe( 'Validation', function() {
			var user;

			beforeEach( function() {
				// Valid user attributes
				user = new User( {
					'_id': 2,
					'email': 'test.foo@globalzeal.net',
					'password': 'Testpass123'
				} );
			} );

			afterEach( function() {
				user.destroy();
			} );

			it( 'should not save if email is invalid', function( done ) {
				user.save( {
					'email': 'test@foo'
				} );

				user.fetch( {
					'success': function( model ) {
						done( new Error( 'Was saved' ) );
					},

					'error': function( model, response ) {
						expect( response ).to.equal( 'Record Not Found' );

						done();
					}
				} );

			} );

			it( 'should not save if email is not a globalzeal account', function( done ) {
				user.save( {
					'email': 'test.foo@globalzeal.com'
				} );

				user.fetch( {
					'success': function( model ) {
						done( new Error( 'Was saved' ) );
					},

					'error': function( model, response ) {
						expect( response ).to.equal( 'Record Not Found' );

						done();
					}
				} );

			} );

			it( 'should not save if password does not meet length of 6 characters', function( done ) {
				user.save( {
					'password': '12345'
				} );

				user.fetch( {
					'success': function( model ) {
						done( new Error( 'Was saved' ) );
					},

					'error': function( model, response ) {
						expect( response ).to.equal( 'Record Not Found' );

						done();
					}
				} );

			} );

			it( 'should not save if password does not have integer as characters', function( done ) {
				user.save( {
					'password': 'testpass'
				} );

				user.fetch( {
					'success': function( model ) {
						done( new Error( 'Was saved' ) );
					},

					'error': function( model, response ) {
						expect( response ).to.equal( 'Record Not Found' );

						done();
					}
				} );

			} );

			it( 'should not save if password does not have uppercase characters', function( done ) {
				user.save( {
					'password': 'testpass123'
				} );

				user.fetch( {
					'success': function( model ) {
						done( new Error( 'Was saved' ) );
					},

					'error': function( model, response ) {
						expect( response ).to.equal( 'Record Not Found' );

						done();
					}
				} );

			} );

			it( 'should not save if password does not have lowercase characters', function( done ) {
				user.save( {
					'password': 'TESTPASS123'
				} );

				user.fetch( {
					'success': function( model ) {
						done( new Error( 'Was saved' ) );
					},

					'error': function( model, response ) {
						expect( response ).to.equal( 'Record Not Found' );

						done();
					}
				} );

			} );

			it( 'should emit `validated:invalid` if set with invalid attributes', function( done ) {
				user.set( {
					'email': 'test@foo'
				}, {
					validate: true
				} );

				user.on( 'validated:invalid', function( model, errors ) {
					done();
				} );

			} );

		} );

	} );

} );