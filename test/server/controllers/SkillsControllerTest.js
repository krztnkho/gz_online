'use strict';

var fixtures = require( '../fixtures' );
var request;
var should = require( 'chai' ).should();


describe( 'REST - Skills', function() {
	var baseUrl = '/skills';

	before( function( done ) {

		fixtures.init( 'Skills', function( error, agent ) {
			request = agent;
			done();
		} );

	} );

	after( function( done ) {

		fixtures.deinit( 'Skills', function() {
			done();
		} );

	} );

	describe( 'GET', function() {
		var error, response, body;

		describe( 'get all skills', function() {
			before( function( done ) {
				request
					.get( baseUrl )
					.end( function( err, res ) {
						error = err;
						response = res;
						body = response.body;
						done();
					} );
			} );

			it( 'should return 200', function() {
				response.statusCode.should.equal( 200 );
			} );

			it( 'should be json', function() {
				response.should.be.json;
			} );



			it( 'should return an array', function() {
				body.should.be.an.instanceOf( Array );
			} );

		} );



		describe( 'get skill by id', function() {

			var skill = {
				'name': 'HTML',
				'description': 'Hypertext Markup Language'
			};

			before( function( done ) {
				request
					.post( baseUrl )
					.send( skill )
					.end( function( err, res ) {
						var id = res.body._id;
						request
							.get( baseUrl + '/' + id )
							.end( function( err, res ) {
								error = err;
								response = res;
								body = response.body;
								done();
							} );

					} );

			} );



			it( 'should return 200', function() {
				response.statusCode.should.equal( 200 );
			} );

			it( 'should be json', function() {
				response.should.be.json;
			} );

			it( 'should return an object', function() {
				body.should.be.a( 'object' );
			} );

			it( 'should return the correct properties', function() {
				body.should.have.property( '_id' );
				body.should.have.property( 'name' );
				body.should.have.property( 'description' );
				body.should.have.property( 'parent' );
				body.should.have.property( 'child' );
				body.should.have.property( 'exam' );
				body.should.have.property( 'version' );
				body.should.have.property( 'openStatus' );
			} );

		} );



	} );


	describe( 'POST', function() {
		describe( 'adding a new skill', function() {
			var skillUrl = baseUrl;
			var skill = {
				name: 'BackBone2',
				description: '..bb..'
			};
			var error;
			var response;
			var body;

			before( function( done ) {
				request
					.post( skillUrl )
					.send( skill )
					.end( function( err, res ) {
						error = err;
						response = res;
						body = response.body;
						done();
					} );
			} );


			it( 'should return 201', function() {
				response.statusCode.should.equal( 201 );
			} );

			it( 'should return json', function() {
				response.should.be.json;
			} );

			it( 'should return an object', function() {
				body.should.be.an( 'object' );
			} );
		} );

	} );


	describe( 'PUT', function() {

		var error;
		var response;
		var body;

		describe( 'update skill by id', function() {

			before( function( done ) {

				request
					.get( baseUrl )
					.end( function( err, res ) {
						error = err;
						response = res;
						body = response.body;
						var id = body[ 0 ]._id;

						request
							.put( baseUrl + '/' + id )
							.send( {
								'openStatus': 1
							} )
							.end( function( err, res ) {
								error = err;
								response = res;
								body = response.body;
								done();
							} );

					} );

			} );

			it( 'GET should return 200', function() {
				response.statusCode.should.equal( 200 );
			} );

			it( 'should be json', function() {
				response.should.be.json;
			} );

		} );

	} );



	describe( 'DELETE', function() {


		var error;
		var response;
		var body;

		describe( 'delete skill by id and its children', function() {

			before( function( done ) {

				request
					.get( baseUrl )
					.end( function( err, res ) {
						error = err;
						response = res;
						body = response.body;
						var id = body[ 0 ]._id;
						request
							.del( baseUrl + '/' + id )
							.end( function( err, res ) {
								error = err;
								response = res;
								body = response.body;
								done();
							} );
					} );
			} );

			it( ' should return 200', function() {
				response.statusCode.should.equal( 200 );
			} );


			it( 'should be JSON', function() {
				response.should.be.json;
			} );



		} );


	} );

} );