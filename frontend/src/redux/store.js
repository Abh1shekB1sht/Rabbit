import { configureStore } from '@reduxjs/toolkit';
import adminOrderReducer from './slices/adminOrderSlice';
import adminProductReducer from './slices/adminProductSlice';
import adminReducer from './slices/adminSlice';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import checkoutReducer from './slices/checkoutSlice';
import orderReducer from './slices/orderSlice';
import productReducer from './slices/productSlice';

const store = configureStore({
	reducer: {
		auth: authReducer,
		products: productReducer,
		cart: cartReducer,
		checkout: checkoutReducer,
		orders: orderReducer,
		admin: adminReducer,
		adminProduct: adminProductReducer,
		adminOrder: adminOrderReducer,
	},
});

export default store;
