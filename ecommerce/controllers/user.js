const User = require('../models/user');

exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) return res.status(400).json({ err: 'User not found' });

    req.profile = user;

    next();
  });
};

exports.read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

exports.update = (req, res) => {
  User.findOneAndUpdate(
    {
      _id: req.profile._id,
    },
    {
      $set: req.body,
    },
    { new: true },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: 'You are not authorized',
        });
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      return res.json(user);
    }
  );
};

exports.addOrderToUserHistory = (req, res, next) => {
  let history = [];

  req.body.order.products.forEach((item) => {
    history.push({
      _id: item._id,
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      transaction_id: req.body.order.transaction_id,
      amount: req.body.order.amount,
    });
  });
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { history } },
    { new: true },
    (error, data) => {
      if (error) {
        return res.status(400).json({
          error: 'Could not update user purchase history',
        });
      }
      next();
    }
  );
};