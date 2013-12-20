'use strict';

var express = require( 'express' );
var http    = require( 'http' );
var path    = require( 'path' );
var async   = require( 'async' );
var hbs     = require( 'express-hbs' );
var baucis  = require( 'baucis' );

var mongoose = require( 'mongoose' );
var config   = require( './config' ).configs;
var mongoURL = require( './config' ).mongoURL;

// start mongoose
mongoose.connect( mongoURL( config.mongodb ) );

var db = mongoose.connection;

db.on( 'error', console.error.bind( console, 'connection error:' ) );
db.once( 'open', function callback() {

	// REST Controllers
	require( './controllers/UsersController' )( baucis );
	require( './controllers/SkillsController' )( baucis );

	var app = express();

	app.configure( function() {
		app.set( 'port', config.port );

		app.set( 'view engine', 'handlebars' );
		app.set( 'views', __dirname + '../app/scripts/views' );
	} );

	app.use( express.cookieParser() );
	app.use( express.session( {
		'secret': 'macbook_dog'
	} ) );

	app.use( express.json() );
	app.use( config.rest, baucis( {
		swagger: true
	} ) );

	// simple log
	app.use( function( req, res, next ) {
		console.log( '%s %s', req.method, req.url );
		next();
	} );

	// mount static
	app.use( express.static( path.join( __dirname, '../app' ) ) );
	app.use( express.static( path.join( __dirname, '../.tmp' ) ) );


	// route index.html
	app.get( '/', function( req, res ) {
		res.sendfile( path.join( __dirname, '../app/index.html' ) );
	} );

	// start server
	http.createServer( app ).listen( app.get( 'port' ), function() {
		console.log( 'Express App started!' );
	} );
} );