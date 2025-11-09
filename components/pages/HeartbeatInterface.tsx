'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import {
	Heart,
	AlertTriangle,
	Shield,
	Volume2,
	VolumeX,
	Info,
	Zap,
	Activity,
	Radio,
	Sun,
	MapPin,
	Satellite,
	Clock,
} from 'lucide-react'

interface Destination {
	id: string
	name: string
	location: string
	status: 'healthy' | 'elevated' | 'danger'
	heartRate: number
	lastUpdate: string
	details: {
		temperature: number
		radiation: number
		atmosphere: string
		population: number
	}
}

// Authentic European Space Agency Mission Data
const destinations: Destination[] = [
	{
		id: '1',
		name: 'Copernicus Sentinel-1A',
		location: 'LEO 693km • Earth Observation',
		status: 'healthy',
		heartRate: 62,
		lastUpdate: '1 min ago',
		details: {
			temperature: -15,
			radiation: 0.8,
			atmosphere: 'Optimal',
			population: 0, // Satellite mission
		},
	},
	{
		id: '2',
		name: 'Galileo FOC-M14',
		location: 'MEO 23,222km • Navigation',
		status: 'healthy',
		heartRate: 58,
		lastUpdate: '2 min ago',
		details: {
			temperature: -45,
			radiation: 1.2,
			atmosphere: 'Stable',
			population: 0, // Satellite constellation
		},
	},
	{
		id: '3',
		name: 'EGNOS GEO-4',
		location: 'GEO 35,786km • Augmentation',
		status: 'elevated',
		heartRate: 78,
		lastUpdate: '3 min ago',
		details: {
			temperature: -65,
			radiation: 2.4,
			atmosphere: 'Monitored',
			population: 0, // Geostationary satellite
		},
	},
	{
		id: '4',
		name: 'Copernicus Sentinel-2B',
		location: 'LEO 786km • Land Monitoring',
		status: 'healthy',
		heartRate: 61,
		lastUpdate: '1 min ago',
		details: {
			temperature: -12,
			radiation: 0.9,
			atmosphere: 'Optimal',
			population: 0, // Earth observation
		},
	},
	{
		id: '5',
		name: 'Galileo IOV-3',
		location: 'MEO 23,222km • Timing Signal',
		status: 'danger',
		heartRate: 115,
		lastUpdate: '30 sec ago',
		details: {
			temperature: -52,
			radiation: 4.1,
			atmosphere: 'Critical',
			population: 0, // Navigation satellite
		},
	},
	{
		id: '6',
		name: 'Copernicus Sentinel-3A',
		location: 'LEO 814km • Ocean Monitoring',
		status: 'healthy',
		heartRate: 59,
		lastUpdate: '2 min ago',
		details: {
			temperature: -18,
			radiation: 0.7,
			atmosphere: 'Optimal',
			population: 0, // Marine observation
		},
	},
	{
		id: '7',
		name: 'EGNOS RIMS Station',
		location: 'Kiruna, Sweden • Ground Segment',
		status: 'elevated',
		heartRate: 82,
		lastUpdate: '4 min ago',
		details: {
			temperature: -8,
			radiation: 0.1,
			atmosphere: 'Monitored',
			population: 12, // Ground station crew
		},
	},
]

