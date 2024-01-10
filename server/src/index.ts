import express from 'express';
import mongoose from 'mongoose';
const cors = require('cors');
import { userRouter } from './router/user';
import { publisherRouter } from './router/publisher';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use("/user", userRouter)
app.use("/publisher", publisherRouter)

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

mongoose.connect("mongodb+srv://kushagraahire:Ilcvm%402001@cluster0.7agncez.mongodb.net/", {dbName : "game-central"})

const db = mongoose.connection;

db.on('connected', () => {
  console.log('Connected to MongoDB');
});