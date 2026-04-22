const express = require('express');
const Product = require('../models/Product');
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

// @route GET /api/products
// @desc Get all products with optional query filters
// @access Public
router.get('/', async (req, res) => {
	try {
		const {
			category,
			collection,
			size,
			color,
			minPrice,
			maxPrice,
			sortBy,
			search,
			material,
			brand,
			limit,
			gender,
		} = req.query;

		let query = {};

		// Filter logic
		if (collection && collection.toLowerCase() !== 'all') {
			query.collections = collection;
		}

		if (category && category.toLowerCase() !== 'all') {
			query.category = category;
		}

		if (material) {
			query.material = { $in: material.split(',') };
		}
		if (brand) {
			query.brand = { $in: brand.split(',') };
		}
		if (size) {
			query.sizes = { $in: size.split(',') };
		}
		if (color) {
			query.colors = { $in: [color] };
		}
		if (gender) {
			query.gender = gender;
		}
		if (minPrice || maxPrice) {
			query.price = {};
			if (minPrice) {
				query.price.$gte = Number(minPrice);
			}
			if (maxPrice) {
				query.price.$lte = Number(maxPrice);
			}
		}
		if (search) {
			query.$or = [
				{ name: { $regex: search, $options: 'i' } },
				{ description: { $regex: search, $options: 'i' } },
			];
		}

		// Sorting Logic
		let sort = {};
		if (sortBy) {
			switch (sortBy) {
				case 'priceAsc':
					sort = { price: 1 };
					break;
				case 'priceDesc':
					sort = { price: -1 };
					break;
				case 'popularity':
					sort = { rating: -1 };
					break;
				default:
					break;
			}
		}

		// Fetch products based on query and sorting
		const products = await Product.find(query)
			.sort(sort)
			.limit(Number(limit) || 0);

		res.status(200).json(products);
	} catch (error) {
		console.error('Error fetching products:', error);
		res.status(500).json({ message: 'Server error while fetching products' });
	}
});

// @route GET /api/products/best-seller
// @desc Retrieve the product with the highest rating
// @access Public
router.get('/best-seller', async (req, res) => {
	try {
		const bestSeller = await Product.findOne().sort({ rating: -1 });
		if (bestSeller) {
			res.status(200).json(bestSeller);
		} else {
			res.status(404).json({ message: 'No products found' });
		}
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ message: 'Server error while fetching best seller' });
	}
});

// @route GET /api/products/new-arrivals
// @desc Retrieve the 5 most recently added products
// @access Public
router.get('/new-arrivals', async (req, res) => {
	try {
		const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(5);
		res.status(200).json(newArrivals);
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ message: 'Server error while fetching new arrivals' });
	}
});

// @route GET /api/products/:id
// @desc Get a single product by ID
// @access Public
router.get('/:id', async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			return res.status(200).json(product);
		} else {
			return res.status(404).json({ message: 'Product not found' });
		}
	} catch (error) {
		console.error('Error fetching product by ID:', error);
		res.status(500).json({ message: 'Server error' });
	}
});

// @route GET /api/products/similar/:id
// @desc Retrieve similar products based on the current product's gender and category
// @access Public
router.get('/similar/:id', async (req, res) => {
	const { id } = req.params;
	console.log(id);
	try {
		const product = await Product.findById(id);

		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}

		const similarProduct = await Product.find({
			_id: { $ne: product._id }, // Exclude the current product from the results
			gender: product.gender,
			category: product.category,
		}).limit(4);

		res.status(200).json(similarProduct);
	} catch (error) {
		console.error(error);
		res.status(500).send('Server error');
	}
});

module.exports = router;
