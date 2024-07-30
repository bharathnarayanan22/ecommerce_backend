const express = require('express');
const Router = express.Router();
const productController = require('../controllers/productController');

Router.get('/products', productController.getAllProducts);
Router.post('/products', productController.postProducts);
Router.put('/products/:id', productController.updateProduct);
Router.delete('/products/:id', productController.deleteProduct);

module.exports = Router;