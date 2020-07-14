import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors'
import classroomConfigurationRoutes from './routes/classroomConfiguration';

const app = express();
const port = process.env.PORT || 4003;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(classroomConfigurationRoutes);

const host = process.env.MONGO_DB || 'localhost';
mongoose.connect(`mongodb://test:test@${host}:27017/test`, { useNewUrlParser: true, useUnifiedTopology: true,})
  .then(() => {
    console.log('DB Started');
  })
  .catch(err => {
    process.exit(1);
  })
mongoose.set('debug', false);

app.listen(port, () => {
  console.log(`Server on port ${port}`);
})
