import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
	fetchProductDetails,
	updateProduct,
} from '../../redux/slices/productSlice';

const EditProductPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { id } = useParams();

	const [uploading, setUploading] = useState(false);

	const { selectedProduct, loading, error } = useSelector(
		(state) => state.products,
	);

	const defaultProductData = {
		name: '',
		description: '',
		price: 0,
		countInStock: 0,
		sku: '',
		category: '',
		brand: '',
		sizes: [],
		colors: [],
		collections: '',
		material: '',
		gender: '',
		images: [],
	};

	const [productData, setProductData] = useState(null);

	const formData = productData || selectedProduct || defaultProductData;

	useEffect(() => {
		if (id) {
			dispatch(fetchProductDetails(id));
		}
	}, [dispatch, id]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setProductData((prevData) => ({
			...(prevData || formData),
			[name]: value,
		}));
	};

	const handleImageUpload = async (e) => {
		const file = e.target.files[0];
		const uploadFormData = new FormData();
		uploadFormData.append('image', file);
		try {
			setUploading(true);
			const { data } = await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/api/upload`,
				uploadFormData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				},
			);
			setProductData((prevData) => ({
				...(prevData || formData),
				images: [
					...(prevData?.images || formData.images || []),
					{ url: data.imageUrl, altText: file.name },
				],
			}));
			setUploading(false);
		} catch (error) {
			console.error(error);
			setUploading(false);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(updateProduct({ id, productData: formData }))
			.unwrap()
			.then(() => {
				navigate('/admin/products');
			})
			.catch((err) => {
				console.error(err);
			});
	};

	if (loading) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <p className="text-red-500 font-bold">Error: {error}</p>;
	}

	return (
		<div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
			<h2 className="text-3xl font-bold mb-6">Edit Product</h2>
			<form onSubmit={handleSubmit}>
				{/* Name */}
				<div className="mb-6">
					<label className="block font-semibold mb-2">Product Name</label>
					<input
						type="text"
						name="name"
						value={formData.name}
						onChange={handleChange}
						className="w-full border border-gray-300 rounded-md p-2"
						required
					/>
				</div>

				{/* Description */}
				<div className="mb-6">
					<label className="block font-semibold mb-2">
						Product Description
					</label>
					<textarea
						type="text"
						name="description"
						value={formData.description}
						onChange={handleChange}
						className="w-full border border-gray-300 rounded-md p-2"
						rows={4}
						required
					/>
				</div>

				{/* Price Input */}
				<div className="mb-6">
					<label className="block font-semibold mb-2">Price</label>
					<input
						type="number"
						name="price"
						value={formData.price}
						onChange={handleChange}
						className="w-full border-gray-300 rounded-md p-2"
					/>
				</div>

				{/* Count In Stock */}
				<div className="mb-6">
					<label className="block font-semibold mb-2">Count in Stock</label>
					<input
						type="number"
						name="countInStock"
						value={formData.countInStock}
						onChange={handleChange}
						className="w-full border-gray-300 rounded-md p-2"
					/>
				</div>

				{/* SKU */}
				<div className="mb-6">
					<label className="block font-semibold mb-2">SKU</label>
					<input
						type="text"
						name="sku"
						value={formData.sku}
						onChange={handleChange}
						className="w-full border border-gray-300 rounded-md p-2"
						required
					/>
				</div>

				{/* Sizes */}
				<div className="mb-6">
					<label className="block font-semibold mb-2">
						Sizes (comma-separated)
					</label>
					<input
						type="text"
						name="sizes"
						value={(formData.sizes || []).join(',')}
						onChange={(e) =>
							setProductData({
								...(productData || formData),
								sizes: e.target.value.split(',').map((size) => size.trim()),
							})
						}
						className="w-full border border-gray-300 rounded-md p-2"
						required
					/>
				</div>

				{/* Colors */}
				<div className="mb-6">
					<label className="block font-semibold mb-2">
						Colors (comma-separated)
					</label>
					<input
						type="text"
						name="colors"
						value={(formData.colors || []).join(',')}
						onChange={(e) =>
							setProductData({
								...(productData || formData),
								colors: e.target.value.split(',').map((color) => color.trim()),
							})
						}
						className="w-full border border-gray-300 rounded-md p-2"
						required
					/>
				</div>

				{/* Image upload */}
				<div className="mb-6">
					<label className="block font-semibold mb-2">Upload Image</label>
					<input type="file" onChange={handleImageUpload} />
					{uploading && <p>Uploading image...</p>}
					<div className="flex gap-4 mt-4">
						{(formData.images || []).map((image, index) => (
							<div key={index}>
								<img
									src={image.url}
									alt={image.altText || 'Product Image'}
									className="w-20 h-20 object-cover rounded-md shadow-md"
								/>
							</div>
						))}
					</div>
				</div>
				<button
					type="submit"
					className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors duration-200"
				>
					Update Product
				</button>
			</form>
		</div>
	);
};

export default EditProductPage;
