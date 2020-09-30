import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/*
@fvillarrealcespedes:
User model definition.
*/
const User = new Schema({
    username: String,
    email: String,
    roles: [String]
});

/*
@fvillarrealcespedes:
Exports the User model.
*/
export default mongoose.model('users', User);