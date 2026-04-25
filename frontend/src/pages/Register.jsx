import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import register from '../assets/register.webp';
import { registerUser } from '../redux/slices/authSlice';
import { mergeCart } from '../redux/slices/cartSlice';

const Register = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const { user, guestId, error, loading } = useSelector((state) => state.auth);
	const { cart } = useSelector((state) => state.cart);

	// Get redirect parameter and check if it's checkout or something
	const redirect = new URLSearchParams(location.search).get('redirect') || '/';
	const isCheckoutRedirect = redirect.includes('checkout');

	useEffect(() => {
		const userToken = localStorage.getItem('userToken');

		if (user && userToken) {
			if (cart?.products.length > 0 && guestId) {
				dispatch(mergeCart({ guestId, user })).then(() => {
					navigate(isCheckoutRedirect ? '/checkout' : '/');
				});
			} else {
				navigate(isCheckoutRedirect ? '/checkout' : '/');
			}
		}
	}, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		await dispatch(registerUser({ name, email, password }));
	};

	return (
		<div className="flex">
			<div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
				<form
					onSubmit={handleSubmit}
					className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm"
				>
					<div className="flex justify-center mb-6">
						<h2 className="text-xl font-medium">Rabbit</h2>
					</div>
					<h2 className="text-2xl font-bold text-center mb-6">Hey there!</h2>
					<p className="text-center mb-6">
						Enter your email and password to Register
					</p>
					<div className="mb-4">
						<label className="block text-sm font-semibold mb-2">Username</label>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full p-2 border rounded"
							placeholder="Enter your username"
						/>
					</div>
					<div className="mb-4">
						<label className="block text-sm font-semibold mb-2">Email</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full p-2 border rounded"
							placeholder="Enter your email address"
						/>
					</div>
					<div className="mb-4">
						<label className="block text-sm font-semibold mb-2">Password</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full p-2 border rounded"
							placeholder="Enter your password"
						/>
					</div>
					<button
						type="submit"
						disabled={loading}
						className="w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition duration-200"
					>
						{loading ? 'Signing Up...' : 'Sign Up'}
					</button>
					{error && (
						<p className="mt-3 text-sm text-red-600 text-center">{error}</p>
					)}
					<p className="mt-6 text-center text-sm">
						Already have an account?{' '}
						<Link
							to={`/login?redirect=${encodeURIComponent(redirect)}`}
							className="text-blue-500 hover:underline"
						>
							Log in
						</Link>
					</p>
				</form>
			</div>

			<div className="hidden md:block w-1/2 bg-gray-800">
				<div className="h-full flex flex-col justify-center items-center">
					<img
						src={register}
						alt="Register For Account"
						className="h-[750px] w-full object-cover"
					/>
				</div>
			</div>
		</div>
	);
};

export default Register;
