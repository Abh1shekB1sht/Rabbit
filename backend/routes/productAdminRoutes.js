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

module.exports = router;
