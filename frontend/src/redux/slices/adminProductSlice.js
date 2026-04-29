import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;
const USER_TOKEN = `Bearer ${localStorage.getItem('userToken')}`;

// Async thunk to fetch admin products
export const fetchAdminProducts = createAsyncThunk(
	'adminProducts/fetchAdminProducts',
	async () => {
		const response = await axios.get(`${API_URL}/api/admin/products`, {
			headers: {
				Authorization: USER_TOKEN,
			},
		});
		return response.data;
	},
);

// Async thunk to create a new product
export const createAdminProduct = createAsyncThunk(
	'adminProducts/createAdminProduct',
	async (productData) => {
		const response = await axios.post('${API_URL}/api/admin/products', {
			...productData,
			headers: {
				Authorization: USER_TOKEN,
			},
		});
		return response.data;
	},
);

// Async thunk to update an existing product
export const updateAdminProduct = createAsyncThunk(
	'adminProducts/updateAdminProduct',
	async ({ productId, productData }) => {
		const response = await axios.put(
			`${API_URL}/api/admin/products/${productId}`,
			productData,
			{
				headers: {
					Authorization: USER_TOKEN,
				},
			},
		);
		return response.data;
	},
);

// Async thunk to delete a product
export const deleteAdminProduct = createAsyncThunk(
	'adminProducts/deleteAdminProduct',
	async (productId) => {
		const response = await axios.delete(
			`${API_URL}/api/admin/products/${productId}`,
			{
				headers: {
					Authorization: USER_TOKEN,
				},
			},
		);
		return response.data;
	},
);

const adminProductSlice = createSlice({
	name: 'adminProducts',
	initialState: {
		products: [],
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAdminProducts.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchAdminProducts.fulfilled, (state, action) => {
				state.loading = false;
				state.products = action.payload;
			})
			.addCase(fetchAdminProducts.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})
			.addCase(createAdminProduct.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createAdminProduct.fulfilled, (state, action) => {
				state.loading = false;
				state.products.push(action.payload);
			})
			.addCase(createAdminProduct.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})
			.addCase(updateAdminProduct.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateAdminProduct.fulfilled, (state, action) => {
				state.loading = false;
				const index = state.products.findIndex(
					(product) => product.id === action.payload.id,
				);
				if (index !== -1) {
					state.products[index] = action.payload;
				}
			})
			.addCase(updateAdminProduct.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})
			.addCase(deleteAdminProduct.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(deleteAdminProduct.fulfilled, (state, action) => {
				state.loading = false;
				state.products = state.products.filter(
					(product) => product.id !== action.payload.id,
				);
			})
			.addCase(deleteAdminProduct.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			});
	},
});

export default adminProductSlice.reducer;
