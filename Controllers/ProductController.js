const ProductService = require('../Services/ProductService')
const { validationResult } = require('express-validator')
const ErrorBody = require('../Utils/ErrorBody')
const { logger } = require('../Utils/Logger')
const {generateRandomQuantity, generateRandomRating} = require('../Utils/GenerateRandomData')

function getProductById (req, res, next) {
    ProductService.getProductById(req.params.productId)
        .then((product) => {
            if (!product.isDeleted) {    
                res.status(200)
                res.json(product)
            } else {
                throw new ErrorBody(
                    404,
                    "Product is deleted"
                )
            }
        })
        .catch((error) => {
            logger.error('Unable to get the product at the moment')
            logger.error(JSON.stringify(error.errorMessage))
            next(
                new ErrorBody(
                    error.statusCode || 500,
                    error.errorMessage || "Server Error Occured"
                )
            )
        })
}

function listProducts (req, res, next) {
    ProductService.listProducts()
        .then((products) => {
            res.status(200)
            res.json({
                count: products.length,
                data: products
            })
        })
        .catch((error) => {
            logger.error('Unable to list the products at the moment')
            logger.error(JSON.stringify(error.errorMessage))
            next(
                new ErrorBody(
                    error.statusCode || 500,
                    error.errorMessage || "Server Error Occured"
                )
            )
        })
}

function addProduct (req, res, next) {
    const { errors } = validationResult(req)
    if (errors.length > 0) {
        logger.error('Error in creating Product in: ', JSON.stringify(errors))
        next(new ErrorBody(400, 'Invalid values in the form'))
    } else {
        ProductService.addProduct(req.body)
            .then((product) => {
                logger.log(`Product: ${product.name} created successfully`)
                res.status(200)
                res.json({
                    message: "Product created Successfully",
                    data: product
                })
            })
            .catch((error) => {
                logger.error('Unable to create the product at the moment')
                logger.error(JSON.stringify(error.errorMessage))
                next(
                    new ErrorBody(
                        error.statusCode || 500,
                        error.errorMessage || "Server Error Occured"
                    )
                )
            })
    }
}

function updateProduct (req, res, next) {
    ProductService.updateProduct(req.params.productId, req.body)
        .then((product) => {
            if (product) {
                logger.log(`Product: ${product.name} updated successfully`)
                res.status(200)
                res.json({
                    message: "Product updated Successfully",
                    data: product
                })
            } else {
                throw new ErrorBody(
                    400, 
                    "Cannot find the product to update, wrong _id provided"
                )
            }
        })
        .catch((error) => {
            logger.error('Unable to update the product at the moment')
            logger.error(JSON.stringify(error.errorMessage))
            next(
                new ErrorBody(
                    error.statusCode || 500,
                    error.errorMessage || "Server Error Occured"
                )
            )
        })
}

function deleteProduct (req, res, next) {
    ProductService.deleteProduct(req.params.productId)
        .then((response) => {
            console.log(response)
            if (response) {
                logger.log(`Product: ${response.name} deleted successfully`)
                res.status(200)
                res.json({
                    message: "Product deleted Successfully"
                })
            } else {
                throw new ErrorBody(
                    400, 
                    "Cannot Delete the product"
                )
            }
        })
        .catch((error) => {
            logger.error('Unable to delete the product at the moment')
            logger.error(JSON.stringify(error.errorMessage))
            next(
                new ErrorBody(
                    error.statusCode || 500,
                    error.errorMessage || "Server Error Occured"
                )
            )
        })
}

function searchProductByName (req, res, next) {

    var { name } = req.params
    if (!name) {
        logger.error("name field in search products is missing")
        next(new ErrorBody(400, "Invalid value in form"))
    } else {
        ProductService.searchProductByName(name)
            .then((products) => {                
                res.status(200)
                res.json({
                    count: products.length,
                    data: products
                })
            })
            .catch((error) => {
                console.log(error)
                logger.error('Unable to list products at the moment')
                logger.error(JSON.stringify(error.errorMessage))
                next(
                    new ErrorBody(
                        error.statusCode || 500,
                        error.errorMessage || "Server Error Occured"
                    )
                )
            })
    }
}

