const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoute = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();

// Connect To MongoDB
connectDB();

app.get('/', (req, res) => {
	res.send('Hello from the backend!');
});

// API Routes
app.use('/api/users', userRoute);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
