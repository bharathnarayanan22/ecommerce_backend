const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

const addToCart = async (req, res) => {
    const { user_id, products } = req.body;

    try {
        const cart = await Cart.findOne({ user_id });
        if (!cart) {
            const newCart = new Cart(req.body);
            await newCart.save();
            return res.status(201).send(newCart); 
        }

        for (const product of products) {
            const { product_id, quantity } = product;
            const productExists = await Cart.findOne({ user_id, "products.product_id": product_id });
            if (productExists) {
                const updatedQuantity = productExists.products.find(p => p.product_id === product_id).quantity + quantity;
                await Cart.findByIdAndUpdate(
                    cart._id,
                    { $set: { 'products.$[product].quantity': updatedQuantity } },
                    { arrayFilters: [{ 'product.product_id': product_id }]}
                );
                
            } else {
                await Cart.findByIdAndUpdate(
                    cart._id,
                    { $push: { products: { product_id, quantity } } },
                );
                
            }
        }

        const updatedCart = await Cart.findById(cart._id);
        return res.send(updatedCart);
    } catch (error) {
        console.error(error); 
        res.send(error.message);
    }
}

const getCartItems = async(req, res) => {
    const { user_id } = req.query;
    try {
        const cart = await Cart.findOne({ user_id });
        if (!cart) {
            return res.status(404).send({ message: 'Cart not found' });
        }
        res.send(cart.products);
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error getting cart items' });
    }
}

module.exports = { addToCart };