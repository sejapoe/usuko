import express from 'express';
import multer from 'multer';
import fs, { readdirSync } from 'fs';
import path from 'path';
import Class from '../models/Class';
import Task from '../models/Task';
import User, { IUser } from '../models/User';
import { timingSafeEqual } from 'crypto';

const upload = multer({ dest: './data/tasks' });

const TaskRouter = express.Router();

TaskRouter.all('', (req, res, next) => {
  if (!req.user) return res.sendStatus(401);
  if ((req.user as IUser).accountType != 1) return res.sendStatus(403);
  next();
});

TaskRouter.post('/create', upload.array('file'), (req, res) => {
  req.body.deadline = `${req.body.date}T${req.body.time}`;
  delete req.body.date;
  delete req.body.time;
  const task = new Task(req.body);
  if (req.files && req.files instanceof Array && req.files.length != 0) {
    const dir = path.resolve(`./data/tasks/${task._id}`);
    fs.mkdirSync(dir);
    for (const file of req.files) {
      const filePath = path.join(file.path);
      const newPath = path.join(dir, file.originalname);
      fs.renameSync(filePath, newPath);
      task.files.push(newPath);
    }
  }
  task.teacher = (req.user as IUser)._id;
  task.save().then(() => {
    res.sendStatus(200);
  });
});

TaskRouter.post('/removeFile', (req, res) => {
  Task.findOne({
    _id: req.body._id,
  }).then(task => {
    if (!task) return;
    task.files = task.files.filter(a => a != req.body.file);
    fs.rmSync(req.body.file);
    const dir = path.resolve(`./data/tasks/${task._id}`);
    if (fs.readdirSync(dir).length == 0) {
      fs.rmdirSync(dir);
    }
    task.save().then(() => {
      res.sendStatus(200);
    });
  });
});

TaskRouter.post('/addFiles', upload.array('file'), (req, res) => {
  Task.findOne({
    _id: req.body.id,
  }).then(task => {
    if (!task || !req.files || !(req.files instanceof Array)) return;
    const dir = path.resolve(`./data/tasks/${task._id}`);
    if (task.files.length == 0) {
      fs.mkdirSync(dir);
    }
    let errors = 0;
    const dirContent = readdirSync(dir);
    for (const file of req.files) {
      const filePath = path.join(file.path);
      if (dirContent.includes(file.originalname)) {
        errors++;
        fs.rmSync(filePath);
      } else {
        const newPath = path.join(dir, file.originalname);
        fs.renameSync(filePath, newPath);
        task.files.push(newPath);
      }
    }
    task.save().then(() => {
      if (!errors) {
        res.sendStatus(200);
      } else {
        res.status(201).send({
          errors,
        });
      }
    });
  });
});

TaskRouter.post('/changeDeadline', upload.none(), (req, res) => {
  Task.findOne({
    _id: req.body.id,
  }).then(task => {
    if (!task) return;
    const deadline = `${req.body.date}T${req.body.time}`;
    task.deadline = new Date(deadline);
    task.save().then(() => {
      res.sendStatus(200);
    });
  });
});

TaskRouter.get('/get', (req, res) => {
  const user = req.user as IUser;
  Task.find({
    teacher: user._id,
  }).then(tasks => {
    res.send(tasks);
  });
});

export default TaskRouter;
