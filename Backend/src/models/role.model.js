import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/*
@fvillarrealcespedes:
Role model definition.
*/
const Role = new Schema({
    name: { type: String, required: true }
});

/*
@fvillarrealcespedes:
Exports the Role model.
*/
export default mongoose.model('roles', Role);