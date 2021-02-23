import express from 'express';
import User from '../models/User';
import { generatePassword } from '../utils';

const AccountsRouter = express.Router();

AccountsRouter.post('/create', function (req, res) {
  const password = generatePassword();
  const user = new User({
    username: req.body.login,
    password,
    accountType: req.body.type,
  });
  user.save().then(() => {
    res.send(password);
  });
});

export default AccountsRouter;
