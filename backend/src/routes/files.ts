import express from 'express';
import path from 'path';

const FileRouter = express.Router();

FileRouter.get('/*', function (req, res) {
  res.download(path.join('./data', decodeURIComponent(req.path)));
});

export default FileRouter;
