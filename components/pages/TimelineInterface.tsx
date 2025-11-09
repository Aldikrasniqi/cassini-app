'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import {
	MapPin,
	Cloud,
	CloudRain,
	Wind,
	Sun,
	CloudSnow,
	Zap,
	AlertTriangle,
	Shield,
	Navigation,
	Clock,
	WifiOff,
	Satellite,
	Activity,
	TrendingUp,
	Eye,
	Thermometer,
	Download,
	CheckCircle2,
	Wifi,
} from 'lucide-react'

interface TimelinePoint {
	id: string
	hour: number
	timestamp: Date
	weather: 'clear' | 'cloudy' | 'rain' | 'storm' | 'snow'
	temperature: number
	riskLevel: 'safe' | 'caution' | 'danger'
	windSpeed: number
	radiation: number
	description: string
	location: string
}

// Generate realistic 48-hour prediction data
const generateTimelineData = (): TimelinePoint[] => {
	const now = new Date()
	const data: TimelinePoint[] = []
	const weatherTypes: TimelinePoint['weather'][] = [
		'clear',
		'cloudy',
		'rain',
		'storm',
		'snow',
	]
	const riskLevels: TimelinePoint['riskLevel'][] = [
		'safe',
		'safe',
		'safe',
		'caution',
		'danger',
	]
	const locations = [
		'Stockholm',
		'Copenhagen',
		'Oslo',
		'Helsinki',
		'Reykjavik',
		'Bergen',
	]

	for (let i = 0; i < 48; i++) {
		const timestamp = new Date(now.getTime() + i * 60 * 60 * 1000)
		const hour = timestamp.getHours()

		// Create more realistic weather progression
		let weather: TimelinePoint['weather']
		let riskLevel: TimelinePoint['riskLevel']

		if (i < 8) {
			weather = 'clear'
			riskLevel = 'safe'
		} else if (i < 16) {
			weather = i % 3 === 0 ? 'cloudy' : 'clear'
			riskLevel = 'safe'
		} else if (i < 28) {
			weather = ['cloudy', 'rain', 'cloudy'][i % 3] as TimelinePoint['weather']
			riskLevel = i % 5 === 0 ? 'caution' : 'safe'
		} else if (i < 38) {
			weather = ['rain', 'storm', 'rain'][i % 3] as TimelinePoint['weather']
			riskLevel = i % 3 === 0 ? 'danger' : 'caution'
		} else {
			weather = ['cloudy', 'clear', 'cloudy'][i % 3] as TimelinePoint['weather']
			riskLevel = 'safe'
		}

		data.push({
			id: `hour-${i}`,
			hour: i,
			timestamp,
			weather,
			temperature: Math.round(15 + Math.sin(i / 5) * 8 + Math.random() * 5),
			riskLevel,
			windSpeed: Math.round(5 + Math.random() * 20),
			radiation: Math.round((0.5 + Math.random() * 1.5) * 10) / 10,
			description:
				riskLevel === 'danger'
					? 'High storm activity'
					: riskLevel === 'caution'
					? 'Moderate conditions'
					: 'Optimal conditions',
			location: locations[Math.floor(i / 8) % locations.length],
		})
	}

	return data
}

const getWeatherIcon = (weather: TimelinePoint['weather']) => {
	switch (weather) {
		case 'clear':
			return Sun
		case 'cloudy':
			return Cloud
		case 'rain':
			return CloudRain
		case 'storm':
			return Zap
		case 'snow':
			return CloudSnow
		default:
			return Cloud
	}
}

