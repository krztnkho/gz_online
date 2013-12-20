'use strict';

var Skill = require( '../schemas/SkillsSchema' );

module.exports = function( baucis ) {
	var controller = baucis.rest( {
		singular: 'Skill'
	} );


	controller[ 'delete' ]( '/:id', function( request, response, next ) {
			Skill.findById( request.params.id, function( err, result ) {
				if ( !err ) {
					var query = {
						'child': result._id
					};
					var update = {
						'$pull': query
					};

					Skill.findOneAndUpdate( query, update, function( err, doc ) {
						if ( !err ) {
							response.send(400, 'Error on delete subtree');
						}
						result.remove();
						response.send(200);
					} );
				}
			} );
			next();

		});

		return controller;
	};