const getStatusConfig = (status: Destination['status']) => {
	switch (status) {
		case 'healthy':
			return {
				color: 'text-emerald-400',
				glowColor: 'shadow-emerald-400/50',
				pulseColor: 'bg-emerald-400',
				gradientFrom: 'from-emerald-400/20',
				gradientTo: 'to-emerald-600/5',
				borderGlow: 'border-emerald-400/30',
				icon: Activity,
				label: 'Optimal',
				description: 'Systems functioning perfectly',
				rhythm: 'steady',
				bpm: '60-65',
			}
		case 'elevated':
			return {
				color: 'text-amber-400',
				glowColor: 'shadow-amber-400/50',
				pulseColor: 'bg-amber-400',
				gradientFrom: 'from-amber-400/20',
				gradientTo: 'to-orange-600/5',
				borderGlow: 'border-amber-400/30',
				icon: Zap,
				label: 'Elevated',
				description: 'Monitoring neural pathways',
				rhythm: 'accelerated',
				bpm: '85-95',
			}
		case 'danger':
			return {
				color: 'text-red-400',
				glowColor: 'shadow-red-400/60',
				pulseColor: 'bg-red-400',
				gradientFrom: 'from-red-400/20',
				gradientTo: 'to-red-600/5',
				borderGlow: 'border-red-400/40',
				icon: Radio,
				label: 'Critical',
				description: 'Immediate intervention required',
				rhythm: 'erratic',
				bpm: '120+',
			}
	}
}

// Organic Heartbeat Orb Component
const OrganicHeartbeatOrb = ({
	status,
	heartRate,
	isActive,
	size = 'large',
}: {
	status: Destination['status']
	heartRate: number
	isActive: boolean
	size?: 'small' | 'medium' | 'large'
}) => {
	const config = getStatusConfig(status)
	const [pulsePhase, setPulsePhase] = useState(0)

	useEffect(() => {
		if (!isActive) return

		const interval = setInterval(
			() => {
				setPulsePhase((prev) => (prev + 1) % 100)
			},
			status === 'danger' ? 50 : status === 'elevated' ? 80 : 120
		)

		return () => clearInterval(interval)
	}, [isActive, status])

	const sizeClasses = {
		small: { orb: 'w-16 h-16', wave: 'w-24 h-24', icon: 'w-6 h-6' },
		medium: { orb: 'w-20 h-20', wave: 'w-32 h-32', icon: 'w-8 h-8' },
		large: { orb: 'w-28 h-28', wave: 'w-40 h-40', icon: 'w-10 h-10' },
	}

	const currentSize = sizeClasses[size]

	return (
		<div className="relative flex items-center justify-center gap-2">
			{/* Neural pathway connections */}

			{/* Outer energy field */}
			<div
				className={cn(
					'absolute rounded-full opacity-10',
					currentSize.wave,
					config.pulseColor,
					isActive && 'animate-ping'
				)}
				style={{
					animationDuration:
						status === 'danger' ? '1s' : status === 'elevated' ? '1.5s' : '2s',
				}}
			/>

			{/* Main organic orb */}
			<div
				className={cn(
					'relative rounded-full backdrop-blur-xl border',
					currentSize.orb,
					config.borderGlow,
					config.glowColor,
					`bg-linear-to-br ${config.gradientFrom} ${config.gradientTo}`,
					isActive && 'shadow-2xl'
				)}
				style={{
					boxShadow: isActive
						? `0 0 ${size === 'large' ? '40px' : '30px'} ${
								status === 'healthy'
									? 'rgba(52, 211, 153, 0.3)'
									: status === 'elevated'
									? 'rgba(251, 191, 36, 0.3)'
									: 'rgba(248, 113, 113, 0.4)'
						  }`
						: 'none',
				}}
			>
				{/* Inner glow */}
				<div
					className={cn(
						'absolute inset-2 rounded-full opacity-40',
						config.pulseColor,
						isActive &&
							(status === 'healthy'
								? 'heartbeat-healthy'
								: status === 'elevated'
								? 'heartbeat-elevated'
								: 'heartbeat-danger')
					)}
				/>

				{/* Core icon */}
				<div className="absolute inset-0 flex items-center justify-center">
					<Heart
						className={cn(
							currentSize.icon,
							config.color,
							'drop-shadow-lg transition-all duration-300',
							isActive && 'animate-pulse'
						)}
						fill="currentColor"
						style={{
							filter: `drop-shadow(0 0 ${
								size === 'large' ? '8px' : '6px'
							} currentColor)`,
						}}
					/>
				</div>

				{/* EKG-style pulse indicator */}
				{isActive && (
					<div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
						<div
							className={cn('w-8 h-px', config.pulseColor, 'animate-pulse')}
						/>
					</div>
				)}
			</div>

			{/* Floating BPM indicator */}
			<div
				className={cn(
					'absolute -bottom-8 left-1/2 transform -translate-x-1/2',
					'px-3 py-1 rounded-full backdrop-blur-xl border',
					'text-xs font-mono font-medium mb-1',
					config.color,
					config.borderGlow,
					'bg-black/20'
				)}
			>
				{heartRate}
				<span className="ml-1 opacity-60">BPM</span>
			</div>
		</div>
	)
}

