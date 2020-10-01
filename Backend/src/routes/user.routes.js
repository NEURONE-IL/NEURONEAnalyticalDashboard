import express from 'express';
import controller from '../controllers/user.controller';

const router = express.Router();

/*
@fvillarrealcespedes:
Defines the controller method for user POST operation.
*/
router.post('/auth/signup', controller.createUser);

/*
@fvillarrealcespedes:
Exports the route defined.
*/
export default router;