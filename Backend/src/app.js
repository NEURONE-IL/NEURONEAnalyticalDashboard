import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors'
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';
import authRoutes from './routes/auth.routes';
import classroomConfigurationRoutes from './routes/classroomConfiguration.routes';
import sessionSettingsRoutes from './routes/sessionSettings.routes';
import userRoutes from './routes/user.routes';
import User from './models/user.model';
import Role from './models/role.model';

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
and the ClassroomConfiguration, SessionSettings and User routes to access the CRUD operations of all models.
*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(authRoutes);
app.use(classroomConfigurationRoutes);
app.use(sessionSettingsRoutes);
app.use(userRoutes);

/*
@fvillarrealcespedes:
Defines the DB properties:
User, password, host, port and name, all of them imported from the .env file. 
The name property may vary depending on NODE_ENV variable.
*/
let dbName = process.env.DB_NAME;
if(process.env.NODE_ENV === 'test'){
  dbName = process.env.DB_TEST_NAME;
}

/*
@fvillarrealcespedes:
DB connection.
*/
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.HOST}:${process.env.DB_PORT}/${dbName}`, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  useFindAndModify: false 
})
  .then(() => {
    /*
    @fvillarrealcespedes:
    Message to verify the DB has started, not showed on test environment.
    */
    if(process.env.NODE_ENV !== 'test'){
      console.log('DB connected');
    }
    populateDatabase();
  })
  .catch(err => {
    console.error('DB connection error', err);
    process.exit(1);
  })
mongoose.set('debug', false);

/*
@fvillarrealcespedes:
Function to populate the DB when it has no documents on 'roles' or 'users' collections.
*/
async function populateDatabase(){
  /*Role collection*/
  await Role.estimatedDocumentCount((err, count) => {
    if(!err && count === 0){
      /*Creates 'admin' role*/
      const roleAdmin = new Role({
        name: 'admin'
      });
      /*Saves 'admin' role*/
      roleAdmin.save((err) => {
        if(err){
          console.log('Error on save roles', err);
        }
        if(process.env.NODE_ENV !== 'test'){
          console.log('"admin" added to roles collection');
        }
      });
      /*Creates 'user' role*/
      const roleUser = new Role({
        name: 'user'
      });
      /*Saves 'user' role*/
      roleUser.save((err) => {
        if(err){
          console.log('Error on save roles', err);
        }
        if(process.env.NODE_ENV !== 'test'){
          console.log('"user" added to roles collection');
        }
      });
    }
  });
  /*User collection*/
  await User.estimatedDocumentCount((err, count) => {
    if(!err && count === 0){
      /*Creates 'neuroneadadmin' user*/
      const user = new User({
        username: 'neuroneadadmin',
        password: bcryptjs.hashSync('neuronead2020', 8),
        email: 'admin@neuronead.com'
      });
      /*Saves 'neuroneadadmin' user*/
      user.save((err) => {
        if(err){
          console.log('Error on save "admin" user', err);
        }
        /*Assigns 'admin' role to 'neuroneadadmin' user*/
        Role.findOne({ name: 'admin' }, (err, role) => {
          if(err){
            console.log('Error on find "admin" role', err)
          }
          user.roles = [role._id];
          /*Saves 'neuroneadadmin' user roles assignation*/
          user.save(err => {
            if(err){
              console.log('Error on save "admin" user after roles assignment', err);
            }
            if(process.env.NODE_ENV !== 'test'){
              console.log('"neuroneadadmin" added to users collection');
            }
          });
        });
      });
    }
  });
}
 
/*
@fvillarrealcespedes:
Message to verify the app is running and the listening port, not showed on test environment..
*/
app.listen(port, () => {
  if(process.env.NODE_ENV !== 'test'){
    console.log(`Server on port ${port}`);
  }  
});

/*
@fvillarrealcespedes:
Exports the app, this way can be imported for test purposes.
*/
export default app;