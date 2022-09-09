const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

// controller
const productController = require("../Controllers/ProductController");
const { verifyToken } = require("../MiddleWare/VerifyToken");

router.get("/", productController.listProducts);

router.get("/get/:productId", verifyToken, productController.getProductById);

router.get("/search/:name", verifyToken, productController.searchProductByName);

router.get(
	"/filter/:categoryId",
	verifyToken,
	productController.filterProductsByCategory
);

router.get("/category", verifyToken, productController.listCategories);

router.post(
	"/",
	[
		body("name").notEmpty(),
		body("price").isNumeric(),
		body("quantity").isNumeric(),
		body("category").notEmpty(),
	],
	verifyToken,
	productController.addProduct
);

router.get("/scrape/products", productController.scrapeAndCreateProducts);

router.get("/scrape/books", productController.scrapeAndCreateBooks);

router.put("/:productId", verifyToken, productController.updateProduct);

router.delete("/:productId", verifyToken, productController.deleteProduct);

module.exports = router;
