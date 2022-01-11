import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import mongoose from 'mongoose';
import path from 'path';

import './passport';

import UserRouter from './routes/user';
import AuthRouter from './routes/auth';
import AccountsRouter from './routes/accounts';

const app = express();

const PORT = 3080;

app.use(
  session({
    secret: 'adjosiYhrfawojwhDASda3dfasf',
    resave: false,
    saveUninitialized: false,
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

app.use('/api/user', UserRouter);
app.use('/api/auth', AuthRouter);
app.use('/api/accounts', AccountsRouter);

app.listen(PORT, () => {
  console.log(`Server is running at ::${PORT}`);
});

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
