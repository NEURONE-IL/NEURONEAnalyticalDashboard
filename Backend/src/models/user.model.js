import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/*
@fvillarrealcespedes:
User model definition.
*/
const User = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    roles: { type: [mongoose.Schema.Types.ObjectId], ref: 'roles', required: true },
});

/*
@fvillarrealcespedes:
Exports the User model.
*/
export default mongoose.model('users', User);