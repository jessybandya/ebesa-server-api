//CRUD functions for Administrators.
const router = require('express').Router()
const db = require('../../connector')
const UserModel = require('../../models/user.js')
const OrderModel = require('../../models/order.js')
const CategoryModel = require('../../models/category.js')

//Turn other users into Administrators or vendors
router.put('/users', (req, res) => {
  UserModel.findOneAndUpdate({
    id: req.body.id
  }, {
    role: req.body.role
  },
    {
      new: true
    }
  )
})

//View user orders
router.get('/orders', (req, res) => {
  res.send(OrderModel.find({}))
})

//Add/remove categories
router.put('/categories', (req, res) => {
  //res.send(CategoryModel.find({}))
  CategoryModel.create({
    name: req.body.name,
    slug: req.body.slug,
    description: req.body.description,
    isActive: req.body.isActive,
    products: req.body.products,
    updated: req.body.updated,
    created: req.body.created,
  })
})

router.delete('/categories', (req, res) => {
  CategoryModel.deleteOne({
    name: req.body.name
  }).then(function() {
    alert("Data deleted"); // Success
  }).catch(function(error) {
    alert(error);
  })
})

//Send emails
module.exports = router