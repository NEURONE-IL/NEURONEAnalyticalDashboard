import express from 'express';
import controller from '../controllers/sessionSettings.controller';
import authJwt from '../middlewares/authJwt';

const router = express.Router();

/*
@fvillarrealcespedes:
Defines the controller method for each sessionSettings CRUD operation.
*/
router.post('/session-settings', [authJwt.verifyToken], controller.createSessionSettings);
router.get('/session-settings', [authJwt.verifyToken], controller.readSessionSettings);
router.put('/session-settings/:id', [authJwt.verifyToken], controller.updateSessionSettings);
router.delete('/session-settings/:id', [authJwt.verifyToken], controller.deleteSessionSettings);
router.get('/session-settings/:id', [authJwt.verifyToken], controller.readOneSessionSettings);

/*
@fvillarrealcespedes:
Exports the five routes defined.
*/
export default router;