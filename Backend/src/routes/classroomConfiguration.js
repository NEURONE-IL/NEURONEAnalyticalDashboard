import express from 'express';
import ClassroomConfiguration from '../models/classroomConfiguration';

const router = express.Router();

router.get('/classroom-configurations', async (req, res) => {
	const classroomConfigurations = await ClassroomConfiguration.find();
  res.send(classroomConfigurations);
});

router.post('/classroom-configuration', async (req, res) => {
	const classroomConfiguration = new ClassroomConfiguration(req.body);
	await classroomConfiguration.save();
	res.send(classroomConfiguration);
});

router.put('/classroom-configuration/:id', async (req, res) => {
	const { id } = req.params;
	const classroomConfiguration = await ClassroomConfiguration.findByIdAndUpdate({_id: id}, req.body);
	res.send('Updated successfully');
})

router.delete('/classroom-configuration/:id', async (req, res) => {
	const { id } = req.params;
	console.log(id);
	await ClassroomConfiguration.deleteOne({_id: id})
	res.send('Deleted successfully');
});

export default router;