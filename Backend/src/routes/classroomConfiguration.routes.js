import express from 'express';
import controller from '../controllers/classroomConfiguration.controller';
import authJwt from '../middlewares/authJwt';

const router = express.Router();

/*
@fvillarrealcespedes:
Defines the controller method for each classroomConfiguration CRUD operation.
*/        
router.post('/classroom-configuration', [authJwt.verifyToken], controller.createClassroomConfiguration);
router.get('/classroom-configurations', [authJwt.verifyToken], controller.readClassroomConfigurations);
router.put('/classroom-configuration/:id', [authJwt.verifyToken], controller.updateClassroomConfiguration);
router.delete('/classroom-configuration/:id', [authJwt.verifyToken], controller.deleteClassroomConfiguration);
router.get('/classroom-configuration/:id', [authJwt.verifyToken], controller.readOneClassroomConfiguration);

/*
@fvillarrealcespedes:
Exports the five routes defined.
*/
export default router;