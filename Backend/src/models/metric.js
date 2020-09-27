import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/*
@fvillarrealcespedes:
Metric model definition.
*/
const Metric = new Schema({
	name: String,
    alias: String,
    description: String,
    dataType: String,
    max: Number,
    min: Number,
    interval: Number
});

/*
@fvillarrealcespedes:
Exports the Metric model.
*/
export default mongoose.model('metrics', Metric);