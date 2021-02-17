import express from 'express';
import passport from 'passport';

const AuthRouter = express.Router();

AuthRouter.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.status(403).send('Неверный логин или пароль');
    } else {
      req.logIn(user, err => {
        if (err) return next(err);
        res.send(user);
      });
    }
  })(req, res, next);
});

AuthRouter.get('/logout', (req, res) => {
  req.logOut();
  res.sendStatus(200);
});

export default AuthRouter;
