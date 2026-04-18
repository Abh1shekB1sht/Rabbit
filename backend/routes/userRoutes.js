const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route POST /api/users/register
// @desc Register a new user
// @access Public
router.post('/register', async (req, res) => {
	const { name, email, password } = req.body;
	// Basic validation
	if (!name || !email || !password) {
		return res.status(400).json({
			message: 'Name, email and password are required',
		});
	}
	try {
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res
				.status(400)
				.json({ success: false, message: 'User already exists' });
		}
		const user = new User({ name, email, password });
		await user.save();

		// Create JWT Payload
		const pyaload = { user: { _id: user._id, role: user.role } };

		// Sign and return the token along with user info
		const token = jwt.sign(
			pyaload,
			process.env.JWT_SECRET,
			{
				expiresIn: '7d',
			},
			(err, token) => {
				if (err) throw err;

				// Send the user and token in response
				res.status(201).json({
					user: {
						_id: user._id,
						name: user.name,
						email: user.email,
						role: user.role,
					},
				});
			},
		);
	} catch (error) {
		res.status(500).json({ message: error.message || 'Server error' });
	}
});

// @route POST /api/users/login
// @desc Authenticate user
// @access Public
router.post('/login', async (req, res) => {
	const { email, password } = req.body;
	try {
		// Find the user by email
		let user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: 'Invalid Email or Password' });
		}
		const isMatch = await user.matchPassword(password);
		if (!isMatch) {
			return res.status(400).json({ message: 'Invalid Credentials' });
		}

		// Create JWT Payload
		const pyaload = { user: { _id: user._id, role: user.role } };

		// Sign and return the token along with user info
		const token = jwt.sign(
			pyaload,
			process.env.JWT_SECRET,
			{
				expiresIn: '7d',
			},
			(err, token) => {
				if (err) throw err;

				// Send the user and token in response
				res.json({
					user: {
						_id: user._id,
						name: user.name,
						email: user.email,
						role: user.role,
					},
					token,
				});
			},
		);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message || 'Server error' });
	}
});

// @route GET /api/users/profile
// @desc Get logged-in user's profile (Protected Route);
// @access Private
router.get('/profile', protect, async (req, res) => {
	res.json(req.user);
});

module.exports = router;
