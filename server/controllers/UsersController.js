'use strict';

var csrf        = require( 'express' ).csrf;
var basicAuth   = require( '../middlewares/basicAuthentication' );
var sessionAuth = require( '../middlewares/sessionAuthentication' );
var User        = require( '../schemas/UsersSchema' );
var config      = require( '../config' ).configs;

module.exports = function( baucis ) {
	var controller = baucis.rest( {
		singular: 'User'
	} );

	// Middlewares
	controller.use( '/token', csrf() );
	controller.use( '/login', csrf() );
	controller.use( '/login', basicAuth() );
	controller.use( '/login', sessionAuth() );
	controller.use( '/signup', csrf() );
	controller.use( '/signup', basicAuth() );

	controller.query( 'collection', 'get', function( request, response, next ) {
		var query = request.baucis.query;
		// Show only the following fields
		query.select( 'email username fName lName role verified skills' );
		next();
	} );

	controller.request( 'collection', 'put', function( request, response, next ) {
		// Remove all password fields to avoid changing passwords in `/users/:id` route
		delete request.body.password;
		next();
	} );

	// Require session auth on following methods
	controller.request( 'collection', 'post put del', sessionAuth() );
	controller.request( 'instance', 'post put del', sessionAuth() );

	// Return CSRF token
	controller.get( '/token', function( request, response ) {
		if ( !request.csrfToken ) {
			return response.send( 403 );
		}
		response.send( 200, { '_csrf': request.csrfToken() } );
	} );

	// Need to refactor and use findByIdAndUpdate instead
	controller.put( '/password/:id', function( request, response ) {
		User.findById( request.params.id, function( error, user ) {

			if ( error ) {
				return response.send( 400, {
					'statusCode': 400,
					'type': 'Query Error',
					'message': error
				} );
			}

			if ( typeof user === 'undefined' ) {
				return response.send( 400, {
					'statusCode': 400,
					'type': 'Match',
					'message': 'Invalid Password'
				} );
			}

			delete user._id;
			delete user.__v;

			User.update( {
				_id: request.params.id
			}, { 'password': request.body.password }, function( error, numberAffected, raw ) {
				if ( error ) {
					return response.send( 400, {
						'statusCode': 400,
						'type': 'Query Error',
						'message': error
					} );
				}

				return response.send( 200, {
					'statusCode': 200,
					'type': 'Ok',
					'message': 'Password updated',
					'data': user,
					'numberAffected': numberAffected,
					'raw': raw
				} );
			} );

		} );

	} );

	controller.post( '/signup', function( request, response ) {
		User.create( request.body, function( error, doc ) {
			if ( error ) {
				return response.send( 500 );
			}
			doc.password = undefined;
			doc.salt = undefined;

			response.send( 201, doc );
		} );
	} );

	controller.get( '/login', function( request, response ) {
		if ( !request.body.email ) {
			return response.send( 500 );
		}

		User.findOne( {
			'email': request.body.email.trim()
		} ).lean().exec( function( err, doc ) {
			var user, valid;

			if ( err ) {
				return response.send( 500, err.message );
			}

			if ( !doc ) {
				return response.send( 401, 'Unauthorized' );
			}

			user = new User( doc );
			valid = user.isValidPassword( request.body.password );

			if ( valid ) {
				doc.password = undefined;
				doc.salt = undefined;
				doc.accessToken = request.authToken();
				response.send( 200, doc );
			} else {
				response.send( 404 );
			}

		} );

	} );

	return controller;
};