function filterProductsByCategory (req, res, next) {

    var { categoryId } = req.params

    if (categoryId) {
        ProductService.filterProductsByCategory(categoryId)
            .then((products) => {                                   
                res.status(200)
                res.json({
                    category: products[0].category.name,
                    count: products.length,
                    data: products
                })
            })
            .catch((error) => {
                logger.error('Unable to list products at the moment')
                logger.error(JSON.stringify(error.errorMessage))
                next(
                    new ErrorBody(
                        error.statusCode || 500,
                        error.errorMessage || "Server Error Occured"
                    )
                )
            })
    } else {
        logger.error("category field in filter products is missing")
        next(new ErrorBody(400, "Invalid value in form"))
    }

}

function listCategories (req, res, next) {
    ProductService.listCategories()
        .then((categories) => {
            res.status(200)
            res.json({
                count: categories.length,
                data: categories
            })
        })
        .catch((error) => {
            logger.error('Unable to list the products at the moment')
            logger.error(JSON.stringify(error.errorMessage))
            next(
                new ErrorBody(
                    error.statusCode || 500,
                    error.errorMessage || "Server Error Occured"
                )
            )
        })
}


function scrapeAndCreateProducts (req, res, next) {
    ProductService.scrapeProducts()
        .then((response) => {
            var products = []
            response.data.forEach((data) => {
                const product = {
                    name: data.title,
                    description: data.description,
                    category: data.category,
                    imageUrl: data.image,
                    quantity: generateRandomQuantity(10, 100),
                    rating: data.rating,
                    price: data.price
                }
                products.push(product)
            })
            
            var promiseArray = []

            products.map(product => {
                promiseArray.push(ProductService.createScrapedProducts(product))
                return null
            })

            Promise.all([...promiseArray])
                .then(() => {
                    res.status(200);
                    res.json({message: "Success"})
                })
                .catch((err) => {
                    logger.error("Unable to add product")
                    logger.error(JSON.stringify(err))
                    new ErrorBody(500, "Server Error Occured");
                })
        })
        .catch((error) => {
            logger.error("Failed to fetch products", error)
            next(new ErrorBody( error.statusCode || 500, error.errorMessage || "Server Error occured"));
        })
}

function scrapeAndCreateBooks (req, res, next) {
    ProductService.scrapeBooks()
        .then((response) => {
            var products = []
            response.data.books.forEach(data  => {
                const product = {
                    name: data.title,
                    description: data.subtitle,
                    category: "books",
                    imageUrl: data.image,
                    quantity: generateRandomQuantity(10, 100),
                    rating: generateRandomRating(),
                    price: Number(data.price.split("$")[1])
                }
                products.push(product)
            })
            var promiseArray = []

            products.map(product => {
                promiseArray.push(ProductService.createScrapedProducts(product))
                return null
            })

            Promise.all([...promiseArray])
                .then(() => {
                    res.status(200);
                    res.json({message: "Success"})
                })
                .catch((err) => {
                    logger.error("Unable to add product")
                    logger.error(JSON.stringify(err))
                    new ErrorBody(500, "Server Error Occured");
                })
        })
        .catch((error) => {
            logger.error("Failed to fetch products", error)
            next(new ErrorBody( error.statusCode || 500, error.errorMessage || "Server Error occured"));
        })
}

module.exports = {
    getProductById: getProductById,
    listProducts: listProducts,
    addProduct: addProduct,
    updateProduct: updateProduct,
    deleteProduct: deleteProduct,
    searchProductByName: searchProductByName,
    scrapeAndCreateProducts: scrapeAndCreateProducts,
    scrapeAndCreateBooks: scrapeAndCreateBooks,
    filterProductsByCategory: filterProductsByCategory,
    listCategories: listCategories
}
