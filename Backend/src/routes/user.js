import express from 'express';
import User from '../models/user';

const router = express.Router();

/*
@fvillarrealcespedes:
POST a new User in the DB.
*/
router.post('/auth/signup', async (req, res) => {
	const user = new User(req.body);
	await user.save();
	res.send(user);
});

/*
@fvillarrealcespedes:
Exports the route defined.
*/
export default router;