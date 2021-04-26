import express from 'express';
import controller from '../controllers/user.controller';
import authJwt from '../middlewares/authJwt';
import verifySignup from '../middlewares/verifySignup';

const router = express.Router();

/*
@fvillarrealcespedes:
Defines the controller method for each user CRUD operation and Login.
*/
/*For NEURONE-Auth requests*/
router.post('/auth/signup', controller.createUserNEURONEAuth);
/*For NEURONE-AD requests*/
router.post('/user', [verifySignup.checkDuplicateUsernameOrEmail, verifySignup.verifyRolesExists], controller.createUser);
router.get('/user', [authJwt.verifyToken], controller.readUsers);
router.put('/user/:id', [authJwt.verifyToken], controller.updateUser);
router.delete('/user/:id', [authJwt.verifyToken], controller.deleteUser);
router.get('/user/:id', [authJwt.verifyToken], controller.readOneUser);
router.post('/auth/login', controller.login);

/*
@fvillarrealcespedes:
Exports the seven routes defined.
*/
export default router;