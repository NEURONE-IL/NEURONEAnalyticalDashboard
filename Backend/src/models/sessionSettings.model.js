import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/*
@fvillarrealcespedes:
SessionSettings model definition.
*/
const SessionSettings = new Schema({
	name: String,
	metrics: [String],
    principal: String,
    interval: Number,
    option: String,
    limit: Number
});

/*
@fvillarrealcespedes:
Exports the SessionSettings model.
*/
export default mongoose.model('sessionSettings', SessionSettings);