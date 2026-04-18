const express = require('express');
const Product = require('../models/product');
const { admin, protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route POST /api/products
// @desc Create a new product in the database
// @access Private (Admin)
router.post('/', protect, admin, async (req, res) => {
	try {
		const {
			name,
			description,
			price,
			discountPrice,
			countInStock,
			SKU,
			category,
			brand,
			sizes,
			colors,
			collections,
			material,
			gender,
			images,
			isFeatured,
			isPublished,
			tags,
			dimensions,
			weight,
		} = req.body;

		const product = new Product({
			name,
			description,
			price,
			discountPrice,
			countInStock,
			SKU,
			category,
			brand,
			sizes,
			colors,
			collections,
			material,
			gender,
			images,
			isFeatured,
			isPublished,
			tags,
			dimensions,
			weight,
			user: req.user._id, // Reference to the admin user who created it
		});

		const createdProduct = await product.save();

		res.status(201).json(createdProduct);
	} catch (error) {
		console.error('Error creating product:', error);
		res.status(500).json({ message: 'Server error while creating product' });
	}
});

// @route PUT /api/products/:id
// @desc Update an existing product in the database
// @access Private (Admin)
router.put('/:id', protect, admin, async (req, res) => {
	try {
		const {
			name,
			description,
			price,
			discountPrice,
			countInStock,
			SKU,
			category,
			brand,
			sizes,
			colors,
			collections,
			material,
			gender,
			images,
			isFeatured,
			isPublished,
			tags,
			dimensions,
			weight,
		} = req.body;

		// Find product by ID
		const product = await Product.findById(req.params.id);

		if (product) {
			// Update product fields
			product.name = name || product.name;
			product.description = description || product.description;
			product.price = price || product.price;
			product.discountPrice = discountPrice || product.discountPrice;
			product.countInStock = countInStock || product.countInStock;
			product.SKU = SKU || product.SKU;
			product.category = category || product.category;
			product.brand = brand || product.brand;
			product.sizes = sizes || product.sizes;
			product.colors = colors || product.colors;
			product.collections = collections || product.collections;
			product.material = material || product.material;
			product.gender = gender || product.gender;
			product.images = images || product.images;
			product.isFeatured =
				isFeatured !== undefined ? isFeatured : product.isFeatured;
			product.isPublished =
				isPublished !== undefined ? isPublished : product.isPublished;
			product.tags = tags || product.tags;
			product.dimensions = dimensions || product.dimensions;
			product.weight = weight || product.weight;

			// Save the updated product
			const updatedProduct = await product.save();

			res.status(200).json(updatedProduct);
		} else {
			res.status(404).json({ message: 'Product not found' });
		}
	} catch (error) {
		console.error('Error updating product:', error);
		res.status(500).json({ message: 'Server error while updating product' });
	}
});

// @route DELETE /api/products/:id
// @desc Delete a product from the database
// @access Private (Admin)
router.delete('/:id', protect, admin, async (req, res) => {
	try {
		// Find product by ID
		const product = await Product.findById(req.params.id);
		if (product) {
			// Remove the product from the database
			await product.deleteOne();
			res.status(200).json({ message: 'Product removed' });
		} else {
			res.status(404).json({ message: 'Product not found' });
		}
	} catch (error) {
		console.error('Error deleting product:', error);
		res.status(500).json({ message: 'Server error while deleting product' });
	}
});

module.exports = router;
