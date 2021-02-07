const Category = require('../models/category')
const {errorHandler} = require('../helpers/dbErrorHandler')
const { json } = require('body-parser')

exports.create = (req, res) => {
    const category = new Category(req.body)

    category.save((err, data) => {
      if(err) return res.status(400)
      .json({error:errorHandler(err)})

      return res.json({data})
    })
}

exports.categoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if(err || !category) {
        return res.json(400).json({
          error:"Category does not exists"
        })
    }
    req.category = category;

    next();
  })
}

exports.read = (req, res) => {
  return res.json(req.category)
}

exports.update = (req,res) => {
    const category = req.category
    category.name = req.body.name
    category.save((err, data) => {
      if(err || !category) {
        return res.json(400).json({
          error:errHandler(err)
        })
    }
    return res.json(data)
    })
}

exports.remove = (req,res) => {
  const category = req.category
  category.name = req.body.name
  category.remove((err, category) => {
    if(err || !category) {
      return res.json(400).json({
        error:errHandler(err)
      })
  }
  return res.json({
    message: "Category deleted"
  })
  })
}


exports.list = (req,res) => {
  Category.find().exec((err, data) => {
    if(err || !data) {
      return res.json(400).json({
        error:errHandler(err)
      })
  }
  return res.json(data)
  })
}