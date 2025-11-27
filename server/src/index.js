import dotenv from 'dotenv';
import { server } from './server.js';
import connectdb from './db/index.js';
import { connectCloudinary } from "./utils/cloudinary.js"
dotenv.config();
import mongoose from 'mongoose';

const port = process.env.PORT || 8000;

connectdb()
  .then(() => {
    server.listen(port, () => {
      console.log(`Example app listening on port http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('MONGODB connection issue', err);
    process.exit(1);
  });

connectCloudinary();

