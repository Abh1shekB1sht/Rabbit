import React, { useEffect, useRef, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const NewArrivals = () => {
	// ref for scrollable container
	const scrollRef = useRef(null);

	// state to track dragging status
	const [isDragging, setIsDragging] = useState(false);

	// state to track initial mouse position
	const [startX, setStartX] = useState(0);

	// state to track scroll position
	const [scrollLeft, setScrollLeft] = useState(false);

	// state to track if we can scroll left or right
	const [canScrollLeft, setCanScrollLeft] = useState(true);
	const [canScrollRight, setCanScrollRight] = useState(true);

	const newArrivals = [
		{
			_id: '1',
			name: 'Stylish Jacket',
			price: 120,
			image: [
				{
					url: 'https://picsum.photos/500/500/?random=1',
					altText: 'Stylish Jacket',
				},
			],
		},
		{
			_id: '1',
			name: 'Stylish Jacket',
			price: 120,
			image: [
				{
					url: 'https://picsum.photos/500/500/?random=2',
					altText: 'Stylish Jacket',
				},
			],
		},
		{
			_id: '1',
			name: 'Stylish Jacket',
			price: 120,
			image: [
				{
					url: 'https://picsum.photos/500/500/?random=3',
					altText: 'Stylish Jacket',
				},
			],
		},
		{
			_id: '1',
			name: 'Stylish Jacket',
			price: 120,
			image: [
				{
					url: 'https://picsum.photos/500/500/?random=4',
					altText: 'Stylish Jacket',
				},
			],
		},
		{
			_id: '1',
			name: 'Stylish Jacket',
			price: 120,
			image: [
				{
					url: 'https://picsum.photos/500/500/?random=5',
					altText: 'Stylish Jacket',
				},
			],
		},
		{
			_id: '1',
			name: 'Stylish Jacket',
			price: 120,
			image: [
				{
					url: 'https://picsum.photos/500/500/?random=6',
					altText: 'Stylish Jacket',
				},
			],
		},
		{
			_id: '1',
			name: 'Stylish Jacket',
			price: 120,
			image: [
				{
					url: 'https://picsum.photos/500/500/?random=7',
					altText: 'Stylish Jacket',
				},
			],
		},
		{
			_id: '1',
			name: 'Stylish Jacket',
			price: 120,
			image: [
				{
					url: 'https://picsum.photos/500/500/?random=8',
					altText: 'Stylish Jacket',
				},
			],
		},
	];

	// function to handle mouse down event for dragging
	const handleMouseDown = (e) => {
		setIsDragging(true);
		setStartX(e.pageX - scrollRef.current.offsetLeft);
		setScrollLeft(scrollRef.current.scrollLeft);
	};

	const handleMouseMove = (e) => {
		if (!isDragging) return;
		const x = e.pageX - scrollRef.current.offsetLeft;
		const walk = x - startX; // scroll-fast
		scrollRef.current.scrollLeft = scrollLeft - walk;
	};

	const handleMouseUp = (e) => {
		setIsDragging(false);
	};

	const handleMouseLeave = (e) => {};

	// function to handle scroll button clicks
	const scroll = (direction) => {
		const scrollAmount = direction === 'left' ? -300 : 300;
		scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
	};

	// function to update scroll button visibility based on scroll position
	const updateScrollButton = () => {
		const container = scrollRef.current;

		if (container) {
			const leftScroll = container.scrollLeft;
			const rightScrollable =
				container.scrollWidth > leftScroll + container.clientWidth;
			setCanScrollLeft(leftScroll > 0);
			setCanScrollRight(rightScrollable);
		}

		console.log({
			leftScroll: container.scrollLeft,
			containerScrollWidth: container.scrollWidth,
			clientWidth: container.clientWidth,
			offsetLeft: scrollRef.current.offsetLeft,
		});
	};

	// add scroll event listener to update button visibility
	useEffect(() => {
		const container = scrollRef.current;
		if (container) {
			container.addEventListener('scroll', updateScrollButton);
			updateScrollButton();
			return () => container.removeEventListener('scroll', updateScrollButton);
		}
	}, []);

	return (
		<section className="py-16 px-4 lg:px-0">
			<div className="container mx-auto text-center mb-10 relative">
				<h2 className="text-3xl font-bold mb-4">Explore New Arrivals</h2>
				<p className="text-lg text-gray-600 mb-8">
					Discover the latest styles and trends in our new arrivals collection.
					From chic jackets to trendy accessories, find your perfect look for
					the season. Shop now and stay ahead of the fashion curve!
				</p>

				{/* Scroll Button */}
				<div className="absolute right-0 bottom-[-30px] flex space-x-2">
					<button
						onClick={() => scroll('left')}
						disabled={!canScrollLeft}
						className={`p-2 rounded border ${canScrollLeft ? 'bg-white text-black' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
					>
						<FiChevronLeft className="text-2xl" />
					</button>
					<button
						onClick={() => scroll('right')}
						disabled={!canScrollRight}
						className={`p-2 rounded border ${canScrollRight ? 'bg-white text-black' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
					>
						<FiChevronRight className="text-2xl" />
					</button>
				</div>
			</div>

			{/* Scrollable Content */}
			<div
				ref={scrollRef}
				className={`container mx-auto scroll-smooth overflow-x-scroll flex space-x-6 relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onMouseLeave={handleMouseLeave}
			>
				{newArrivals.map((product) => (
					<div
						key={product._id}
						className="min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] relative"
					>
						<img
							draggable={false}
							src={product.image[0]?.url}
							alt={product.image[0]?.altText}
							className="w-full h-[500px] object-cover rounded-lg"
						/>
						<div className="absolute left-0 bottom-0 right-0 bg-black/5 backdrop-blur-md text-white p-4 rounded-b-lg">
							<Link to={`product/${product._id}`} className="block">
								<h4 className="font-medium">{product.name}</h4>
								<p className="mt-1">${product.price}</p>
							</Link>
						</div>
					</div>
				))}
			</div>
		</section>
	);
};

export default NewArrivals;
