'use client'

import { useState, useRef, useEffect } from 'react'

interface TooltipData {
	title: string
	description: string
	details: string
}

const TOURIST_VIEW: TooltipData = {
	title: 'Tourist View',
	description:
		'Idealized imagery with perfect conditions and enhanced colors for marketing',
	details:
		'Shows what tourism companies want you to see — pristine environments, perfect weather, and flawless conditions. Reality might tell a different story.',
}

const SATELLITE_TRUTH: TooltipData = {
	title: 'Satellite Truth',
	description:
		'Real-time Copernicus Sentinel satellite data with actual environmental readings',
	details:
		'Unfiltered reality showing actual pollution levels, temperature anomalies, cloud coverage, and environmental conditions as they truly are right now.',
}

interface LocationInfo {
	city: string
	country: string
	lat: number
	lon: number
	timezone: string
	pollutionLevel: string
	cloudCoverage: string
	temperature: string
}

const DEMO_LOCATIONS: LocationInfo[] = [
	{
		city: 'Beijing',
		country: 'China',
		lat: 39.9042,
		lon: 116.4074,
		timezone: 'Asia/Shanghai',
		pollutionLevel: 'PM2.5: 156 µg/m³',
		cloudCoverage: '73%',
		temperature: '32.4°C',
	},
	{
		city: 'Amazon Rainforest',
		country: 'Brazil',
		lat: -3.4653,
		lon: -62.2159,
		timezone: 'America/Manaus',
		pollutionLevel: 'PM2.5: 28 µg/m³',
		cloudCoverage: '85%',
		temperature: '28.7°C',
	},
	{
		city: 'Arctic Circle',
		country: 'Norway',
		lat: 69.6496,
		lon: 18.9553,
		timezone: 'Europe/Oslo',
		pollutionLevel: 'PM2.5: 8 µg/m³',
		cloudCoverage: '45%',
		temperature: '-5.2°C',
	},
	{
		city: 'Los Angeles',
		country: 'USA',
		lat: 34.0522,
		lon: -118.2437,
		timezone: 'America/Los_Angeles',
		pollutionLevel: 'PM2.5: 89 µg/m³',
		cloudCoverage: '12%',
		temperature: '27.8°C',
	},
]

