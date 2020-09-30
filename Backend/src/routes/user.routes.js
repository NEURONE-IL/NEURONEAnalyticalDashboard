import express from 'express';
import controller from '../controllers/user.controller';

const router = express.Router();

router.post('/auth/signup', controller.createUser);

export default router;