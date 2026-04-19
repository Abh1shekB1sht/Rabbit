const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/product');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Helper function to get or create a cart for a user or guest
const getCart = async (userId, guestId) => {
	// Prefer a user cart, but if none exists fall back to a guest cart
	if (userId) {
		const userCart = await Cart.findOne({ user: userId });
		if (userCart) return userCart;
	}
	if (guestId) {
		const guestCart = await Cart.findOne({ guestId });
		if (guestCart) return guestCart;
	}
	return null;
};

// @route POST /api/cart
// @desc Add Add a product to the cart for a guest or logged in user
// @access Public
router.post('/', async (req, res) => {
	const { productId, quantity, size, color, guestId, userId } = req.body;
	try {
		const product = await Product.findById(productId);
		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}

		// Determine if the user is logged in or a guest
		let cart = await getCart(userId, guestId);

		// If the cart exists, update it
		if (cart) {
			const productIndex = cart.products.findIndex(
				(item) =>
					item.productId.toString() === productId &&
					item.size === size &&
					item.color === color,
			);

			if (productIndex > -1) {
				// If the product already exists, update the quantity
				cart.products[productIndex].quantity += quantity;
			} else {
				// add new product
				cart.products.push({
					productId,
					name: product.name,
					image: product.image,
					price: product.price,
					size,
					color,
					quantity,
				});
			}

			// Recalculate total price
			cart.totalPrice = cart.products.reduce(
				(acc, item) => acc + item.price * item.quantity,
				0,
			);

			await cart.save();
			res.status(200).json(cart);
		} else {
			// Create a new cart for the user or guest
			const newCart = new Cart({
				user: userId ? userId : undefined,
				guestId: guestId ? guestId : 'guest_' + new Date().getTime(),
				products: [
					{
						productId,
						name: product.name,
						image: product.images[0].url,
						price: product.price,
						size,
						color,
						quantity,
					},
				],
				totalPrice: product.price * quantity,
			});
			await newCart.save();
			return res.status(201).json(newCart);
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
});

// @route PUT /api/cart
// @desc Update product quantity in the cart for a guest or logged in user
// @access Public
router.put('/', async (req, res) => {
	const { productId, quantity, size, color, guestId, userId } = req.body;
	try {
		let cart = await getCart(userId, guestId);
		if (!cart) return res.status(404).json({ message: 'Cart not found' });
		const productIndex = cart.products.findIndex(
			(item) =>
				item.productId.toString() === productId &&
				item.size === size &&
				item.color === color,
		);
		if (productIndex > -1) {
			if (quantity > 0) {
				cart.products[productIndex].quantity = quantity;
			} else {
				cart.products.splice(productIndex, 1); // Remove product if quantity if 0.
			}
			cart.totalPrice = cart.products.reduce(
				(acc, item) => acc + item.price * item.quantity,
				0,
			);
			await cart.save();
			return res.status(200).json(cart);
		} else {
			return res.status(404).json({ message: 'Product not found in cart' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
});

// @route DELETE /api/cart
// @desc Remove a product from the cart
// @access Public
router.delete('/', async (req, res) => {
	const { productId, size, color, guestId, userId } = req.body;
	try {
		let cart = await getCart(userId, guestId);
		if (!cart) return res.status(404).json({ message: 'Cart not found' });
		const productIndex = cart.products.findIndex(
			(item) =>
				item.productId.toString() === productId &&
				item.size === size &&
				item.color === color,
		);
		if (productIndex > -1) {
			cart.products.splice(productIndex, 1);
			cart.totalPrice = cart.products.reduce(
				(acc, item) => acc + item.price * quantity,
				0,
			);
			await cart.save();
			return res.status(200).json(cart);
		} else {
			return res.status(404).json({ message: 'Product not found in cart' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
});

module.exports = router;
