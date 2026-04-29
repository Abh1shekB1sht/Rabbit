const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');

// @route GET /api/admin/products
// @desc Get all products for admin
// @access Private/Admin
router.get('/', protect, admin, async (req, res) => {
	// Logic to fetch all products for admin
	try {
		const products = await Product.find({});
		res.json(products);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server Error' });
	}
});

// @route POST /api/admin/products
// @desc Create a new product
// @access Private/Admin
router.post('/', protect, admin, async (req, res) => {
	try {
		const { name, description, price, sku, category, stock, image } = req.body;

		const product = new Product({
			name,
			description,
			price,
			sku,
			category,
			stock,
			image,
		});

		await product.save();
		res.status(201).json({
			message: 'Product created successfully',
			product,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server Error' });
	}
});

// @route PUT /api/admin/products/:id
// @desc Update a product
// @access Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
	try {
		const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}

		res.json({
			message: 'Product updated successfully',
			product,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server Error' });
	}
});

// @route DELETE /api/admin/products/:id
// @desc Delete a product
// @access Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
	try {
		const product = await Product.findByIdAndDelete(req.params.id);

		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}

		res.json({
			message: 'Product deleted successfully',
			productId: product._id,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server Error' });
	}
});

module.exports = router;
