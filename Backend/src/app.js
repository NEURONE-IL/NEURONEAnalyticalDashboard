import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors'
import classroomConfigurationRoutes from './routes/classroomConfiguration';
import metricsRoutes from './routes/metric';

/*
@fvillarrealcespedes:
Create a new express app, then defines the port.
*/
const app = express();
const port = process.env.PORT || 4003;

/*
@fvillarrealcespedes:
Set the app components:
The bodyParser to receive requests in JSON format, the CORS to define the allowed ports to send requests 
and the ClassroomConfiguration and Metrics routes to access the CRUD operations of both models.
*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(classroomConfigurationRoutes);
app.use(metricsRoutes);

/*
@fvillarrealcespedes:
Define the DB properties:
The host, user, password, port and DB itself.
*/
const host = process.env.MONGO_DB || 'localhost';
mongoose.connect(`mongodb://admin:admin@${host}:27017/neurone-ad`, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  useFindAndModify: false 
})
  .then(() => {
    /*
    @fvillarrealcespedes:
    Message to verify the DB has started.
    */    
    console.log('DB Started');
  })
  .catch(err => {
    process.exit(1);
  })
mongoose.set('debug', false);

/*
@fvillarrealcespedes:
Message to verify the app is running and the listening port.
*/
app.listen(port, () => {
  console.log(`Server on port ${port}`);
})