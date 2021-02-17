import express from 'express';

const UserRouter = express.Router();

UserRouter.get('/', function (req, res) {
  res.send(req.user || {});
});

export default UserRouter;