// Neural Connection Line Component
const NeuralConnection = ({
	fromIndex,
	toIndex,
	status,
	isActive,
}: {
	fromIndex: number
	toIndex: number
	status: Destination['status']
	isActive: boolean
}) => {
	const config = getStatusConfig(status)

	return (
		<div className="absolute inset-0 pointer-events-none">
			<svg className="w-full h-full">
				<defs>
					<linearGradient
						id={`gradient-${fromIndex}-${toIndex}`}
						x1="0%"
						y1="0%"
						x2="100%"
						y2="0%"
					>
						<stop offset="0%" stopColor="transparent" />
						<stop
							offset="50%"
							stopColor={
								status === 'healthy'
									? '#10b981'
									: status === 'elevated'
									? '#f59e0b'
									: '#ef4444'
							}
							stopOpacity="0.3"
						/>
						<stop offset="100%" stopColor="transparent" />
					</linearGradient>
				</defs>
				<path
					d={`M ${fromIndex * 100} 50 Q ${(fromIndex + toIndex) * 50} ${
						Math.sin(fromIndex) * 20 + 50
					} ${toIndex * 100} 50`}
					stroke={`url(#gradient-${fromIndex}-${toIndex})`}
					strokeWidth="1"
					fill="none"
					className={cn(
						'transition-all duration-1000',
						isActive && 'animate-pulse'
					)}
				/>
			</svg>
		</div>
	)
}

// Clean Station Card Component
const FuturisticDestinationCard = ({
	destination,
	isSelected,
	onClick,
}: {
	destination: Destination
	isSelected: boolean
	onClick: () => void
}) => {
	const config = getStatusConfig(destination.status)
	const StatusIcon = config.icon

	return (
		<button
			onClick={onClick}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault()
					onClick()
				}
			}}
			tabIndex={0}
			aria-label={`View ${destination.name} - Status: ${config.label}`}
			className={cn(
				'w-full p-5 rounded-2xl border transition-all duration-300',
				'hover:scale-[1.02] active:scale-[0.98] focus:outline-none',
				'backdrop-blur-xl touch-manipulation text-left',
				'bg-slate-800/30',
				isSelected
					? 'border-emerald-500/50 bg-slate-800/50'
					: 'border-slate-700/30 hover:border-slate-600/50'
			)}
		>
			{/* Header */}
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center space-x-3">
					<div
						className={cn(
							'w-3 h-3 rounded-full',
							destination.status === 'healthy'
								? 'bg-emerald-500'
								: destination.status === 'elevated'
								? 'bg-amber-500'
								: 'bg-red-500'
						)}
					/>
					<div>
						<h3 className="font-semibold text-slate-100 text-sm">
							{destination.name}
						</h3>
						<p className="text-xs text-slate-400">{destination.location}</p>
					</div>
				</div>
				<div className="text-right">
					<div className="text-xs text-slate-400">{destination.lastUpdate}</div>
				</div>
			</div>

			{/* Heartbeat visualization */}
			<div className="flex items-center justify-center py-4 mb-4">
				<OrganicHeartbeatOrb
					status={destination.status}
					heartRate={destination.heartRate}
					isActive={isSelected}
					size="medium"
				/>
			</div>

			{/* Status info */}
			<div className="flex items-center justify-between text-sm">
				<span className="text-slate-400">Status</span>
				<span
					className={cn(
						'font-medium',
						destination.status === 'healthy'
							? 'text-emerald-400'
							: destination.status === 'elevated'
							? 'text-amber-400'
							: 'text-red-400'
					)}
				>
					{config.label}
				</span>
			</div>
		</button>
	)
}

