import express from 'express';
import Class from '../models/Class';

const ClassesRouter = express.Router();

ClassesRouter.post('/create', (req, res) => {
  const cl = new Class({
    num: req.body.number,
    liter: req.body.liter,
  });
  cl.save().then(() => {
    res.sendStatus(200);
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
