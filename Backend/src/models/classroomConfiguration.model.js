import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/*
@fvillarrealcespedes:
ClassroomConfiguration model definition.
*/
const ClassroomConfiguration = new Schema({
	name: String,
	createdBy: String,
	participants: Number,
	positions: [[Number, Number]],
	height: Number,
	width: Number
});

/*
@fvillarrealcespedes:
Exports the ClassroomConfiguration model.
*/
export default mongoose.model('classroomConfigurations', ClassroomConfiguration);