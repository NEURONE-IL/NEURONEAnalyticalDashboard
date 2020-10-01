import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/*
@fvillarrealcespedes:
ClassroomConfiguration model definition.
*/
const ClassroomConfiguration = new Schema({
	name: { type: String, required: true },
	createdBy: { type: String, required: true },
	lastEditedBy: { type: String },
	participants: { type: Number, required: true },
	positions: { type: [[Number, Number]], required: true },
	height: { type: Number, required: true },
	width: { type: Number, required: true }
});

/*
@fvillarrealcespedes:
Exports the ClassroomConfiguration model.
*/
export default mongoose.model('classroomConfigurations', ClassroomConfiguration);