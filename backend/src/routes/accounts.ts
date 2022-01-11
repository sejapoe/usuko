import express from 'express';
import User from '../models/User';
import { generatePassword, ScreenedRegExp } from '../utils';

const AccountsRouter = express.Router();

AccountsRouter.post('/create', function (req, res) {
  const password = generatePassword();
  const user = new User({
    username: req.body.login,
    name: req.body.name,
    lastname: req.body.lastname,
    subject: req.body.subject,
    password,
    accountType: req.body.type,
  });
  user.save().then(() => {
    res.send(password);
  });
});

AccountsRouter.post('/edit', function (req, res) {
  User.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    lastname: req.body.lastname,
    subject: req.body.subject,
    accountType: req.body.type,
  })
    .then(user => {
      res.send(user);
    })
    .catch(() => {
      res.sendStatus(404);
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

  User.find(filterArr).then(users => {
    res.send(users);
  });
});

export default AccountsRouter;
