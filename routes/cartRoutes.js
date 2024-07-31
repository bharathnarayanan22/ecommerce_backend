const express = require('express');
const Router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middlewares/auth');

Router.post('/addToCart', auth, cartController.addToCart);

module.exports = Router;