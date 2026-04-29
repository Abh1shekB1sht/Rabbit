const mongoose = require('mongoose');

let cachedConnection = global.mongooseConnection;

if (!cachedConnection) {
	cachedConnection = global.mongooseConnection = { conn: null, promise: null };
}

const connectDB = async () => {
	try {
		if (cachedConnection.conn) {
			return cachedConnection.conn;
		}

		if (!process.env.MONGO_URI) {
			throw new Error('MONGO_URI is not defined');
		}

		if (!cachedConnection.promise) {
			cachedConnection.promise = mongoose.connect(process.env.MONGO_URI);
		}

		cachedConnection.conn = await cachedConnection.promise;
		console.log('MongoDB connected successfully');
		return cachedConnection.conn;
	} catch (error) {
		console.error('MongoDB connection failed:', error.message);
		cachedConnection.promise = null;
		throw error;
	}
};

module.exports = connectDB;
