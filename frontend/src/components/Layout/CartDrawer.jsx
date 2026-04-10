import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
	// state to manage cart drawer visibility
	// const [drawerOpen, setDrawerOpen] = useState(true);

	// function to toggle cart drawer
	// const toggleCartDrawer = () => {
	// 	setDrawerOpen(!drawerOpen);
	// };

	return (
		<div
			className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-1/4 h-full bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-50 ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
		>
			{/* close button */}
			<div className="flex justify-end p-4">
				<button onClick={toggleCartDrawer}>
					<IoMdClose className="h-6 w-6 text-gray-600" />
				</button>
			</div>
		</div>
	);
};

export default CartDrawer;
