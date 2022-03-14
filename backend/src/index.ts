import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import mongoose from 'mongoose';
import path from 'path';
import MongoStore from 'connect-mongo';

import './passport';

import UserRouter from './routes/user';
import AuthRouter from './routes/auth';
import AccountsRouter from './routes/accounts';
import ClassesRouter from './routes/classes';
import { IUser } from './models/User';
import TaskRouter from './routes/tasks';
import FileRouter from './routes/files';

const app = express();

const PORT = 3080;

mongoose.connect(
  'mongodb://127.0.0.1:27017/usuko',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  },
  err => {
    if (err) throw err;
    console.log(`Database successfully connected`);
  },
);

app.use(
  session({
    secret: 'adjosiYhrfawojwhDASda3dfasf',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongoUrl: 'mongodb://127.0.0.1:27017/usuko',
    }),
  }),
);

app.use(
  cors({
    origin: ['https://localhost:8080', 'http://localhost:8080'],
    credentials: true,
    exposedHeaders: ['set-cookie'],
  }),
);

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend/public')));
app.use((req, res, next) => {
  res.locals.user = req.user as IUser;
  next();
});

app.use('/api/user', UserRouter);
app.use('/api/auth', AuthRouter);
app.use('/api/accounts', AccountsRouter);
app.use('/api/classes', ClassesRouter);
app.use('/api/tasks', TaskRouter);
app.use('/api/files', FileRouter);

app.listen(PORT, () => {
  console.log(`Server is running at ::${PORT}`);
});
