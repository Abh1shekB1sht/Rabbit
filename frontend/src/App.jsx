import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import CheckOut from './components/Cart/CheckOut';
import UserLayout from './components/Layout/UserLayout';
import ProductDetails from './components/Products/ProductDetails';
import CollectionPage from './pages/CollectionPage';
import Home from './pages/Home';
import Login from './pages/Login';
import OrderConfirmation from './pages/OrderConfirmation';
import Profile from './pages/Profile';
import Register from './pages/Register';

const App = () => {
	return (
		<BrowserRouter>
			<Toaster position="top-right" />
			<Routes>
				<Route path="/" element={<UserLayout />}>
					<Route index element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="/collections/:collection" element={<CollectionPage />} />
					<Route path="/product/:id" element={<ProductDetails />} />
					<Route path="/checkout" element={<CheckOut />} />
					<Route path="/order-confirmation" element={<OrderConfirmation />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

export default App;
