const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/authMiddleware');

// @route GET /api/admin/orders
// @desc Get all orders (admin only)
// @access Private/Admin
router.get('/', protect, admin, async (req, res) => {
	try {
		const order = await Order.find({}).populate('user', 'name email');
		res.json(order);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server Error' });
	}
});

// @route PUT /api/admin/orders/:id
// @desc Update order status (admin only)
// @access Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
	try {
		const updateData = { status: req.body.status };

		if (req.body.status === 'Delivered') {
			updateData.isDelivered = true;
			updateData.deliveredAt = Date.now();
		}

		const updatedOrder = await Order.findByIdAndUpdate(
			req.params.id,
			updateData,
			{ returnDocument: 'after', runValidators: true },
		);

		if (updatedOrder) {
			res.json({ message: 'Order updated successfully', order: updatedOrder });
		} else {
			res.status(404).json({ message: 'Order not found' });
		}
	} catch (error) {
		console.error('Error updating order:', error.message || error);
		res.status(500).json({ message: 'Server error', error: error.message });
	}
});

// @route DELETE /api/admin/orders/:id
// @desc Delete an order (admin only)
// @access Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
	try {
		const order = await Order.findById(req.params.id);
		if (order) {
			await order.deleteOne();
			res.json({ message: 'Order deleted successfully' });
		} else {
			res.status(404).json({ message: 'Order not found' });
		}
	} catch (error) {
		console.error('Error deleting order:', error.message || error);
		res.status(500).json({ message: 'Server error', error: error.message });
	}
});

module.exports = router;
