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

export default mongoose.model('metrics', Metric);