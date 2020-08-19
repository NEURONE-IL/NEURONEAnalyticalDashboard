import express from 'express';
import ClassroomConfiguration from '../models/classroomConfiguration';

const router = express.Router();

/*
@fvillarrealcespedes:
GET all ClassroomConfigurations from the DB.
*/
router.get('/classroom-configurations', async (req, res) => {
	const classroomConfigurations = await ClassroomConfiguration.find();
	res.send(classroomConfigurations);
});

/*
@fvillarrealcespedes:
GET a specific ClassroomConfiguration from the DB by the _id property.
*/
router.get('/classroom-configuration/:id', async (req, res) => {
	const { id } = req.params;
	const classroomConfiguration = await ClassroomConfiguration.findById({_id: id}, req.body);
	res.send(classroomConfiguration);
});

/*
@fvillarrealcespedes:
POST a new ClassroomConfiguration in the DB.
*/
router.post('/classroom-configuration', async (req, res) => {
	const classroomConfiguration = new ClassroomConfiguration(req.body);
	await classroomConfiguration.save();
	res.send(classroomConfiguration);
});

/*
@fvillarrealcespedes:
PUT a ClassroomConfiguration, first find it by the _id property in the DB, then updates and stores again.
*/
router.put('/classroom-configuration/:id', async (req, res) => {
	const { id } = req.params;
	const classroomConfiguration = await ClassroomConfiguration.findByIdAndUpdate({_id: id}, req.body);
	res.send('Updated successfully');
})

/*
@fvillarrealcespedes:
DELETE a ClassroomConfiguration from the DB by the _id property.
*/
router.delete('/classroom-configuration/:id', async (req, res) => {
	const { id } = req.params;
	await ClassroomConfiguration.deleteOne({_id: id})
	res.send('Deleted successfully');
});

/*
@fvillarrealcespedes:
Export the five routes defined.
*/
export default router;