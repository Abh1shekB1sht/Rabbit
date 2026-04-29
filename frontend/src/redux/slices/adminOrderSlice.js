import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;
const USER_TOKEN = `Bearer ${localStorage.getItem('userToken')}`;

// Fetch all orders (admin only)
export const fetchAdminOrders = createAsyncThunk(
	'adminOrders/fetchAdminOrders',
	async (_, { rejectWithValue }) => {
		try {
			const response = await axios.get(`${API_URL}/api/admin/orders`, {
				headers: {
					Authorization: USER_TOKEN,
				},
			});
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	},
);

// Update order status (admin only)
export const updateOrderStatus = createAsyncThunk(
	'adminOrders/updateOrderStatus',
	async ({ orderId, status }, { rejectWithValue }) => {
		try {
			const response = await axios.put(
				`${API_URL}/api/admin/orders/${orderId}`,
				{ status },
				{
					headers: {
						Authorization: USER_TOKEN,
					},
				},
			);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	},
);

// Delete an order
export const deleteOrderStatus = createAsyncThunk(
	'adminOrders/deleteOrderStatus',
	async ({ orderId }, { rejectWithValue }) => {
		try {
			const response = await axios.delete(
				`${API_URL}/api/admin/orders/${orderId}`,
				{
					headers: {
						Authorization: USER_TOKEN,
					},
				},
			);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	},
);

const adminOrderSlice = createSlice({
	name: 'adminOrders',
	initialState: {
		orders: [],
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAdminOrders.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchAdminOrders.fulfilled, (state, action) => {
				state.loading = false;
				state.orders = action.payload;
				state.totalOrders = action.payload.length;

				// calculate total sales
				const totalSales = action.payload.reduce(
					(acc, order) => acc + order.totalPrice,
					0,
				);
				state.totalSales = totalSales;
			})
			.addCase(fetchAdminOrders.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.message || action.error.message;
			})
			.addCase(updateOrderStatus.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateOrderStatus.fulfilled, (state, action) => {
				state.loading = false;
				const updatedOrder = action.payload.order;
				const index = state.orders.findIndex(
					(order) => order._id === updatedOrder._id,
				);
				if (index !== -1) {
					state.orders[index] = updatedOrder;
				}
			})
			.addCase(updateOrderStatus.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.message || action.error.message;
			})
			.addCase(deleteOrderStatus.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(deleteOrderStatus.fulfilled, (state, action) => {
				state.loading = false;
				state.orders = state.orders.filter(
					(order) => order._id !== action.meta.arg.orderId,
				);
			})
			.addCase(deleteOrderStatus.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.message || action.error.message;
			});
	},
});

export default adminOrderSlice.reducer;
