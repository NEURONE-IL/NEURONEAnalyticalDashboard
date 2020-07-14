import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ClassroomConfiguration = new Schema({
	name: String,
	createdBy: String,
	participants: Number,
	positions: [[Number, Number]],
	height: Number,
	width: Number
});

export default mongoose.model('classroomConfigurations', ClassroomConfiguration);