import express from 'express';
import controller from '../controllers/auth.controller';
import verifySignUp from '../middlewares/verifySignUp';

const router = express.Router();

/*
@fvillarrealcespedes:
Defines the controller method for Sign up and Log in operations.
*/
/*For NEURONE-Auth requests*/
router.post('/auth/signup', controller.signUpNEURONEAuth);
/*For NEURONE-AD requests*/
router.post('/auth/signup-ad', [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.verifyRolesExists], controller.signUpNEURONEAD);
router.post('/auth/login', controller.logIn);

/*
@fvillarrealcespedes:
Exports the three routes defined.
*/
export default router;