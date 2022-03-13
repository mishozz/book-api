import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser'
import {} from 'dotenv/config';
import {router as bookRouter} from './router/bookRouter.js';
import {router as userRouter} from './router/userRouter.js';

const app = express();

app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(bodyParser.json());

app.use('/books', bookRouter);
app.use('/users', userRouter);
app.get('/health',(_req,res) => {
    if (mongoose.connection.readyState === 1) {
        res.status(200).send();
    }
    res.status(503).send()
});

mongoose.connect(process.env.DB_CONNECTION);

app.listen(3000);
