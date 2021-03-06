/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const User = require('../models/user');
const errHandler = require('../helpers/dbErrorHandler');

exports.signup = (req, res) => {
  const user = new User(req.body);
  user.save((err, user) => {
    if (err)
      return res.status(400).json({ error: errHandler.errorHandler(err) });
    return res.json({ user });
  });
};

exports.signin = (req, res) => {
  // find user based on email
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User with that email does not exist.Please signup.',
      });
    }

    // if user is found make sure the email and password exist
    // create authenticate method in user model
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: 'Email and password dont match',
      });
    }

    // generate a signed token with user id and secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    // persist token as 't' in cookie with expiry date
    res.cookie('t', token, { expire: new Date() + 9999 });

    // return response with user and token to frontend client
    const { _id, name, email, role } = user;

    return res.json({ token, user: { _id, email, name, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie('t');
  res.json({ message: 'Signout success' });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'auth',
  algorithms: ['sha1', 'RS256', 'HS256'],
});

exports.isAuth = (req, res, next) => {
  console.log(
    'isAuth req.profile:',
    req.profile._id.toString(),
    req.auth._id.toString(),
    req.profile._id.toString() === req.auth._id.toString()
  );
  const user =
    req.profile &&
    req.auth &&
    req.profile._id.toString() === req.auth._id.toString();
  if (!user) return res.status(403).json({ error: 'Access denied' });

  return next();
};

exports.isAdmin = (req, res, next) => {
  console.log('isAdmin req.profile:', req.profile);
  if (req.profile.role === 0)
    return res.status(403).json({ error: 'Access denied' });

  return next();
};
