import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import UseRazorpay from '../../hooks/UseRazorpay.js';
import { createCheckoutSession } from '../../redux/slices/checkoutSlice.js';

const CheckOut = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { cart, loading, error } = useSelector((state) => state.cart);
	const { checkout, loading: checkoutLoading } = useSelector(
		(state) => state.checkout,
	);
	const { user } = useSelector((state) => state.auth);
	const [checkoutId, setCheckoutId] = useState(null);
	const [paymentStatus, setPaymentStatus] = useState(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const [checkoutError, setCheckoutError] = useState(null);
	const [shippingAddress, setShippingAddress] = useState({
		firstName: '',
		lastName: '',
		address: '',
		city: '',
		postalCode: '',
		country: '',
		phone: '',
	});

	// Ensure cart is loaded before proceeding
	useEffect(() => {
		if (!cart || !cart.products || cart.products.length === 0) {
			navigate('/cart');
		}
	}, [cart, navigate]);

	// Derive checkoutId from Redux slice so component stays in sync
	useEffect(() => {
		if (checkout && checkout._id) {
			setCheckoutId(checkout._id);
		}
	}, [checkout]);

	const handleCreateCheckout = async (e) => {
		e.preventDefault();
		setCheckoutError(null);

		if (cart && cart.products.length > 0) {
			try {
				const result = await dispatch(
					createCheckoutSession({
						checkoutItems: cart.products,
						shippingAddress,
						paymentMethod: 'Razorpay',
						totalPrice: cart.totalPrice,
					}),
				);

				if (result.payload && result.payload._id) {
					setCheckoutId(result.payload._id);
				} else {
					setCheckoutError('Failed to create checkout. Please try again.');
				}
			} catch (err) {
				setCheckoutError('Error creating checkout: ' + err.message);
			}
		}
	};

	const handleFinalizeCheckout = async (checkoutIdToFinalize) => {
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutIdToFinalize}/finalize`,
				{},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('userToken')}`,
					},
				},
			);

			if (response.status === 200) {
				navigate('/order-confirmation');
			}
		} catch (err) {
			console.error('Error finalizing checkout:', err);
			setCheckoutError('Failed to finalize order. Please try again.');
		}
	};

	const handleRazorpayPayment = async () => {
		setIsProcessing(true);
		setCheckoutError(null);

		const { loadScript } = UseRazorpay();
		const isLoaded = await loadScript();
		if (!isLoaded) {
			alert('Failed to load Razorpay. Check your internet connection.');
			setIsProcessing(false);
			return;
		}

		const options = {
			key: import.meta.env.VITE_RAZORPAY_CLIENT_ID,
			amount: cart.totalPrice * 100, // Convert to paise
			currency: 'INR',
			name: 'Rabbit',
			description: 'Order Payment',
			prefill: {
				name: `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim(),
				contact: shippingAddress.phone,
			},
			theme: {
				color: '#000000',
			},
			handler: async (response) => {
				try {
					// Update payment status after successful Razorpay payment
					const paymentResponse = await axios.put(
						`${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
						{
							paymentStatus: 'paid',
							paymentDetails: {
								paymentId: response.razorpay_payment_id,
							},
						},
						{
							headers: {
								Authorization: `Bearer ${localStorage.getItem('userToken')}`,
							},
						},
					);

					if (paymentResponse.status === 200) {
						setPaymentStatus('success');
						// Finalize the checkout and create order
						await handleFinalizeCheckout(checkoutId);
					}
				} catch (err) {
					console.error('Error updating payment status:', err);
					setCheckoutError(
						'Payment recorded but order creation failed. Please contact support.',
					);
					setPaymentStatus('failed');
				} finally {
					setIsProcessing(false);
				}
			},
			modal: {
				ondismiss: function () {
					setIsProcessing(false);
				},
			},
		};

		const rzp = new window.Razorpay(options);

		rzp.on('payment.failed', (response) => {
			console.error('Payment Failed:', response.error);
			setPaymentStatus('failed');
			setCheckoutError('Payment failed: ' + response.error.description);
			setIsProcessing(false);
		});

		rzp.open();
	};

	if (loading) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <p>Error: {error}</p>;
	}

	if (!cart || !cart.products || cart.products.length === 0) {
		return <p>Your cart is empty</p>;
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
			{/* Left Section */}
			<div className="bg-white rounded-lg p-6">
				<h2 className="text-2xl uppercase mb-6">Checkout</h2>

				{checkoutError && (
					<div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
						{checkoutError}
					</div>
				)}

				<form onSubmit={handleCreateCheckout}>
					{/* ── Contact ── */}
					<h3 className="text-lg mb-4">Contact Details</h3>
					<div className="mb-4">
						<label className="block text-gray-700">Email</label>
						<input
							type="email"
							value={user ? user.email : ''}
							className="w-full p-2 border rounded bg-gray-100"
							disabled
						/>
					</div>

					{/* ── Delivery ── */}
					<h3 className="text-lg mb-4">Delivery</h3>
					<div className="mb-4 grid grid-cols-2 gap-4">
						<div>
							<label className="block text-gray-700">First Name</label>
							<input
								type="text"
								value={shippingAddress.firstName}
								onChange={(e) =>
									setShippingAddress({
										...shippingAddress,
										firstName: e.target.value,
									})
								}
								className="w-full p-2 border rounded"
								required
							/>
						</div>
						<div>
							<label className="block text-gray-700">Last Name</label>
							<input
								type="text"
								value={shippingAddress.lastName}
								onChange={(e) =>
									setShippingAddress({
										...shippingAddress,
										lastName: e.target.value,
									})
								}
								className="w-full p-2 border rounded"
								required
							/>
						</div>
					</div>
					<div className="mb-4">
						<label className="block text-gray-700">Address</label>
						<input
							type="text"
							value={shippingAddress.address}
							onChange={(e) =>
								setShippingAddress({
									...shippingAddress,
									address: e.target.value,
								})
							}
							className="w-full p-2 border rounded"
							required
						/>
					</div>
					<div className="mb-4 grid grid-cols-2 gap-4">
						<div>
							<label className="block text-gray-700">City</label>
							<input
								type="text"
								value={shippingAddress.city}
								onChange={(e) =>
									setShippingAddress({
										...shippingAddress,
										city: e.target.value,
									})
								}
								className="w-full p-2 border rounded"
							/>
						</div>
						<div>
							<label className="block text-gray-700">Postal Code</label>
							<input
								type="text"
								value={shippingAddress.postalCode}
								onChange={(e) =>
									setShippingAddress({
										...shippingAddress,
										postalCode: e.target.value,
									})
								}
								className="w-full p-2 border rounded"
							/>
						</div>
					</div>
					<div className="mb-4">
						<label className="block text-gray-700">Country</label>
						<input
							type="text"
							value={shippingAddress.country}
							onChange={(e) =>
								setShippingAddress({
									...shippingAddress,
									country: e.target.value,
								})
							}
							className="w-full p-2 border rounded"
							required
						/>
					</div>
					<div className="mb-4">
						<label className="block text-gray-700">Phone</label>
						<input
							type="text"
							value={shippingAddress.phone}
							onChange={(e) =>
								setShippingAddress({
									...shippingAddress,
									phone: e.target.value,
								})
							}
							className="w-full p-2 border rounded"
							required
						/>
					</div>

					{/* ── CTA ── */}
					<div className="mt-6">
						{!checkoutId ? (
							<button
								type="submit"
								disabled={loading || checkoutLoading}
								className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{loading || checkoutLoading
									? 'Creating Checkout...'
									: 'Continue to Payment'}
							</button>
						) : (
							<div>
								{/* ── Payment Status Messages ── */}
								{paymentStatus === 'success' && (
									<div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
										Payment successful! Your order has been placed.
									</div>
								)}
								{paymentStatus === 'failed' && (
									<div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
										Payment failed. Please try again.
									</div>
								)}

								{/* ── Razorpay Pay Button ── */}
								{paymentStatus !== 'success' && (
									<>
										<h3 className="text-lg mb-4">Payment</h3>
										<div className="border rounded p-4 mb-4 bg-gray-50">
											<div className="flex justify-between text-sm text-gray-600 mb-1">
												<span>Items ({cart.products.length})</span>
												<span>₹{cart.totalPrice}</span>
											</div>
											<div className="flex justify-between font-semibold text-base border-t pt-2 mt-2">
												<span>Total</span>
												<span>₹{cart.totalPrice}</span>
											</div>
										</div>
										<button
											type="button"
											onClick={handleRazorpayPayment}
											disabled={isProcessing}
											className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
										>
											{isProcessing
												? 'Opening Payment...'
												: `Pay with Razorpay`}
										</button>
									</>
								)}
							</div>
						)}
					</div>
				</form>
			</div>

			{/* Right Section — Order Summary */}
			<div className="bg-gray-50 p-6 rounded-lg">
				<h3 className="text-lg mb-4">Order Summary</h3>
				<div className="border-t py-4 mb-4">
					{cart &&
						cart.products &&
						cart.products.map((product, index) => (
							<div
								key={index}
								className="flex items-start justify-between py-2 border-b"
							>
								<div className="flex items-start">
									<img
										src={product.image}
										alt={product.name}
										className="w-20 h-24 object-cover mr-4"
									/>
								</div>
								<div>
									<h3 className="text-md">{product.name}</h3>
									<p className="text-gray-500">Size: {product.size} </p>
									<p className="text-gray-500">Color: {product.color} </p>
								</div>
								<p className="text-xl">₹ {product.price?.toLocaleString()}</p>
							</div>
						))}
				</div>
				<div className="flex justify-between items-center text-lg mb-4">
					<p>SubTotal</p>
					<p>₹ {cart?.totalPrice?.toLocaleString()}</p>
				</div>
				<div className="flex justify-between items-center text-lg">
					<p>Shipping</p>
					<p>Free</p>
				</div>
				<div className="flex justify-between items-center text-lg mt-4 border-t pt-4">
					<p>Total</p>
					<p>₹ {cart?.totalPrice?.toLocaleString()}</p>
				</div>
			</div>
		</div>
	);
};

export default CheckOut;
