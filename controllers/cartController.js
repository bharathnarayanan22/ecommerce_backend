const Cart = require('../models/cartModel');
const Product = require('../models/productModel');



const addToCart = async (req, res) => {
    const user_id = req.user; 
    const { products } = req.body; 

    try {
        let cart = await Cart.findOne({ user_id });
        if (!cart) {
            cart = new Cart({ user_id, products });
            await cart.save();
            return res.status(201).send(cart);
        }

        for (const product of products) {
            const { product_id, quantity } = product;
            const productExists = cart.products.find(p => p.product_id === product_id);

            if (productExists) {
                productExists.quantity += quantity;
            } else {
                cart.products.push({ product_id, quantity });
            }
        }

        await cart.save();
        return res.send(cart);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};

const getCartItems = async (req, res) => {
    const user_id = req.user; 
    try {
        const cart = await Cart.findOne({ user_id });
        if (!cart) {
            return res.status(404).send({ message: "Cart not found" });
        }

        console.log('Cart:', cart);

        const productDetails = await Promise.all(cart.products.map(async (product) => {
            const productInfo = await Product.findOne({ id: product.product_id });
            console.log('Product Info:', productInfo);
            if (!productInfo) {
                return null; 
            }
            return {
                product_id: product.product_id,
                quantity: product.quantity,
                title: productInfo.title,
                description: productInfo.description,
                image: productInfo.image,
                price: productInfo.price
            };
        }));

        const filteredProductDetails = productDetails.filter(details => details !== null);

        console.log('Filtered Product Details:', filteredProductDetails);

        res.send(filteredProductDetails);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};


module.exports = { addToCart, getCartItems };
