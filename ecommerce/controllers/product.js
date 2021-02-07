/* eslint-disable consistent-return */
/* eslint-disable radix */
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } = require('constants');
const Product = require('../models/Product');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err)
      return res.status(400).json({ error: 'Image could not be uploaded' });

    const { name, description, price, category, quantity, shipping } = fields;
    const product = new Product(fields);

    if (!name || !description || !price || !!category || !quantity || !shipping)
      return res.status(400).json({ error: 'Fields are required' });

    if (files.photo) {
      if (files.photo.size > 1000000) {
        if (err)
          return res
            .status(400)
            .json({ error: 'Image shouldnt be bigger then 1MB' });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save((err, result) => {
      if (err) return res.status(400).json({ error: errorHandler(err) });

      res.json(result);
    });
  });
};

exports.productById = (req, res, next, id) => {
  Product.findById(id)
    .populate('category')
    .exec((err, product) => {
      if (err || !product)
        return res.status(400).json({ error: 'Product not found' });

      req.product = product;
      next();
    });
};

exports.read = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.remove = (req, res) => {
  const { product } = req;
  product.remove((err, deletedProduct) => {
    if (err) return res.status(400).json({ error: errorHandler(err) });
    res.json({
      message: 'Product deleted successfully',
    });
  });
};

exports.update = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  // eslint-disable-next-line consistent-return
  form.parse(req, (err, fields, files) => {
    if (err)
      return res.status(400).json({ error: 'Image could not be uploaded' });

    const { name, description, price, category, quantity, shipping } = fields;
    if (!name || !description || !price || !!category || !quantity || !shipping)
      return res.status(400).json({ error: 'Fields are required' });

    let { product } = req;
    product = _.extend(product, fields);

    if (files.photo) {
      if (files.photo.size > 1000000) {
        if (err)
          return res
            .status(400)
            .json({ error: 'Image shouldnt be bigger then 1MB' });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save((err, result) => {
      if (err) return res.status(400).json({ error: errorHandler(err) });

      res.json(result);
    });
  });
};

// sell / arrival
// by sell = /products?sortBy=sold&order=desc&limit=4
// by arrival = /products?sortBy=createdAt&order=desc&limit=4
// if no params are sent, then all products are returned

exports.list = (req, res) => {
  const order = req.query.order ? req.query.order : 'asc';
  const sortBy = req.query.sortBy ? req.query.sortBy : 'asc';
  const limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Product.find()
    .select('-photo')
    .populate('category')
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res
          .status(400)
          .json({ error: 'Image shouldnt be bigger then 1MB' });
      }

      return res.send(products);
    });
};

// it will find products based on the req product
// category, other products that have same category will be returned
exports.listRelated = (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Product.find({ _id: { $ne: req.product }, category: req.product.category })
    .limit(limit)
    .populate('category', '_id name')
    .exec((err, products) => {
      if (err) return res.status(400).json({ error: 'Products not found' });
      res.json(products);
    });
};

exports.listCategories = (req, res) => {
  Product.dinstinct('category', {}, (err, categories) => {
    if (err) return res.status(400).json({ error: 'Categories not found' });

    res.json(categories);
  });
};

exports.listSearch = (req, res) => {
  // createquery object to hold search value and category value

  const query = {};

  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: 'i' };
    // assign cateigory value to query.category
    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }
    // find the product based on query object with 2 properties
    Product.find(query, (err, products) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(products);
    }).select('-photo');
  }
};

exports.decreaseQuantity = (req, res, next) => {
  const bulkOps = req.body.order.products.map((item) => ({
    updateOne: {
      filter: {
        _id: item._id,
      },
      update: { $inc: { quantity: -item.count, sold: +item.count } },
    },
  }));

  Product.bulkWrite(bulkOps, {}, (error, products) => {
    if (error) {
      return res.status(400).json({ eror: '`Could not update product' });
    }
    next();
  });
};
