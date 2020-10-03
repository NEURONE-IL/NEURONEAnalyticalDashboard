import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/*
@fvillarrealcespedes:
SessionSettings model definition.
*/
const SessionSettings = new Schema({
	name: { type: String, required: true },
	metrics: { type: [String], required: true },
    principal: { type: String, required: true },
    interval: { type: Number, required: true },
    option: { type: String },
    limit: { type: Number }
});

/*
@fvillarrealcespedes:
Exports the SessionSettings model.
*/
export default mongoose.model('sessionSettings', SessionSettings);