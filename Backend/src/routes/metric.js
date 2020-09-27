import express from 'express';
import Metric from '../models/metric';

const router = express.Router();

/*
@fvillarrealcespedes:
GET all Metrics from the DB.
*/
router.get('/metrics', async (req, res) => {
	const metrics = await Metric.find();
  res.send(metrics);
});

/*
@fvillarrealcespedes:
GET a specific Metric from the DB by the _id property.
*/
router.get('/metric/:id', async (req, res) => {
	const { id } = req.params;
	const metric = await Metric.findById({_id: id}, req.body);
	res.send(metric);
});

/*
@fvillarrealcespedes:
POST a new Metric in the DB.
*/
router.post('/metric', async (req, res) => {
	const metric = new Metric(req.body);
	await metric.save();
	res.send(metric);
});

/*
@fvillarrealcespedes:
PUT a Metric, first finds it by the _id property in the DB, then updates and stores again.
*/
router.put('/metric/:id', async (req, res) => {
	const { id } = req.params;
	const metric = await Metric.findByIdAndUpdate({_id: id}, req.body);
	res.send('Updated successfully');
})

/*
@fvillarrealcespedes:
DELETE a Metric from the DB by the _id property.
*/
router.delete('/metric/:id', async (req, res) => {
	const { id } = req.params;
	await Metric.deleteOne({_id: id})
	res.send('Deleted successfully');
});

/*
@fvillarrealcespedes:
Exports the five routes defined.
*/
export default router;