const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/product');
const User = require('./models/user');
const products = require('./data/products');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seedData = async () => {
	try {
		// Clear existing data
		await Product.deleteMany();
		await User.deleteMany();

		// Create a default admin User
		const createdUser = await User.create({
			name: 'Admin User',
			email: 'example@gmail.com',
			password: '123456',
			role: 'admin',
		});

		// Assign the default user ID to each product
		const userId = createdUser._id;

		const sampleProducts = products.map((product) => {
			return { ...product, userId };
		});

		// Insert the products into the database
		await Product.insertMany(sampleProducts);

		console.log('Data seeded successfully');
		process.exit();
	} catch (error) {
		console.error('Error seeding data:', error);
		process.exit(1);
	}
};

seedData();
