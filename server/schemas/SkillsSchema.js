'use strict';

var _ = require( 'underscore' ),
	mongoose = require( 'mongoose' ),
	Schema = mongoose.Schema;
var SkillSchema = new Schema( {

	'name': String,

	'description': {
		'type': String,
		'default': ''
	},

	'child': [ {
		'type': Schema.Types.ObjectId
		// ,ref: Skill
	} ],

	'parent': {
		'type': Schema.Types.ObjectId,
		'default': null
		// ,ref: Skill
	},

	'openStatus': {
		'type': Number,
		'default': 0
	},

	'exam': {
		'type': Schema.Types.ObjectId,
		'default': null
		// ,ref: Exam
	},

	'version': {
		'type': Number,
		'default': 0
	}

}, {

	'versionKey': 'version'

} );



var Skill = mongoose.model( 'Skill', SkillSchema );
/*
THis will run on save, do parent update set default values
*/
SkillSchema.pre( 'save', function( next ) {
	var self = this;
	self.description = self.description || '';
	self.child = [];
	self.exam = null;
	self.version = 0;
	self.openStatus = 0;

	Skill.findOneAndUpdate( {
		_id: self.parent
	}, {
		$push: {
			child: self._id
		}
	}, function( err, parentSkill ) {
		if ( err !== null ) {
			self.parent = null; //parent not found set to null
		}

	} );


	next();
} );

/*
this will run when a model is deleted.
-it will delete all children
-it will update parent's child
*/
SkillSchema.pre( 'remove', function( next ) {

	var self = this;

	Skill.find( {
		parent: self._id
	}, function( err, docs ) {
		_.each( docs, function( doc ) {
			doc.remove();
		} );
	} );

	next();
} );


module.exports = Skill;