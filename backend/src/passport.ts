import { CallbackError, NativeError } from 'mongoose';
import passport from 'passport';
import { Strategy } from 'passport-local';
import User, { IUser } from './models/User';

passport.use(
  new Strategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    function (username, password, done) {
      User.findOne({ username }, function (err: CallbackError, res: IUser | null) {
        if (err) return done(err);

        if (!res) {
          done(null, null);
        } else {
          if (res.comparePasswords(password)) {
            done(null, res);
          } else {
            done(null, null);
          }
        }
      });
    },
  ),
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err: NativeError, user: IUser) {
    done(err, user);
  });
});
