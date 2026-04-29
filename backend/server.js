const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoute = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const subscribeRoute = require('./routes/subscribeRoute');
const adminRoutes = require('./routes/adminRoutes');
const productAdminRoutes = require('./routes/productAdminRoutes');
const adminOrderRoutes = require('./routes/adminOrderRoutes');

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();

// Connect To MongoDB
connectDB().catch((error) => {
	console.error('Initial MongoDB connection failed:', error.message);
});

app.get('/', (req, res) => {
	res.send('Hello from the backend!');
});

// API Routes
app.use('/api/users', userRoute);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api', subscribeRoute);

// Admin Routes
app.use('/api/admin/users', adminRoutes);
app.use('/api/admin/products', productAdminRoutes);
app.use('/api/admin/orders', adminOrderRoutes);

// Export for Vercel
module.exports = app;

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