export const HeartbeatInterface = () => {
	const [selectedDestination, setSelectedDestination] = useState<Destination>(
		destinations[0]
	)
	const [soundEnabled, setSoundEnabled] = useState(false)
	const [showDetails, setShowDetails] = useState(false)
	const scrollRef = useRef<HTMLDivElement>(null)

	const handleDestinationSelect = (destination: Destination) => {
		setSelectedDestination(destination)
	}

	const handleToggleSound = () => {
		setSoundEnabled(!soundEnabled)
	}

	const handleToggleDetails = () => {
		setShowDetails(!showDetails)
	}

	const config = getStatusConfig(selectedDestination.status)

	return (
		<div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 overflow-hidden">
			{/* Ambient background effects */}
			<div className="fixed inset-0 pointer-events-none">
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" />
				<div
					className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse"
					style={{ animationDelay: '1s' }}
				/>
				<div
					className="absolute top-1/2 left-1/2 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse"
					style={{ animationDelay: '2s' }}
				/>
			</div>

			{/* Main scrollable container */}
			<div
				ref={scrollRef}
				className="relative z-10 h-screen overflow-y-auto overflow-x-hidden scrollbar-hide"
				style={{
					scrollBehavior: 'smooth',
					WebkitOverflowScrolling: 'touch',
				}}
			>
				{/* Revolutionary Header Experience */}
				<div className="sticky top-0 z-20 overflow-hidden">
					{/* Clean background */}

					{/* Main header content */}
					<div className="relative z-10 px-4 py-6 pt-2">
						{/* Top row - Mission Control */}
						<div className="flex items-center justify-between mb-0">
							<div className="flex items-center space-x-0">
								{/* ESA Logo placeholder with pulse */}
								{/* <div className="relative">
									<div className="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-500/20 to-blue-600/5 border border-blue-400/30 flex items-center justify-center backdrop-blur-sm">
										<Satellite className="w-6 h-6 text-blue-400" />
									</div>
									<div className="absolute -inset-1 rounded-2xl bg-linear-to-br from-blue-400/20 to-transparent animate-pulse" />
								</div> */}

								{/* <div>
									<h1 className="text-xl font-bold gradient-text-animated">
										ESA Neural Heartbeat
									</h1>
									<div className="flex items-center space-x-2 text-sm">
										<div className="flex items-center space-x-1 text-slate-400 font-mono">
											<div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
											<span>LIVE</span>
										</div>
										<div className="text-slate-500">•</div>
										<span className="text-slate-400 font-mono">
											Copernicus • Galileo • EGNOS
										</span>
									</div>
								</div> */}
							</div>

							{/* Control buttons with enhanced design */}
							{/* <div className="flex items-center space-x-3">
								<button
									onClick={handleToggleDetails}
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.preventDefault()
											handleToggleDetails()
										}
									}}
									tabIndex={0}
									aria-label={showDetails ? 'Hide telemetry' : 'Show telemetry'}
									className={cn(
										'relative p-3 rounded-2xl border transition-all duration-500',
										'hover:scale-110 active:scale-95 focus:outline-none',
										'backdrop-blur-xl touch-manipulation group button-hover-glow',
										showDetails
											? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-400 shadow-lg shadow-emerald-400/25 glow-pulse'
											: 'bg-slate-800/30 border-slate-600/30 text-slate-400 hover:text-emerald-400 hover:border-emerald-400/30'
									)}
								>
									<Info className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
									{showDetails && (
										<div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-emerald-400/20 to-transparent animate-pulse" />
									)}
								</button>

								<button
									onClick={handleToggleSound}
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.preventDefault()
											handleToggleSound()
										}
									}}
									tabIndex={0}
									aria-label={soundEnabled ? 'Mute audio' : 'Enable audio'}
									className={cn(
										'relative p-3 rounded-2xl border transition-all duration-500',
										'hover:scale-110 active:scale-95 focus:outline-none',
										'backdrop-blur-xl touch-manipulation group button-hover-glow',
										soundEnabled
											? 'bg-amber-500/20 border-amber-400/50 text-amber-400 shadow-lg shadow-amber-400/25 glow-pulse'
											: 'bg-slate-800/30 border-slate-600/30 text-slate-400 hover:text-amber-400 hover:border-amber-400/30'
									)}
								>
									{soundEnabled ? (
										<Volume2 className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
									) : (
										<VolumeX className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
									)}
									{soundEnabled && (
										<div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-amber-400/20 to-transparent animate-pulse" />
									)}
								</button>
							</div> */}
						</div>

						{/* Clean personal greeting */}
						<div className="relative">
							<div className="absolute inset-0 rounded-2xl bg-slate-800/20 backdrop-blur-xl border border-slate-700/30" />

							<div className="relative p-4">
								<div className="flex items-center justify-between">
									{/* Left side - Clean personal info */}
									<div className="flex items-center space-x-3">
										<div>
											<h2 className="text-lg font-semibold text-slate-100">
												Hello Aldi
											</h2>
											<div className="flex items-center space-x-3 text-sm text-slate-400">
												<span>30°C</span>
												<span>•</span>
												<span>Safe conditions</span>
											</div>
										</div>
									</div>

									{/* Right side - Clean mission info */}
									<div className="text-right space-y-1">
										<div className="text-sm font-mono text-slate-100">
											{new Date().toLocaleTimeString('en-US', {
												hour12: false,
												hour: '2-digit',
												minute: '2-digit',
											})}
										</div>
										<div className="text-xs text-slate-400">
											ESA Mission Control
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Main content */}
				<div className="px-4 pb-24">
					{/* Hero section with main heartbeat */}
					<div className="py-8">
						<div className="text-center mb-8">
							<div className="mb-6">
								<OrganicHeartbeatOrb
									status={selectedDestination.status}
									heartRate={selectedDestination.heartRate}
									isActive={true}
									size="large"
								/>
							</div>
							<h2 className="text-xl font-semibold text-slate-100 mb-2">
								{selectedDestination.name}
							</h2>
							<p className="text-slate-400 font-mono text-sm mb-1">
								{selectedDestination.location}
							</p>
							<div className={cn('text-sm font-medium', config.color)}>
								{config.description}
							</div>
						</div>

						{/* Mission telemetry details */}
						{showDetails && (
							<div className="backdrop-blur-xl bg-slate-900/30 rounded-3xl border border-slate-700/30 p-6 mb-8">
								<h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
									<Satellite className="w-5 h-5 mr-2 text-slate-400" />
									Mission Telemetry
								</h3>
								<div className="grid grid-cols-2 gap-4">
									<div className="text-center">
										<div className="text-2xl font-mono font-bold text-slate-100">
											{selectedDestination.details.temperature}°C
										</div>
										<div className="text-xs text-slate-400">Thermal Status</div>
									</div>
									<div className="text-center">
										<div className="text-2xl font-mono font-bold text-slate-100">
											{selectedDestination.details.radiation}
										</div>
										<div className="text-xs text-slate-400">
											mSv/h Radiation
										</div>
									</div>
									<div className="text-center">
										<div
											className={cn(
												'text-lg font-semibold',
												selectedDestination.details.atmosphere === 'Optimal' ||
													selectedDestination.details.atmosphere === 'Stable'
													? 'text-emerald-400'
													: selectedDestination.details.atmosphere ===
															'Monitored' ||
													  selectedDestination.details.atmosphere ===
															'Unstable'
													? 'text-amber-400'
													: 'text-red-400'
											)}
										>
											{selectedDestination.details.atmosphere}
										</div>
										<div className="text-xs text-slate-400">System Status</div>
									</div>
									<div className="text-center">
										<div className="text-lg font-mono font-bold text-slate-100">
											{selectedDestination.details.population === 0
												? 'Autonomous'
												: selectedDestination.details.population.toLocaleString()}
										</div>
										<div className="text-xs text-slate-400">
											{selectedDestination.details.population === 0
												? 'Operation Mode'
												: 'Crew Size'}
										</div>
									</div>
								</div>

								{/* Additional mission-specific data */}
								<div className="mt-6 pt-4 border-t border-slate-700/30">
									<div className="grid grid-cols-3 gap-4 text-center">
										<div>
											<div className="text-sm font-mono font-bold text-emerald-400">
												{selectedDestination.name.includes('Sentinel')
													? '98.6%'
													: selectedDestination.name.includes('Galileo')
													? '99.2%'
													: '97.8%'}
											</div>
											<div className="text-xs text-slate-400">
												Signal Quality
											</div>
										</div>
										<div>
											<div className="text-sm font-mono font-bold text-amber-400">
												{selectedDestination.name.includes('GEO')
													? '24h'
													: selectedDestination.name.includes('LEO')
													? '90min'
													: '12h'}
											</div>
											<div className="text-xs text-slate-400">Orbit Period</div>
										</div>
										<div>
											<div className="text-sm font-mono font-bold text-slate-100">
												{selectedDestination.name.includes('EGNOS')
													? 'SBAS'
													: selectedDestination.name.includes('Galileo')
													? 'GNSS'
													: 'EO'}
											</div>
											<div className="text-xs text-slate-400">Mission Type</div>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>

					{/* Swipable station cards */}
					<div className="space-y-6">
						<h3 className="text-lg font-semibold text-slate-100 flex items-center">
							<Radio className="w-5 h-5 mr-2 text-slate-400" />
							Mission Status
						</h3>

						{/* Horizontal scrolling container */}
						<div className="relative">
							<div
								className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
								style={{
									scrollBehavior: 'smooth',
									WebkitOverflowScrolling: 'touch',
								}}
							>
								{destinations.map((destination) => (
									<div key={destination.id} className="shrink-0 w-80">
										<FuturisticDestinationCard
											destination={destination}
											isSelected={selectedDestination.id === destination.id}
											onClick={() => handleDestinationSelect(destination)}
										/>
									</div>
								))}
							</div>

							{/* Scroll indicators */}
							<div className="flex justify-center mt-4 space-x-2">
								{destinations.map((destination, index) => (
									<button
										key={destination.id}
										onClick={() => handleDestinationSelect(destination)}
										className={cn(
											'w-2 h-2 rounded-full transition-all duration-300',
											selectedDestination.id === destination.id
												? 'bg-emerald-400 w-6'
												: 'bg-slate-600 hover:bg-slate-500'
										)}
										aria-label={`Select ${destination.name}`}
									/>
								))}
							</div>
						</div>
					</div>

					{/* Mission Control - Emergency Safing Only */}
					<div className="mt-8 space-y-6 ">
						<h3 className="text-2xl font-semibold text-slate-100 px-1">
							Mission Control
						</h3>

						{/* Emergency Safing Card */}
						<div className="bg-slate-800/40 backdrop-blur-sm rounded-3xl border border-slate-700/50 overflow-hidden mb-4">
							<div className="p-6">
								{/* Header */}
								<div className="flex items-center space-x-3 mb-6">
									<div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
										<Shield className="w-5 h-5 text-red-400" />
									</div>
									<div>
										<h4 className="text-lg font-semibold text-slate-100">
											Emergency Safing
										</h4>
										<p className="text-sm text-slate-400">
											Critical procedures & contacts
										</p>
									</div>
								</div>

								{/* Status Info */}
								<div className="bg-slate-900/50 rounded-2xl p-4 mb-4">
									<div className="flex items-start justify-between mb-3">
										<div className="flex items-center space-x-2">
											<div className="w-2 h-2 rounded-full bg-emerald-400"></div>
											<span className="text-sm text-slate-300">
												System Status
											</span>
										</div>
										<span className="text-sm font-medium text-emerald-400">
											NOMINAL
										</span>
									</div>
									<div className="text-xs text-slate-400 leading-relaxed">
										All systems operational. Monitor status and follow
										procedures if anomalies are detected.
									</div>
								</div>

								{/* Emergency Procedures Tips */}
								<div className="space-y-3 mb-4">
									<h5 className="text-sm font-medium text-slate-300 flex items-center">
										<Info className="w-4 h-4 mr-2 text-slate-400" />
										Emergency Procedures
									</h5>
									<div className="space-y-2">
										{[
											{
												step: '1',
												text: 'Verify system anomaly through multiple telemetry sources',
											},
											{
												step: '2',
												text: 'Contact mission control immediately via secure channels',
											},
											{
												step: '3',
												text: 'Document all system parameters and timestamps',
											},
											{
												step: '4',
												text: 'Follow flight director authorization for safing mode',
											},
										].map((tip) => (
											<div
												key={tip.step}
												className="flex items-start space-x-3 text-xs"
											>
												<div className="w-5 h-5 rounded-full bg-slate-700/50 flex items-center justify-center shrink-0 mt-0.5">
													<span className="text-slate-400 font-medium text-[10px]">
														{tip.step}
													</span>
												</div>
												<span className="text-slate-400 leading-relaxed">
													{tip.text}
												</span>
											</div>
										))}
									</div>
								</div>

								{/* Emergency Contacts */}
								<div className="space-y-3">
									<h5 className="text-sm font-medium text-slate-300">
										Emergency Contacts
									</h5>
									<div className="space-y-2">
										{[
											{
												title: 'ESA Main Control Room',
												contact: '+49 6151 90 0',
												availability: '24/7',
											},
											{
												title: 'Flight Director',
												contact: 'fd.emergency@esa.int',
												availability: 'Priority channel',
											},
											{
												title: 'Ground Network',
												contact: '+31 71 565 6565',
												availability: 'Real-time support',
											},
										].map((contact, index) => (
											<button
												key={index}
												className="w-full bg-slate-900/50 hover:bg-slate-900/70 rounded-xl p-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500/50 active:scale-[0.98] touch-manipulation text-left group"
												tabIndex={0}
												aria-label={`Contact ${contact.title}: ${contact.contact}`}
											>
												<div className="flex items-center justify-between">
													<div className="flex-1">
														<div className="text-sm font-medium text-slate-200 mb-0.5">
															{contact.title}
														</div>
														<div className="text-xs text-slate-400 font-mono">
															{contact.contact}
														</div>
													</div>
													<div className="flex items-center space-x-2">
														<span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
															{contact.availability}
														</span>
														<svg
															className="w-4 h-4 text-slate-500 group-hover:text-slate-400 transition-colors"
															fill="none"
															strokeWidth="2"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																d="M9 5l7 7-7 7"
															/>
														</svg>
													</div>
												</div>
											</button>
										))}
									</div>
								</div>
							</div>

							{/* Additional Info Footer */}
							<div className="px-6 py-4 bg-slate-900/30 border-t border-slate-700/30">
								<div className="flex items-center justify-between text-xs">
									<span className="text-slate-400">Last status check</span>
									<span className="text-slate-300 font-medium">
										{new Date().toLocaleTimeString('en-US', {
											hour: '2-digit',
											minute: '2-digit',
											hour12: false,
										})}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
