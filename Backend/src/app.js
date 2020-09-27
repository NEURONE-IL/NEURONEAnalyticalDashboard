import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors'
import classroomConfigurationRoutes from './routes/classroomConfiguration';
import metricRoutes from './routes/metric';
import userRoutes from './routes/user';
import dotenv from 'dotenv';

/*
@fvillarrealcespedes:
Uses dotenv.config() to set enviroment variables for the app. 
*/
dotenv.config();

/*
@fvillarrealcespedes:
Creates a new express app, then defines the port.
*/
const app = express();
const port = process.env.NEURONE_AD_BACK_PORT || 4003;

/*
@fvillarrealcespedes:
Sets the frontend URL as the one and only allowed origin by CORS to send requests.
*/
var corsOptions = {
  origin: `http://${process.env.HOST}:${process.env.NEURONE_AD_FRONT_PORT}`
}

/*
@fvillarrealcespedes:
Sets the app components:
The bodyParser to receive requests in JSON format, the CORS to set the allowed origins to send requests 
and the ClassroomConfiguration, Metric and User routes to access the CRUD operations of both models.
*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(classroomConfigurationRoutes);
app.use(metricRoutes);
app.use(userRoutes);

/*
@fvillarrealcespedes:
Defines the DB properties:
User, password, host, port and name, all of them imported from the .env file.
*/
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, { 
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