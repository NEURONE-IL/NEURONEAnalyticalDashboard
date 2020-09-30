import express from 'express';
import controller from '../controllers/classroomConfiguration.controller';

const router = express.Router();

router.post('/classroom-configuration', controller.createClassroomConfiguration);
router.get('/classroom-configurations', controller.readClassroomConfiguration);
router.put('/classroom-configuration/:id', controller.updateClassroomConfiguration);
router.delete('/classroom-configuration/:id', controller.deleteClassroomConfiguration);
router.get('/classroom-configuration/:id', controller.readOneClassroomConfiguration);

export default router;