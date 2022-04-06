import express from 'express';
import Class from '../models/Class';
import User, { IUser } from '../models/User';

const ClassesRouter = express.Router();

ClassesRouter.all('/*', (req, res, next) => {
  if (!req.user) return res.sendStatus(401);
  if ((req.user as IUser).accountType == 0) return res.sendStatus(403);
  next();
});

ClassesRouter.post('/create', (req, res) => {
  const cl = new Class({
    num: req.body.number,
    liter: req.body.liter,
  });
  cl.save().then(() => {
    res.sendStatus(200);
  });
});

ClassesRouter.post('/delete', (req, res) => {
  User.updateMany(
    {
      class: req.body._id,
    },
    {
      class: undefined,
    },
  ).then(() => {
    Class.deleteOne({
      _id: req.body._id,
    }).then(() => {
      res.sendStatus(200);
    });
  });
});

ClassesRouter.post('/addToTeacher', (req, res) => {
  User.findOne({ _id: req.body._id }).then(user => {
    if (!user) res.sendStatus(404);
    user?.classes.push(req.body.classId);
    user?.save().then(() => {
      res.sendStatus(200);
    });
  });
});

ClassesRouter.post('/removeFromTeacher', (req, res) => {
  User.findOne({ _id: req.body._id }).then(user => {
    if (!user) return res.sendStatus(404);
    user.classes = user.classes.filter(a => a != req.body.classId);
    user.save().then(() => {
      res.sendStatus(200);
    });
  });
});

ClassesRouter.get('/get', (req, res) => {
  Class.find().then(classes => {
    classes.sort((a, b) => {
      if (a.num != b.num) {
        return b.num - a.num;
      } else if (a.liter != b.liter) {
        if (a.liter > b.liter) return 1;
        else return -1;
      } else {
        return b.pupils.length - a.pupils.length;
      }
    });
    res.send(classes);
  });
});

export default ClassesRouter;
