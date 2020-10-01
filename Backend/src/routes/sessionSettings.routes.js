import express from 'express';
import controller from '../controllers/sessionSettings.controller';

const router = express.Router();

/*
@fvillarrealcespedes:
Defines the controller method for each sessionSettings CRUD operation.
*/
router.post('/session-settings', controller.createSessionSettings);
router.get('/session-settings', controller.readSessionSettings);
router.put('/session-settings/:id', controller.updateSessionSettings);
router.delete('/session-settings/:id', controller.deleteSessionSettings);
router.get('/session-settings/:id', controller.readOneSessionSettings);

/*
@fvillarrealcespedes:
Exports the five routes defined.
*/
export default router;