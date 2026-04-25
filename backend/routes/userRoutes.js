const express = require('express');
const User = require('../models/User');
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
		const normalizedEmail = email.trim().toLowerCase();
		const existingUser = await User.findOne({ email: normalizedEmail });
		if (existingUser) {
			return res
				.status(400)
				.json({ success: false, message: 'User already exists' });
		}
		const user = new User({ name, email: normalizedEmail, password });
		await user.save();

		// Create JWT Payload
		const payload = { user: { _id: user._id, role: user.role } };

		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: '7d',
		});

		return res.status(201).json({
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
			token,
		});
	} catch (error) {
		if (error.code === 11000) {
			return res.status(400).json({ message: 'User already exists' });
		}
		if (error.name === 'ValidationError') {
			const firstMessage =
				Object.values(error.errors || {})[0]?.message || 'Invalid user data';
			return res.status(400).json({ message: firstMessage });
		}

		return res.status(500).json({ message: error.message || 'Server error' });
	}
});

// @route POST /api/users/login
// @desc Authenticate user
// @access Public
router.post('/login', async (req, res) => {
	const { email, password } = req.body;
	try {
		const normalizedEmail = email?.trim().toLowerCase();
		// Find the user by email
		let user = await User.findOne({ email: normalizedEmail });
		if (!user) {
			return res.status(400).json({ message: 'Invalid Email or Password' });
		}
		const isMatch = await user.matchPassword(password);
		if (!isMatch) {
			return res.status(400).json({ message: 'Invalid Credentials' });
		}

		// Create JWT Payload
		const payload = { user: { _id: user._id, role: user.role } };

		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: '7d',
		});

		return res.json({
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
			token,
		});
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
