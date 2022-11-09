//CRUD for vendors
const router = require('express').Router()
const db = require('../../connector')

const ProductModel = require('../../models/product')

//Post products
router.post('/products', (req, res)=> {
  productModel.create({
    sku: req.body.sku,
    name: req.body.name,
    slug: req.body.slug,
    imageUrl: req.body.imageUrl,
    imageKey: req.body.imageKey,
    description: req.body.description,
    quantity: req.body.quantity,
    price: req.body.price,
    taxable: req.body.taxable,
    isActive: req.body.isActive,
    brand: req.body.brand,
    updated: req.body.updated,
    created: req.body.created,
  })
})

//Announce offers
router.post('/notifications', (req, res) => {
  res.send(req.body.text)
})

//Remove products
router.delete('/products', (req, res) => {
  ProductModel.deleteOne({
    sku: req.body.sku
  }).then(() => alert('Product deleted!')).catch((error) => {
    alert(error)})
})

//Modify stock quantity and prices
router.put('/products', (req, res) => {
  ProductModel.findOneAndUpdate({
    sku: req.body.sku
  }, {
    name: req.body.name,
    slug: req.body.slug,
    imageUrl: req.body.imageUrl,
    imageKey: req.body.imageKey,
    description: req.body.description,
    quantity: req.body.quantity,
    price: req.body.price,
    taxable: req.body.taxable,
    isActive: req.body.isActive,
    brand: req.body.brand,
    updated: req.body.updated,
    created: req.body.created,
  },
    {
      new: true
    }
  )
})

/*View sales
router.get('/sales', (req, res) => {
  res.send
})*/
module.exports = router;