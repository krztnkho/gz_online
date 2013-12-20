var mongoose = require( 'mongoose' ),
	Schema      = mongoose.Schema;

var ExamSchema = new Schema( {
	name         : String,
	passingScore : Number,
	urlLink      : String,
	score        : Number
} );

module.exports = mongoose.model( 'Exam', ExamSchema );