const getRiskConfig = (riskLevel: TimelinePoint['riskLevel']) => {
	switch (riskLevel) {
		case 'safe':
			return {
				color: 'text-emerald-400',
				bgGradient: 'from-emerald-500/20 to-green-600/5',
				borderColor: 'border-emerald-400/30',
				glowColor: 'shadow-emerald-400/50',
				pulseColor: 'bg-emerald-400',
				label: 'SAFE ZONE',
				icon: Shield,
			}
		case 'caution':
			return {
				color: 'text-amber-400',
				bgGradient: 'from-amber-500/20 to-orange-600/5',
				borderColor: 'border-amber-400/30',
				glowColor: 'shadow-amber-400/50',
				pulseColor: 'bg-amber-400',
				label: 'CAUTION ZONE',
				icon: AlertTriangle,
			}
		case 'danger':
			return {
				color: 'text-red-400',
				bgGradient: 'from-red-500/20 to-red-600/5',
				borderColor: 'border-red-400/40',
				glowColor: 'shadow-red-400/60',
				pulseColor: 'bg-red-400',
				label: 'DANGER ZONE',
				icon: Zap,
			}
	}
}

export const TimelineInterface = () => {
	const [timelineData] = useState<TimelinePoint[]>(generateTimelineData())
	const [currentHour, setCurrentHour] = useState(0)
	const [isOffline, setIsOffline] = useState(false)
	const [autoScroll, setAutoScroll] = useState(true)
	const [isDownloading, setIsDownloading] = useState(false)
	const [downloadComplete, setDownloadComplete] = useState(false)
	const [downloadProgress, setDownloadProgress] = useState(0)
	const scrollRef = useRef<HTMLDivElement>(null)
	const timelineRef = useRef<HTMLDivElement>(null)

	// Auto-scroll animation
	useEffect(() => {
		if (!autoScroll || !timelineRef.current) return

		const interval = setInterval(() => {
			setCurrentHour((prev) => (prev + 1) % 48)
		}, 3000)

		return () => clearInterval(interval)
	}, [autoScroll])

	// Scroll to current hour
	useEffect(() => {
		if (!timelineRef.current) return

		const element = timelineRef.current.children[currentHour] as HTMLElement
		if (element) {
			element.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'center',
			})
		}
	}, [currentHour])

	const handleTimelineClick = (hour: number) => {
		setCurrentHour(hour)
		setAutoScroll(false)
	}

	const handleDownloadPrediction = () => {
		if (isDownloading) return

		setIsDownloading(true)
		setDownloadProgress(0)
		setDownloadComplete(false)

		// Simulate download progress
		const interval = setInterval(() => {
			setDownloadProgress((prev) => {
				if (prev >= 100) {
					clearInterval(interval)
					return 100
				}
				return prev + 10
			})
		}, 150)

		// Complete download and go offline
		setTimeout(() => {
			setIsDownloading(false)
			setDownloadComplete(true)
			setIsOffline(true)

			// Reset download complete state after 3 seconds
			setTimeout(() => {
				setDownloadComplete(false)
			}, 3000)
		}, 1800)
	}

	const handleToggleOffline = () => {
		setIsOffline((prev) => !prev)
	}

	const currentPoint = timelineData[currentHour]
	const riskConfig = getRiskConfig(currentPoint.riskLevel)
	const WeatherIcon = getWeatherIcon(currentPoint.weather)
	const RiskIcon = riskConfig.icon

	return (
		<div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-black text-slate-100 overflow-hidden relative">
			{/* Cinematic ambient background layers */}
			<div className="fixed inset-0 pointer-events-none overflow-hidden">
				{/* Deep space gradient */}
				<div className="absolute inset-0 bg-linear-to-b from-blue-950/20 via-transparent to-purple-950/20" />

				{/* Animated light orbs - Blade Runner style */}
				<div
					className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"
					style={{ animationDuration: '4s' }}
				/>
				<div
					className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse"
					style={{ animationDelay: '2s', animationDuration: '5s' }}
				/>
				<div
					className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-500/5 rounded-full blur-3xl animate-pulse"
					style={{ animationDelay: '1s', animationDuration: '6s' }}
				/>

				{/* Parallax grid lines */}
				<div className="absolute inset-0 opacity-[0.02]">
					<div
						className="absolute inset-0"
						style={{
							backgroundImage: `
								linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
								linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
							`,
							backgroundSize: '60px 60px',
						}}
					/>
				</div>

				{/* Floating particles */}
				{[...Array(15)].map((_, i) => (
					<div
						key={i}
						className="absolute w-1 h-1 bg-blue-400/30 rounded-full particle-float"
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
							animationDelay: `${Math.random() * 4}s`,
							animationDuration: `${4 + Math.random() * 4}s`,
						}}
					/>
				))}
			</div>

			{/* Main content */}
			<div
				ref={scrollRef}
				className="relative z-10 h-screen overflow-y-auto scrollbar-hide"
				style={{
					scrollBehavior: 'smooth',
					WebkitOverflowScrolling: 'touch',
				}}
			>
				{/* Main Timeline - Horizontal cinematic scroll */}
				<div className="px-4 md:px-6 py-6 md:py-8 pt-4 md:pt-6">
					{/* Title and controls */}
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
						<div>
							<h1 className="text-2xl md:text-3xl font-bold mb-1 text-white">
								The 48-Hour Timeline
							</h1>
							<p className="text-xs md:text-sm text-slate-400">
								Scroll through time to see predicted conditions
							</p>
						</div>

						{/* Status indicators and controls */}
						<div className="flex items-center gap-2 md:gap-3 flex-wrap">
							{/* Connection status indicator */}
							<button
								onClick={handleToggleOffline}
								onKeyDown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault()
										handleToggleOffline()
									}
								}}
								tabIndex={0}
								aria-label={isOffline ? 'Go online' : 'Go offline'}
								className={cn(
									'flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 rounded-full backdrop-blur-xl border transition-all duration-300',
									'touch-manipulation hover:scale-105 active:scale-95',
									isOffline
										? 'bg-slate-900/50 border-slate-700/50'
										: 'bg-emerald-950/30 border-emerald-500/30'
								)}
							>
								{isOffline ? (
									<>
										<WifiOff className="w-3 md:w-3.5 h-3 md:h-3.5 text-slate-400 animate-pulse" />
										<span className="text-[10px] md:text-xs text-slate-400 font-medium hidden sm:inline">
											Offline Mode
										</span>
										<span className="text-[10px] text-slate-400 font-medium sm:hidden">
											Offline
										</span>
									</>
								) : (
									<>
										<div className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-emerald-400 animate-pulse" />
										<span className="text-[10px] md:text-xs text-emerald-400 font-medium">
											Online
										</span>
									</>
								)}
							</button>

							{/* Download prediction button */}
							{!isOffline && (
								<button
									onClick={handleDownloadPrediction}
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.preventDefault()
											handleDownloadPrediction()
										}
									}}
									disabled={isDownloading}
									tabIndex={0}
									aria-label="Download 48-hour prediction"
									className={cn(
										'flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-medium transition-all duration-300',
										'backdrop-blur-xl touch-manipulation border',
										'hover:scale-105 active:scale-95',
										downloadComplete
											? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-400'
											: isDownloading
											? 'bg-blue-500/20 border-blue-400/30 text-blue-400'
											: 'bg-slate-900/50 border-slate-700/50 text-white hover:bg-slate-900/70'
									)}
								>
									{downloadComplete ? (
										<>
											<CheckCircle2 className="w-3.5 md:w-4 h-3.5 md:h-4" />
											<span className="hidden sm:inline">Downloaded</span>
											<span className="sm:hidden">✓</span>
										</>
									) : isDownloading ? (
										<>
											<Download className="w-3.5 md:w-4 h-3.5 md:h-4 animate-bounce" />
											<span>{downloadProgress}%</span>
										</>
									) : (
										<>
											<Download className="w-3.5 md:w-4 h-3.5 md:h-4" />
											<span className="hidden sm:inline">Download 48h</span>
											<span className="sm:hidden">Download</span>
										</>
									)}
								</button>
							)}

							{/* Auto-scroll toggle */}
							<button
								onClick={() => setAutoScroll(!autoScroll)}
								onKeyDown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault()
										setAutoScroll(!autoScroll)
									}
								}}
								tabIndex={0}
								aria-label={
									autoScroll ? 'Pause auto-scroll' : 'Enable auto-scroll'
								}
								className={cn(
									'px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-medium transition-all duration-300',
									'backdrop-blur-xl touch-manipulation border',
									autoScroll
										? 'bg-slate-900/50 border-slate-700/50 text-white'
										: 'bg-slate-900/30 border-slate-700/30 text-slate-400 hover:text-slate-300 hover:border-slate-600/50'
								)}
							>
								{autoScroll ? 'Playing' : 'Paused'}
							</button>
						</div>
					</div>

					{/* Horizontal Timeline Container */}
					<div className="relative">
						{/* Timeline rail/track */}
						<div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-1 bg-slate-800/50 rounded-full">
							{/* Animated energy flow on rail */}
							<div className="absolute inset-0 bg-linear-to-r from-transparent via-emerald-400/50 to-transparent animate-pulse rounded-full" />
						</div>

						{/* Scrollable timeline points */}
						<div
							ref={timelineRef}
							className="flex gap-4 overflow-x-auto scrollbar-hide py-12 px-4"
							style={{
								scrollBehavior: 'smooth',
								WebkitOverflowScrolling: 'touch',
							}}
						>
							{timelineData.map((point, index) => {
								const config = getRiskConfig(point.riskLevel)
								const Icon = getWeatherIcon(point.weather)
								const isActive = index === currentHour
								const isPast = index < currentHour
								const isFuture = index > currentHour

								return (
									<button
										key={point.id}
										onClick={() => handleTimelineClick(index)}
										onKeyDown={(e) => {
											if (e.key === 'Enter' || e.key === ' ') {
												e.preventDefault()
												handleTimelineClick(index)
											}
										}}
										tabIndex={0}
										aria-label={`Hour ${point.hour}: ${point.description}, ${point.temperature}°C`}
										className={cn(
											'shrink-0 w-40 transition-all duration-500 touch-manipulation',
											'hover:scale-105 focus:outline-none',
											isActive && 'scale-110 z-20'
										)}
									>
										{/* Timeline point card */}
										<div
											className={cn(
												'relative rounded-2xl p-4 backdrop-blur-xl border transition-all duration-500',
												'hover:shadow-2xl',
												isActive
													? `${config.borderColor} bg-slate-900/60 ${config.glowColor} shadow-2xl`
													: isPast
													? 'bg-slate-900/20 border-slate-700/20 opacity-40'
													: 'bg-slate-900/30 border-slate-700/30'
											)}
											style={{
												boxShadow: isActive
													? `0 0 40px ${
															point.riskLevel === 'safe'
																? 'rgba(52, 211, 153, 0.3)'
																: point.riskLevel === 'caution'
																? 'rgba(251, 191, 36, 0.3)'
																: 'rgba(248, 113, 113, 0.4)'
													  }`
													: 'none',
											}}
										>
											{/* Hour indicator */}
											<div className="text-center mb-3">
												<div
													className={cn(
														'text-lg font-bold font-mono',
														isActive ? config.color : 'text-slate-400'
													)}
												>
													{point.timestamp.toLocaleTimeString('en-US', {
														hour: '2-digit',
														minute: '2-digit',
														hour12: false,
													})}
												</div>
												<div className="text-xs text-slate-500 font-mono">
													+{point.hour}h
												</div>
											</div>

											{/* Weather icon with glow */}
											<div className="flex justify-center mb-3">
												<div
													className={cn(
														'relative w-14 h-14 rounded-full flex items-center justify-center',
														`bg-linear-to-br ${config.bgGradient}`,
														isActive && 'animate-pulse'
													)}
												>
													<Icon
														className={cn(
															'w-7 h-7',
															isActive ? config.color : 'text-slate-400'
														)}
													/>
													{isActive && (
														<div
															className={cn(
																'absolute inset-0 rounded-full blur-lg opacity-50',
																config.pulseColor
															)}
														/>
													)}
												</div>
											</div>

											{/* Temperature */}
											<div className="text-center mb-2">
												<span
													className={cn(
														'text-xl font-bold font-mono',
														isActive ? 'text-white' : 'text-slate-300'
													)}
												>
													{point.temperature}°
												</span>
											</div>

											{/* Risk level indicator */}
											<div
												className={cn(
													'w-full h-1 rounded-full mb-2',
													point.riskLevel === 'safe'
														? 'bg-emerald-500'
														: point.riskLevel === 'caution'
														? 'bg-amber-500'
														: 'bg-red-500',
													isActive && 'animate-pulse'
												)}
											/>

											{/* Additional data for active point */}
											{isActive && (
												<div className="mt-3 pt-3 border-t border-slate-700/30 space-y-2">
													<div className="flex items-center justify-between text-xs">
														<span className="text-slate-400">Wind</span>
														<span
															className={cn(
																'font-mono font-medium',
																config.color
															)}
														>
															{point.windSpeed} km/h
														</span>
													</div>
													<div className="flex items-center justify-between text-xs">
														<span className="text-slate-400">Radiation</span>
														<span
															className={cn(
																'font-mono font-medium',
																config.color
															)}
														>
															{point.radiation} mSv/h
														</span>
													</div>
												</div>
											)}
										</div>

										{/* Connection line to rail */}
										<div
											className={cn(
												'mx-auto w-0.5 h-8 transition-all duration-300',
												isActive ? config.pulseColor : 'bg-slate-700/30'
											)}
										/>
									</button>
								)
							})}
						</div>
					</div>

					{/* Detailed forecast panel - Apple inspired clean design */}
					<div className="mt-12 backdrop-blur-xl bg-slate-900/40 rounded-3xl border border-slate-700/50 overflow-hidden mb-32">
						{/* Header section with location info */}
						<div className="px-6 py-5 border-b border-slate-700/50">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-4">
									<div>
										<div className="flex items-center gap-2 mb-0.5">
											<span className="text-sm font-semibold text-emerald-400 uppercase tracking-wide">
												You Are Here
											</span>
											<Navigation className="w-3.5 h-3.5 text-emerald-400" />
										</div>
										<p className="text-base font-medium text-white">
											{currentPoint.location}
										</p>
										<div className="flex items-center gap-2 mt-0.5">
											<p className="text-xs text-slate-400">
												{currentPoint.timestamp.toLocaleTimeString('en-US', {
													hour: '2-digit',
													minute: '2-digit',
													hour12: false,
												})}{' '}
												• Scanning {48 - currentHour}h ahead
											</p>
											{isOffline && (
												<div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800/50 border border-slate-700/50">
													<WifiOff className="w-3 h-3 text-amber-400" />
													<span className="text-[10px] text-amber-400 font-medium uppercase tracking-wider">
														Cached Data
													</span>
												</div>
											)}
										</div>
									</div>
								</div>

								{/* Current conditions badge */}
								<div className="text-right">
									<div className="flex items-center justify-end gap-2 mb-2">
										<WeatherIcon className={cn('w-7 h-7', riskConfig.color)} />
										<span className="text-3xl font-semibold">
											{currentPoint.temperature}°
										</span>
									</div>
									<div
										className={cn(
											'inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full',
											'bg-slate-800/50 border border-slate-700/50'
										)}
									>
										<div
											className={cn(
												'w-1.5 h-1.5 rounded-full',
												currentPoint.riskLevel === 'safe'
													? 'bg-emerald-400'
													: currentPoint.riskLevel === 'caution'
													? 'bg-amber-400'
													: 'bg-red-400'
											)}
										/>
										<span className="text-slate-300">{riskConfig.label}</span>
									</div>
								</div>
							</div>
						</div>

						{/* Metrics grid - clean Apple-style cards */}
						<div className="p-6">
							<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
								{/* Temperature */}
								<div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/30">
									<div className="flex items-center gap-2 mb-3">
										<div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
											<Thermometer className="w-4 h-4 text-orange-400" />
										</div>
										<span className="text-xs text-slate-400 font-medium">
											Temperature
										</span>
									</div>
									<div className="text-2xl font-semibold text-white">
										{currentPoint.temperature}°C
									</div>
								</div>

								{/* Wind */}
								<div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/30">
									<div className="flex items-center gap-2 mb-3">
										<div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center">
											<Wind className="w-4 h-4 text-cyan-400" />
										</div>
										<span className="text-xs text-slate-400 font-medium">
											Wind
										</span>
									</div>
									<div className="text-2xl font-semibold text-white">
										{currentPoint.windSpeed}
										<span className="text-sm text-slate-400 ml-1 font-normal">
											km/h
										</span>
									</div>
								</div>

								{/* Radiation */}
								<div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/30">
									<div className="flex items-center gap-2 mb-3">
										<div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
											<Activity className="w-4 h-4 text-purple-400" />
										</div>
										<span className="text-xs text-slate-400 font-medium">
											Radiation
										</span>
									</div>
									<div className="text-2xl font-semibold text-white">
										{currentPoint.radiation}
										<span className="text-sm text-slate-400 ml-1 font-normal">
											mSv
										</span>
									</div>
								</div>

								{/* Visibility */}
								<div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/30">
									<div className="flex items-center gap-2 mb-3">
										<div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
											<Eye className="w-4 h-4 text-emerald-400" />
										</div>
										<span className="text-xs text-slate-400 font-medium">
											Visibility
										</span>
									</div>
									<div className="text-2xl font-semibold text-white">
										{currentPoint.weather === 'clear'
											? 'High'
											: currentPoint.weather === 'storm'
											? 'Low'
											: 'Medium'}
									</div>
								</div>
							</div>

							{/* Mission recommendation - clean card */}
							<div className="mt-4 bg-slate-800/40 rounded-2xl p-5 border border-slate-700/30">
								<div className="flex items-start gap-4">
									<div
										className={cn(
											'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
											currentPoint.riskLevel === 'safe'
												? 'bg-emerald-500/10'
												: currentPoint.riskLevel === 'caution'
												? 'bg-amber-500/10'
												: 'bg-red-500/10'
										)}
									>
										<RiskIcon className={cn('w-5 h-5', riskConfig.color)} />
									</div>
									<div className="flex-1">
										<h4 className="font-medium text-white mb-1.5">
											Recommendation
										</h4>
										<p className="text-sm text-slate-400 leading-relaxed">
											{currentPoint.riskLevel === 'safe'
												? 'Optimal conditions for all operations. All systems nominal. Proceed with confidence.'
												: currentPoint.riskLevel === 'caution'
												? 'Moderate risk detected. Enhanced monitoring recommended. Prepare contingency protocols.'
												: 'Critical conditions ahead. Immediate shelter advised. Activate emergency procedures.'}
										</p>
									</div>
								</div>
							</div>

							{/* Offline mode information banner */}
							{isOffline && (
								<div className="mt-4 bg-linear-to-r from-amber-500/10 to-orange-500/10 rounded-2xl p-5 border border-amber-500/20">
									<div className="flex items-start gap-4">
										<div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
											<WifiOff className="w-5 h-5 text-amber-400" />
										</div>
										<div className="flex-1">
											<h4 className="font-medium text-white mb-1.5 flex items-center gap-2">
												Offline Mode Active
												<span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-medium">
													Cached
												</span>
											</h4>
											<p className="text-sm text-slate-400 leading-relaxed mb-3">
												You're viewing previously downloaded prediction data.
												The forecast remains accurate for your downloaded
												timeframe. Reconnect to get live updates.
											</p>
											<button
												onClick={handleToggleOffline}
												onKeyDown={(e) => {
													if (e.key === 'Enter' || e.key === ' ') {
														e.preventDefault()
														handleToggleOffline()
													}
												}}
												tabIndex={0}
												aria-label="Go back online"
												className={cn(
													'flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300',
													'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400',
													'hover:bg-emerald-500/20 hover:border-emerald-500/50',
													'touch-manipulation hover:scale-105 active:scale-95'
												)}
											>
												<Wifi className="w-3.5 h-3.5" />
												<span>Reconnect to Network</span>
											</button>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
