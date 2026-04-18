const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoute = require('./routes/userRoutes');

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

app.listen(process.env.PORT, () => {
	console.log('Server is running on port 9000');
});
