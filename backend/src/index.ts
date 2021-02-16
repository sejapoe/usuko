import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import mongoose from 'mongoose';
import path from 'path';

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

app.get('/', function (req, res) {
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server isn't running at ::${PORT}`);
});

mongoose.connect(
  'mongodb://localhost:27017/usuko',
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
