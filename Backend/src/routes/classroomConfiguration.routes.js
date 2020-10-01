import express from 'express';
import controller from '../controllers/classroomConfiguration.controller';

const router = express.Router();

/*
@fvillarrealcespedes:
Defines the controller method for each classroomConfiguration CRUD operation.
*/        
router.post('/classroom-configuration', controller.createClassroomConfiguration);
router.get('/classroom-configurations', controller.readClassroomConfigurations);
router.put('/classroom-configuration/:id', controller.updateClassroomConfiguration);
router.delete('/classroom-configuration/:id', controller.deleteClassroomConfiguration);
router.get('/classroom-configuration/:id', controller.readOneClassroomConfiguration);

/*
@fvillarrealcespedes:
Exports the five routes defined.
*/
export default router;