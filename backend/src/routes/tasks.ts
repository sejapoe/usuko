import express from 'express';
import multer from 'multer';
import fs, { readdirSync } from 'fs';
import path from 'path';
import Class from '../models/Class';
import Task, { ITask } from '../models/Task';
import User, { IUser } from '../models/User';
import Answer, { IAnswer } from '../models/Answer';

const upload = multer({ dest: './data' });

const TaskRouter = express.Router();

TaskRouter.all('', (req, res, next) => {
  if (!req.user) return res.sendStatus(401);
  next();
});

TaskRouter.post('/create', upload.array('file'), (req, res) => {
  if ((req.user as IUser).accountType != 1) return res.sendStatus(403);
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
  if ((req.user as IUser).accountType != 1) return res.sendStatus(403);
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
  if ((req.user as IUser).accountType != 1) return res.sendStatus(403);
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
  if ((req.user as IUser).accountType != 1) return res.sendStatus(403);
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

TaskRouter.post('/delete', (req, res) => {
  if ((req.user as IUser).accountType != 1) return res.sendStatus(403);
  const dir = path.resolve(`./data/tasks/${req.body._id}`);
  if (fs.existsSync(dir)) {
    const dirAnswers = path.join(dir, 'answers');
    if (fs.existsSync(dirAnswers)) {
      for (const dirUsers of fs.readdirSync(dirAnswers)) {
        for (const file of fs.readdirSync(path.join(dirAnswers, dirUsers))) {
          fs.rmSync(path.join(dirAnswers, dirUsers, file));
        }
        fs.rmdirSync(path.join(dirAnswers, dirUsers));
      }
      fs.rmdirSync(dirAnswers);
    }
    for (const file of fs.readdirSync(dir)) {
      fs.rmSync(path.join(dir, file));
    }
    fs.rmdirSync(dir);
  }
  Task.findOne({
    _id: req.body._id,
  })
    .populate({ path: 'answers' })
    .orFail()
    .then(async task => {
      for (const answer of task.answers) {
        await answer.delete();
      }
      await task.delete();
      res.sendStatus(200);
    });
});

TaskRouter.get('/get', (req, res) => {
  const user = req.user as IUser;
  if (user.accountType == 1) {
    Task.find({
      teacher: user._id,
    }).then(tasks => {
      res.send(tasks);
    });
  } else if (user.accountType == 0) {
    if (!user.class) return res.send([]);
    Task.find({
      classes: user.class,
    }).then(tasks => {
      res.send(tasks);
    });
  }
});

TaskRouter.post('/addAnswer', upload.array('file'), (req, res) => {
  if ((req.user as IUser).accountType != 0) return res.sendStatus(403);
  Task.findOne({
    _id: req.body.id,
  })
    .populate('answers')
    .then(task => {
      if (!task || !req.files || !(req.files instanceof Array)) {
        return res.sendStatus(500);
      }
      if (isTaskAnsweredByUser(task, req.user as IUser)) {
        for (const file of req.files) {
          const filePath = path.join(file.path);
          fs.rmSync(filePath);
        }
        return res.sendStatus(403);
      }
      const dir = path.resolve(`./data/tasks/${task._id}/answers/${(req.user as IUser)._id}`);
      fs.mkdirSync(dir, { recursive: true });
      const answers = [];
      for (const file of req.files) {
        const filePath = path.join(file.path);
        const newPath = path.join(dir, file.originalname);
        fs.renameSync(filePath, newPath);
        answers.push(newPath);
      }
      const answer = new Answer({
        task: task._id,
        user: (req.user as IUser)._id,
        files: answers,
      });
      answer.save().then(ans => {
        task.answers.push(ans._id);
        task.save().then(() => {
          res.sendStatus(200);
        });
      });
    });
});

TaskRouter.post('/resolveAnswers', (req, res) => {
  if ((req.user as IUser).accountType != 1) return res.sendStatus(403);

  Task.findOne({
    _id: req.body.id,
  })
    .populate({ path: 'answers', populate: { path: 'user', populate: { path: 'class' } } })
    .then(task => {
      if (!task) return res.sendStatus(404);
      res.send(task.answers);
    });
});

function isTaskAnsweredByUser(task: ITask, user: IUser): boolean {
  return task.answers.some(b => b.user.toString() == user._id);
}

export default TaskRouter;
