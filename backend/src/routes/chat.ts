import express from 'express';
import Message, { IMessage } from '../models/Message';
import { IUser } from '../models/User';

const ChatRouter = express.Router();

ChatRouter.post('/send', (req, res) => {
  if (!req.user) return res.sendStatus(401);
  new Message({
    users: [(req.user as IUser)._id.toString(), req.body.reciever].sort(),
    message: req.body.message,
    attach: req.body.attach,
    sender: (req.user as IUser)._id,
  })
    .save()
    .then(() => {
      res.sendStatus(200);
    });
});

ChatRouter.get('/getConversations', (req, res) => {
  if (!req.user) return res.sendStatus(401);

  Message.distinct('users', {
    users: { $in: (req.user as IUser)._id },
  }).then(async arrays => {
    const conversations = arrays.filter((a: string) => a != (req.user as IUser)._id.toString());
    const completeConversations: Array<{ reciever: string; lastMessage: IMessage | null }> = [];
    for (const it of conversations) {
      completeConversations.push({
        reciever: it,
        lastMessage: await Message.findOne(
          {
            users: {
              $all: [(req.user as IUser)._id, it],
            },
          },
          {},
          { sort: { timestamp: -1 } },
        ),
      });
    }
    res.send(completeConversations);
  });
});

ChatRouter.get('/getConversation', (req, res) => {
  if (!req.user) return res.sendStatus(401);
  Message.find(
    {
      users: {
        $all: [(req.user as IUser)._id, req.query.reciever],
      },
    },
    {},
    { sort: { timestamp: -1 }, limit: 100 },
  ).then(response => {
    res.send(response);
  });
});

export default ChatRouter;
