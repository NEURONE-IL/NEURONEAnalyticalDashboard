import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/*
@fvillarrealcespedes:
User model definition.
*/
const User = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    roles: { type: [String], required: true },
});

/*
@fvillarrealcespedes:
Exports the User model.
*/
export default mongoose.model('users', User);