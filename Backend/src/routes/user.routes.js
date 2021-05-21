import express from 'express';
import controller from '../controllers/user.controller';
import authJwt from '../middlewares/authJwt';

const router = express.Router();

/*
@fvillarrealcespedes:
Defines the controller method for user Read, Update and Delete operations.
*/
router.get('/users', [authJwt.verifyToken], controller.readUsers);
router.put('/user/:id', [authJwt.verifyToken], controller.updateUser);
router.delete('/user/:id', [authJwt.verifyToken], controller.deleteUser);
router.get('/user/:id', [authJwt.verifyToken], controller.readOneUser);

/*
@fvillarrealcespedes:
Exports the four routes defined.
*/
export default router;