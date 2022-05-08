import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {} from 'dotenv/config';
import {router as bookRouter} from './router/bookRouter.js';
import {router as userRouter} from './router/userRouter.js';
import {router as commentRouter} from './router/commentRouter.js';
import {router as genreRouter} from './router/genreRouter.js';

const app = express();
//const noCors = cors();

const corsOptions  = {
    origin: 'http://localhost:3001', //frontend url
    credentials: true}

app.use(express.json())
app.use(cors(corsOptions));
app.use(cookieParser())
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(bodyParser.json());

app.use('/books', bookRouter);
app.use('/users', userRouter);
app.use('/comments', commentRouter);
app.use('/genres', genreRouter)
app.get('/health',(_req,res) => {
    if (mongoose.connection.readyState === 1) {
        res.status(200).send();
    }
    res.status(503).send()
});

mongoose.connect(process.env.DB_CONNECTION);

app.listen(process.env.PORT);