export const SatelliteVisionToggle = () => {
	const [sliderPosition, setSliderPosition] = useState(50)
	const [isDragging, setIsDragging] = useState(false)
	const [isHoveringHandle, setIsHoveringHandle] = useState(false)
	const [showLeftTooltip, setShowLeftTooltip] = useState(false)
	const [showRightTooltip, setShowRightTooltip] = useState(false)
	const [currentTime, setCurrentTime] = useState(new Date())
	const [currentLocationIndex, setCurrentLocationIndex] = useState(0)
	const [locationData, setLocationData] = useState<LocationInfo>(
		DEMO_LOCATIONS[0]
	)
	const [isTransitioning, setIsTransitioning] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)

	// Update time every second
	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date())
		}, 1000)

		return () => clearInterval(timer)
	}, [])

	// Update location data when index changes with transition
	useEffect(() => {
		setIsTransitioning(true)
		const timer = setTimeout(() => {
			setLocationData(DEMO_LOCATIONS[currentLocationIndex])
			setIsTransitioning(false)
		}, 150)

		return () => clearTimeout(timer)
	}, [currentLocationIndex])

	// Location navigation handlers
	const handleNextLocation = () => {
		setCurrentLocationIndex((prev) =>
			prev < DEMO_LOCATIONS.length - 1 ? prev + 1 : 0
		)
	}

	const handlePreviousLocation = () => {
		setCurrentLocationIndex((prev) =>
			prev > 0 ? prev - 1 : DEMO_LOCATIONS.length - 1
		)
	}

	// Keyboard navigation for locations
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'ArrowRight') {
				handleNextLocation()
			} else if (event.key === 'ArrowLeft') {
				handlePreviousLocation()
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [])

	// Get current view data based on slider position
	const getCurrentViewData = () => {
		if (sliderPosition > 60) {
			return {
				...TOURIST_VIEW,
				percentage: sliderPosition.toFixed(0),
				dominant: true,
			}
		} else if (sliderPosition < 40) {
			return {
				...SATELLITE_TRUTH,
				percentage: (100 - sliderPosition).toFixed(0),
				dominant: true,
			}
		} else {
			return {
				title: 'Split View',
				description: 'Comparing both perspectives side by side',
				details:
					'See the contrast between curated imagery and raw satellite data. Notice the differences in color, clarity, and environmental indicators.',
				percentage: '50',
				dominant: false,
			}
		}
	}

	const handleMouseDown = () => {
		setIsDragging(true)
	}

	const handleMouseUp = () => {
		setIsDragging(false)
	}

	const handleMouseMove = (event: MouseEvent) => {
		if (!isDragging || !containerRef.current) return

		const rect = containerRef.current.getBoundingClientRect()
		const x = event.clientX - rect.left
		const percentage = (x / rect.width) * 100
		setSliderPosition(Math.min(Math.max(percentage, 0), 100))
	}

	const handleTouchMove = (event: TouchEvent) => {
		if (!isDragging || !containerRef.current) return

		const rect = containerRef.current.getBoundingClientRect()
		const x = event.touches[0].clientX - rect.left
		const percentage = (x / rect.width) * 100
		setSliderPosition(Math.min(Math.max(percentage, 0), 100))
	}

	useEffect(() => {
		if (isDragging) {
			document.addEventListener('mousemove', handleMouseMove)
			document.addEventListener('mouseup', handleMouseUp)
			document.addEventListener('touchmove', handleTouchMove)
			document.addEventListener('touchend', handleMouseUp)
		}

		return () => {
			document.removeEventListener('mousemove', handleMouseMove)
			document.removeEventListener('mouseup', handleMouseUp)
			document.removeEventListener('touchmove', handleTouchMove)
			document.removeEventListener('touchend', handleMouseUp)
		}
	}, [isDragging])

	return (
		<div className="relative w-full h-screen bg-black overflow-y-auto overflow-x-hidden">
			{/* Background ambient glow */}
			<div className="fixed inset-0 bg-linear-to-br from-[#00597C]/20 via-transparent to-[#55DDCA]/20 pointer-events-none -z-10" />

			{/* Floating particles */}
			<div className="fixed inset-0 pointer-events-none -z-10">
				{[...Array(20)].map((_, i) => (
					<div
						key={i}
						className="absolute w-1 h-1 bg-[#55DDCA] rounded-full particle-float opacity-30"
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
							animationDelay: `${Math.random() * 4}s`,
							animationDuration: `${4 + Math.random() * 4}s`,
						}}
					/>
				))}
			</div>

			{/* Main container - Scrollable content */}
			<div className="relative w-full min-h-full flex flex-col items-center justify-start p-4 md:p-8 py-8 pb-32 space-y-12">
				{/* Location Navigation Header */}
				<div className="w-full max-w-6xl">
					<div className="backdrop-blur-2xl bg-black/70 border border-white/20 rounded-2xl px-6 py-4 shadow-2xl transition-all duration-500">
						<div className="flex items-center justify-between mb-4">
							<button
								onClick={handlePreviousLocation}
								className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 active:scale-95"
								aria-label="Previous location"
								tabIndex={0}
							>
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 19l-7-7 7-7"
									/>
								</svg>
								<span className="text-sm font-semibold">Previous</span>
							</button>

							<div className="text-center">
								<h2 className="text-2xl md:text-3xl font-bold text-white mb-1 transition-all duration-500">
									{locationData.city}
								</h2>
								<p className="text-white/60 text-sm mb-2">
									{locationData.country}
								</p>
								{/* Location indicator dots */}
								<div className="flex items-center justify-center gap-2">
									{DEMO_LOCATIONS.map((_, index) => (
										<button
											key={index}
											onClick={() => setCurrentLocationIndex(index)}
											className={`w-2 h-2 rounded-full transition-all duration-300 ${
												index === currentLocationIndex
													? 'bg-[#55DDCA] w-6'
													: 'bg-white/30 hover:bg-white/50'
											}`}
											aria-label={`Go to location ${index + 1}`}
										/>
									))}
								</div>
							</div>

							<button
								onClick={handleNextLocation}
								className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 active:scale-95"
								aria-label="Next location"
								tabIndex={0}
							>
								<span className="text-sm font-semibold">Next</span>
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</button>
						</div>

						{/* Keyboard hint */}
						<div className="text-center">
							<p className="text-white/40 text-xs flex items-center justify-center gap-2">
								<kbd className="px-2 py-1 bg-white/10 rounded text-[10px] border border-white/20">
									←
								</kbd>
								<span>Use arrow keys to navigate</span>
								<kbd className="px-2 py-1 bg-white/10 rounded text-[10px] border border-white/20">
									→
								</kbd>
							</p>
						</div>
					</div>
				</div>

				{/* Header section with glassmorphism */}
				{/* <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-30 text-center">
					<div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-8 py-4 shadow-2xl">
						<div className="flex items-center justify-center gap-3 mb-2">
							<svg
								className="w-8 h-8 md:w-10 md:h-10 text-[#55DDCA]"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z" />
							</svg>
							<h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
								Satellite Vision Toggle
							</h1>
							<svg
								className="w-8 h-8 md:w-10 md:h-10 text-[#00597C]"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<p className="text-sm md:text-base text-white/70 font-light tracking-wide">
							Slide to reveal the truth beneath the surface
						</p>
					</div>
				</div> */}

				{/* Comparison slider container */}
				<div className="relative w-full max-w-6xl">
					<div
						ref={containerRef}
						className={`relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl cursor-col-resize transition-opacity duration-300 ${
							isTransitioning ? 'opacity-50' : 'opacity-100'
						}`}
						style={{
							boxShadow:
								'0 25px 50px -12px rgba(0, 89, 124, 0.5), 0 0 100px -20px rgba(85, 221, 202, 0.3)',
						}}
					>
						{/* Right side - Satellite Truth (underneath layer) */}
						<div className="absolute inset-0">
							<div className="relative w-full h-full">
								{/* Placeholder satellite imagery with data overlay */}
								<div className="absolute inset-0 bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
									<div
										className="absolute inset-0 opacity-40"
										style={{
											backgroundImage: `
                      radial-gradient(circle at 20% 30%, rgba(239, 68, 68, 0.3) 0%, transparent 50%),
                      radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.4) 0%, transparent 50%),
                      radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.2) 0%, transparent 50%)
                    `,
										}}
									/>
									{/* Weather pattern overlay */}
									<div
										className="absolute inset-0 opacity-30"
										style={{
											backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
										}}
									/>
								</div>

								{/* Data visualization elements - Real Data */}
								<div className="absolute top-8 left-8 backdrop-blur-md bg-black/40 border border-red-500/30 rounded-xl px-4 py-3 text-white">
									<div className="flex items-center gap-2 mb-1">
										<div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
										<span className="text-xs font-semibold tracking-wider">
											POLLUTION DETECTED
										</span>
									</div>
									<p className="text-lg font-bold">
										{locationData.pollutionLevel}
									</p>
								</div>

								<div className="absolute top-8 right-8 backdrop-blur-md bg-black/40 border border-blue-500/30 rounded-xl px-4 py-3 text-white">
									<div className="flex items-center gap-2 mb-1">
										<div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
										<span className="text-xs font-semibold tracking-wider">
											CLOUD COVERAGE
										</span>
									</div>
									<p className="text-lg font-bold">
										{locationData.cloudCoverage}
									</p>
								</div>

								<div className="absolute bottom-8 left-8 backdrop-blur-md bg-black/40 border border-orange-500/30 rounded-xl px-4 py-3 text-white">
									<div className="flex items-center gap-2 mb-1">
										<div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
										<span className="text-xs font-semibold tracking-wider">
											TEMPERATURE
										</span>
									</div>
									<p className="text-lg font-bold">
										{locationData.temperature}
									</p>
								</div>

								{/* Copernicus branding */}
								<div className="absolute bottom-8 right-8 backdrop-blur-md bg-black/40 border border-[#55DDCA]/30 rounded-xl px-4 py-2 text-white">
									<p className="text-xs font-semibold tracking-wider text-[#55DDCA]">
										COPERNICUS SENTINEL
									</p>
								</div>

								{/* Left side label */}
								<button
									className="absolute left-4 top-1/2 transform -translate-y-1/2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-6 py-3 transition-all duration-500 hover:bg-white/20 hover:scale-105"
									onMouseEnter={() => setShowRightTooltip(true)}
									onMouseLeave={() => setShowRightTooltip(false)}
									tabIndex={0}
									aria-label="Satellite Truth Information"
								>
									<span className="text-white font-semibold text-sm tracking-wide">
										SATELLITE TRUTH
									</span>
								</button>
							</div>
						</div>

						{/* Left side - Tourist View (clipped overlay) */}
						<div
							className="absolute inset-0 transition-all duration-75"
							style={{
								clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
							}}
						>
							<div className="relative w-full h-full">
								{/* Vibrant tourist imagery */}
								<div className="absolute inset-0 bg-linear-to-br from-sky-400 via-blue-500 to-cyan-400">
									<div
										className="absolute inset-0 opacity-60"
										style={{
											backgroundImage: `
                      radial-gradient(circle at 30% 40%, rgba(251, 191, 36, 0.4) 0%, transparent 50%),
                      radial-gradient(circle at 70% 60%, rgba(34, 197, 94, 0.5) 0%, transparent 50%),
                      radial-gradient(circle at 50% 80%, rgba(59, 130, 246, 0.6) 0%, transparent 50%)
                    `,
										}}
									/>
									{/* Sun rays effect */}
									<div className="absolute top-10 right-10 w-32 h-32 bg-yellow-300 rounded-full blur-3xl opacity-50" />
								</div>

								{/* Tourist highlights */}
								<div className="absolute top-8 left-8 backdrop-blur-md bg-white/30 border border-white/50 rounded-xl px-4 py-3 text-white shadow-lg">
									<div className="flex items-center gap-2 mb-1">
										<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
										<span className="text-xs font-semibold tracking-wider text-white/90">
											PERFECT CONDITIONS
										</span>
									</div>
									<p className="text-lg font-bold">Air Quality: Excellent</p>
								</div>

								<div className="absolute top-8 right-8 backdrop-blur-md bg-white/30 border border-white/50 rounded-xl px-4 py-3 text-white shadow-lg">
									<div className="flex items-center gap-2 mb-1">
										<div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse" />
										<span className="text-xs font-semibold tracking-wider text-white/90">
											VISIBILITY
										</span>
									</div>
									<p className="text-lg font-bold">Crystal Clear</p>
								</div>

								<div className="absolute bottom-8 left-8 backdrop-blur-md bg-white/30 border border-white/50 rounded-xl px-4 py-3 text-white shadow-lg">
									<div className="flex items-center gap-2 mb-1">
										<div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
										<span className="text-xs font-semibold tracking-wider text-white/90">
											TEMPERATURE
										</span>
									</div>
									<p className="text-lg font-bold">24°C Perfect</p>
								</div>

								{/* Right side label */}
								<button
									className="absolute right-4 top-1/2 transform -translate-y-1/2 backdrop-blur-xl bg-white/30 border border-white/40 rounded-2xl px-6 py-3 transition-all duration-500 hover:bg-white/40 hover:scale-105"
									onMouseEnter={() => setShowLeftTooltip(true)}
									onMouseLeave={() => setShowLeftTooltip(false)}
									tabIndex={0}
									aria-label="Tourist View Information"
								>
									<span className="text-white font-semibold text-sm tracking-wide">
										TOURIST VIEW
									</span>
								</button>
							</div>
						</div>

						{/* Slider handle */}
						<div
							className="absolute top-0 bottom-0 w-1 z-20 transition-all duration-75"
							style={{ left: `${sliderPosition}%` }}
						>
							{/* Vertical line with glow */}
							<div className="absolute inset-0 bg-linear-to-b from-[#55DDCA] via-white to-[#00597C] shadow-[0_0_30px_rgba(85,221,202,0.8)]" />

							{/* Interactive handle */}
							<div
								className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-col-resize"
								onMouseDown={handleMouseDown}
								onTouchStart={handleMouseDown}
								onMouseEnter={() => setIsHoveringHandle(true)}
								onMouseLeave={() => setIsHoveringHandle(false)}
								role="slider"
								aria-valuenow={sliderPosition}
								aria-valuemin={0}
								aria-valuemax={100}
								aria-label="Comparison slider"
								tabIndex={0}
							>
								{/* Outer glow ring */}
								<div
									className={`absolute inset-0 rounded-full transition-all duration-300 ${
										isHoveringHandle || isDragging
											? 'scale-150 opacity-30'
											: 'scale-100 opacity-0'
									}`}
									style={{
										width: '80px',
										height: '80px',
										background:
											'radial-gradient(circle, rgba(85,221,202,0.6) 0%, transparent 70%)',
										transform: 'translate(-50%, -50%)',
										left: '50%',
										top: '50%',
									}}
								/>

								{/* Main handle circle */}
								<div
									className={`relative w-16 h-16 rounded-full backdrop-blur-xl bg-white/20 border-4 flex items-center justify-center shadow-2xl transition-all duration-300 ${
										isHoveringHandle || isDragging
											? 'scale-110 border-[#55DDCA]'
											: 'border-white/50'
									}`}
									style={{
										boxShadow:
											isHoveringHandle || isDragging
												? '0 0 30px rgba(85,221,202,0.8), 0 0 60px rgba(0,89,124,0.5)'
												: '0 10px 30px rgba(0,0,0,0.3)',
									}}
								>
									{/* Arrow icons */}
									<div className="flex items-center gap-1">
										<svg
											className="w-4 h-4 text-white"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={3}
												d="M15 19l-7-7 7-7"
											/>
										</svg>
										<svg
											className="w-4 h-4 text-white"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={3}
												d="M9 5l7 7-7 7"
											/>
										</svg>
									</div>

									{/* Animated ring */}
									<div
										className={`absolute inset-0 rounded-full border-2 border-[#55DDCA] transition-all duration-1000 ${
											isHoveringHandle || isDragging
												? 'animate-ping opacity-50'
												: 'opacity-0'
										}`}
									/>
								</div>
							</div>
						</div>

						{/* Comparison line accent glow */}
						<div
							className="absolute top-0 bottom-0 w-0.5 pointer-events-none opacity-50 blur-sm"
							style={{
								left: `${sliderPosition}%`,
								background:
									'linear-gradient(to bottom, #55DDCA, white, #00597C)',
							}}
						/>
					</div>

					{/* Slider Description - Always visible below slider */}
					<div className="mt-8 w-full">
						<div className="backdrop-blur-2xl bg-black/70 border border-white/20 rounded-2xl px-6 py-5 shadow-2xl transition-all duration-300">
							<div className="flex items-center justify-between mb-3">
								<h3 className="text-white font-bold text-xl">
									{getCurrentViewData().title}
								</h3>
								<div className="flex items-center gap-2">
									<div
										className={`w-2.5 h-2.5 rounded-full ${
											getCurrentViewData().dominant
												? 'bg-[#55DDCA]'
												: 'bg-yellow-400'
										} animate-pulse`}
									/>
									<span className="text-white/70 text-sm font-mono font-semibold">
										{getCurrentViewData().percentage}%
									</span>
								</div>
							</div>
							<p className="text-white/90 text-base mb-3 leading-relaxed">
								{getCurrentViewData().description}
							</p>
							<p className="text-white/60 text-sm leading-relaxed italic border-l-2 border-[#55DDCA]/50 pl-4">
								{getCurrentViewData().details}
							</p>
						</div>
					</div>
				</div>

				{/* Enhanced Bottom Info Panel with Location & Live Data - Spotify Style */}
				<div className="relative w-full max-w-7xl mx-auto">
					<div className="backdrop-blur-2xl bg-black/60 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
						<div className="grid grid-cols-2 md:grid-cols-5 gap-6 p-6 md:p-8">
							{/* Current Location - Prominent */}
							<div className="col-span-2 md:col-span-1">
								<div className="flex items-center gap-2 mb-3">
									<div className="w-2 h-2 bg-[#55DDCA] rounded-full animate-pulse" />
									<p className="text-white/50 text-xs font-medium tracking-wide uppercase">
										Current Location
									</p>
								</div>
								<p className="text-white font-bold text-xl mb-1">
									{locationData.city}
								</p>
								<p className="text-white/40 text-sm mb-3">
									{locationData.country}
								</p>
								<div className="flex gap-3 text-xs text-white/30 font-mono">
									<span>{locationData.lat.toFixed(4)}°</span>
									<span>{locationData.lon.toFixed(4)}°</span>
								</div>
							</div>

							{/* Live Time */}
							<div>
								<p className="text-white/50 text-xs font-medium tracking-wide uppercase mb-3">
									Local Time
								</p>
								<p className="text-white font-bold text-xl font-mono mb-1">
									{currentTime.toLocaleTimeString('en-US', {
										hour: '2-digit',
										minute: '2-digit',
										second: '2-digit',
										hour12: false,
									})}
								</p>
								<p className="text-white/40 text-sm">
									{currentTime.toLocaleDateString('en-US', {
										month: 'short',
										day: 'numeric',
										year: 'numeric',
									})}
								</p>
							</div>

							{/* Data Source */}
							<div>
								<p className="text-white/50 text-xs font-medium tracking-wide uppercase mb-3">
									Data Source
								</p>
								<p className="text-white font-bold text-lg">Copernicus</p>
								<p className="text-white/40 text-sm mt-1">Sentinel-2 MSI</p>
							</div>

							{/* Update Frequency */}
							<div>
								<p className="text-white/50 text-xs font-medium tracking-wide uppercase mb-3">
									Updates
								</p>
								<p className="text-white font-bold text-lg">Real-time</p>
								<p className="text-white/40 text-sm mt-1">Every 5 days</p>
							</div>

							{/* Resolution */}
							<div>
								<p className="text-white/50 text-xs font-medium tracking-wide uppercase mb-3">
									Resolution
								</p>
								<p className="text-white font-bold text-lg">10m/pixel</p>
								<p className="text-white/40 text-sm mt-1">High-Def</p>
							</div>
						</div>
					</div>
				</div>

				{/* Tooltips */}
				{showLeftTooltip && (
					<div className="absolute left-1/2 transform -translate-x-1/2 top-32 z-40 pointer-events-none">
						<div className="backdrop-blur-2xl bg-white/10 border border-white/30 rounded-2xl px-6 py-4 max-w-md shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
							<h3 className="text-white font-bold text-lg mb-2">
								{TOURIST_VIEW.title}
							</h3>
							<p className="text-white/80 text-sm leading-relaxed mb-2">
								{TOURIST_VIEW.description}
							</p>
							<p className="text-white/60 text-xs leading-relaxed italic">
								{TOURIST_VIEW.details}
							</p>
						</div>
					</div>
				)}

				{showRightTooltip && (
					<div className="absolute left-1/2 transform -translate-x-1/2 top-32 z-40 pointer-events-none">
						<div className="backdrop-blur-2xl bg-white/10 border border-white/30 rounded-2xl px-6 py-4 max-w-md shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
							<h3 className="text-white font-bold text-lg mb-2">
								{SATELLITE_TRUTH.title}
							</h3>
							<p className="text-white/80 text-sm leading-relaxed mb-2">
								{SATELLITE_TRUTH.description}
							</p>
							<p className="text-white/60 text-xs leading-relaxed italic">
								{SATELLITE_TRUTH.details}
							</p>
						</div>
					</div>
				)}

				{/* Portal opening effect on edges */}
				<div
					className="absolute inset-0 pointer-events-none transition-opacity duration-300"
					style={{
						opacity: isDragging ? 0.5 : 0,
						background:
							'radial-gradient(circle at center, transparent 60%, rgba(85,221,202,0.2) 100%)',
					}}
				/>
			</div>
		</div>
	)
}
