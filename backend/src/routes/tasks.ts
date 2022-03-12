import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import Class from '../models/Class';
import Task from '../models/Task';
import User, { IUser } from '../models/User';

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
  if (req.files && req.files instanceof Array) {
    const dir = path.resolve(`./data/tasks/${task._id}`);
    fs.mkdirSync(dir);
    for (const file of req.files) {
      const filePath = path.join(file.path);
      const newPath = path.join(dir, file.originalname);
      fs.renameSync(filePath, newPath);
      task.files.push(newPath);
    }
  }
  task.save().then(() => {
    res.sendStatus(200);
  });
});

export default TaskRouter;
