'use strict';

var mongoose = require( 'mongoose' );
var uuid = require( 'node-uuid' );
var crypto = require( 'crypto' );
var check = require( 'validator' ).check;
var sanitize = require( 'validator' ).sanitize;
var Schema = mongoose.Schema;


var UserSchema = new mongoose.Schema( {
	'email': {
		'type': String,
		'required': true
	},
	'username': {
		'type': String
	},
	'password': {
		'type': String,
		'required': true
	},

	'fName'            : String,
	'lName'            : String,
	'skills'           : Array,
	'role'             : String,
	'verified'         : Number,
	'salt'             : String,
	'registrationDate' : Date
	/*,'skills'           : [{
		'type' : mongoose.Schema.Types.Mixed
	}]*/
} );

// - Hashing passwords refer to this: http://davybrion.com/blog/2012/01/stop-storing-passwords-already/
// - More info here: https://crackstation.net/hashing-security.htm
var hash = function( password, salt ) {
	return crypto.createHmac( 'sha256', salt ).update( password ).digest( 'hex' );
};

UserSchema.methods.setPassword = function( passwordPlain ) {
	if ( !this.salt ) {
		this.salt = uuid.v4();
	}
	this.passwordHash = hash( passwordPlain, this.salt );
};

UserSchema.methods.returnPassword = function( passwordPlain ) {
	return hash( passwordPlain, this.salt );
};

UserSchema.methods.isValidPassword = function( passwordPlain ) {
	return this.password === hash( passwordPlain, this.salt );
};

UserSchema.pre( 'validate', function( next ) {
	try {
		check( sanitize( this.email ).trim() ).isEmail();
		check( sanitize( this.password ).trim() ).len( 6 );
	} catch ( error ) {
		return next( error );
	}
	next();
} );

UserSchema.pre( 'save', function( next ) {
	var emailArray;
	var domain;

	emailArray = this.email.split( '@' );
	domain = emailArray[ emailArray.length - 1 ];

	if ( domain !== 'globalzeal.net' ) {
		next( new Error( 'Invalid email account.' ) );
	}

	if ( !this.username ) {
		this.username = emailArray[ 0 ];
	}

	if ( !this.salt ) {
		this.salt = uuid.v4();
	}

	this.password = hash( this.password, this.salt );

	next();
} );

module.exports = mongoose.model( 'User', UserSchema );