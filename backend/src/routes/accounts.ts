import express from 'express';
import User, { IUser } from '../models/User';
import { generatePassword, ScreenedRegExp } from '../utils';
import bcrypt from 'bcrypt';

const SALT_WORK_FACTOR = 10;

const AccountsRouter = express.Router();

AccountsRouter.all('/*', (req, res, next) => {
  if (!req.user) return res.sendStatus(401);
  if ((req.user as IUser).accountType != 3) return res.sendStatus(403);
  next();
});

AccountsRouter.post('/create', function (req, res) {
  const password = generatePassword();
  User.find({ username: req.body.login }).then(u => {
    if (u && u.length != 0) {
      res.send('EAR');
    } else {
      const user = new User({
        username: req.body.login,
        name: req.body.name,
        lastname: req.body.lastname,
        subject: req.body.subject,
        password,
        accountType: req.body.type,
        class: req.body.class,
      });
      user.save().then(() => {
        res.send(password);
      });
    }
  });
});

AccountsRouter.post('/edit', function (req, res) {
  User.updateOne(
    { _id: req.body._id },
    {
      name: req.body.name,
      lastname: req.body.lastname,
      subject: req.body.subject,
      accountType: req.body.type,
      class: req.body.class,
    },
  ).then(user => {
    if (!user) return res.sendStatus(404);
    res.send(user);
  });
});

AccountsRouter.post('/find', function (req, res) {
  let filterArr = {};
  if (req.body.type !== -1) {
    filterArr = { accountType: req.body.type, ...filterArr };
  }

  if (req.body.name) {
    filterArr = { name: new ScreenedRegExp(req.body.name, 'i'), ...filterArr };
  }

  if (req.body.lastname) {
    filterArr = { lastname: new ScreenedRegExp(req.body.lastname, 'i'), ...filterArr };
  }

  if (req.body.login) {
    filterArr = { login: new ScreenedRegExp(req.body.login, 'i'), ...filterArr };
  }

  if (req.body.subject && req.body.type === 1) {
    filterArr = { subject: new ScreenedRegExp(req.body.subject, 'i'), ...filterArr };
  }

  if (req.body.class && req.body.type === 0) {
    filterArr = { class: new ScreenedRegExp(req.body.class, 'i'), ...filterArr };
  }

  User.find(filterArr).then(users => {
    res.send(users);
  });
});

AccountsRouter.post('/resetPassword', function (req, res) {
  const newPassword = generatePassword();
  const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
  const hashPassword = bcrypt.hashSync(newPassword, salt);
  User.updateOne(
    { _id: req.body._id },
    {
      password: hashPassword,
    },
  ).then(() => {
    res.send(newPassword);
  });
});

export default AccountsRouter;
