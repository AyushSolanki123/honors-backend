const { default: axios } = require('axios')
const { env } = require('../env')

const Product = require('../Models/Product').model
const Category = require('../Models/Category').model

function getProductById(productId) {
    return Product.findById(productId)
      .populate('category')
}

function listProducts(skip, limit) {
    return Product.find({isDeleted: false})
        .populate('category')
        .sort({updatedAt: -1})
}

function addProduct(reqBody) {
    return Product.create(reqBody)
}

function updateProduct(productId, reqBody) {
    return Product.findByIdAndUpdate(productId,
        {$set: reqBody},
        {new: true})
        .populate('category')
}

function deleteProduct(productId) {
    return Product.findByIdAndUpdate(productId,
        {$set: {isDeleted: true}},
        {new: true})
        .populate('category')
}

function searchProductByName(productName) {
  return Product.aggregate([
    {
      '$match': {
        'isDeleted': false
      }
    }, {
      '$match': {
        'name': {
          '$regex': productName, 
          '$options': 'i'
        }
      }
    }, {
      '$sort': {
        'updatedAt': -1
      }
    },
    {
      '$lookup': {
        'from': 'categories', 
        'localField': 'category', 
        'foreignField': '_id', 
        'as': 'category'
      }
    }, {
      '$unwind': '$category'
    }
  ])
}

function filterProductsByCategory(category) {
  return Product.find({
    isDeleted: false,
    category: category
  })
    .populate('category')
    .sort({updatedAt: -1})
}

function scrapeProducts() {
  return axios.get(env.fakeStoreUrl)
}

function createScrapedProducts(product) {
  return new Promise((resolve, reject) => {
      Category.findOneAndUpdate(
          {name: product.category}, 
          {$set: {name: product.category}}, 
          {upsert: true, new: true}
        )
      .then((category) => {
        product = Object.assign(product, {category: category._id})
        return Product.findOneAndUpdate(
          {name: product.name},
          {$set: product},
          {upsert: true, new: true})
      })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

function listCategories() {
  return Category.find({isDeleted: false})
}

module.exports = {
    getProductById: getProductById,
    listProducts: listProducts,
    addProduct: addProduct,
    updateProduct: updateProduct,
    deleteProduct: deleteProduct,
    searchProductByName: searchProductByName,
    filterProductsByCategory: filterProductsByCategory,
    scrapeProducts: scrapeProducts,
    createScrapedProducts: createScrapedProducts,
    listCategories: listCategories
}