'use client'

import { Suspense, useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import {
	WeatherClouds,
	AtmosphericGlow,
	HeatmapPulse,
	EnergyStreams,
	HolographicGrid,
	RiskZoneIndicator,
	AmbientParticles,
	ScanLine,
} from './HealthScoreEffects'
import { HealthScoreLoader } from './HealthScoreLoader'
import { HealthScoreDataPanel } from './HealthScoreDataPanel'
import { HealthScoreTooltip, useHealthScoreTooltip } from './HealthScoreTooltip'

// Types
type DataLayer = 'weather' | 'crowd' | 'safety'
type HealthStatus = 'healthy' | 'moderate' | 'risky'

interface LayerData {
	weather: number
	crowd: number
	safety: number
}

// Color palette
const COLORS = {
	deepBlue: '#00597C',
	aquaGlow: '#55DDCA',
	safeGreen: '#34D399',
	cautionYellow: '#FBBF24',
	dangerRed: '#F87171',
	spaceBlack: '#000000',
	spaceNavy: '#0A1929',
}

// Globe with layered data visualization
const Globe3D = ({
	layerData,
	activeLayer,
	isOffline,
}: {
	layerData: LayerData
	activeLayer: DataLayer | null
	isOffline: boolean
}) => {
	const meshRef = useRef<THREE.Mesh>(null)
	const weatherLayerRef = useRef<THREE.Mesh>(null)
	const crowdLayerRef = useRef<THREE.Mesh>(null)
	const safetyLayerRef = useRef<THREE.Mesh>(null)

	// Smooth rotation animation
	useFrame((state) => {
		const time = state.clock.getElapsedTime()

		if (meshRef.current) {
			meshRef.current.rotation.y = time * 0.1
		}

		// Animate layers with independent rotations
		if (weatherLayerRef.current) {
			weatherLayerRef.current.rotation.y = time * 0.15
			weatherLayerRef.current.rotation.z = Math.sin(time * 0.5) * 0.05
		}

		if (crowdLayerRef.current) {
			crowdLayerRef.current.rotation.y = -time * 0.12
			const pulseSpeed = isOffline ? 0.3 : 0.5
			crowdLayerRef.current.scale.setScalar(
				1 + Math.sin(time * pulseSpeed) * 0.02
			)
		}

		if (safetyLayerRef.current) {
			safetyLayerRef.current.rotation.y = time * 0.08
			safetyLayerRef.current.rotation.x = Math.sin(time * 0.3) * 0.1
		}
	})

	const globeOpacity = isOffline ? 0.6 : 0.9

	return (
		<group>
			{/* Ambient atmosphere */}
			<AtmosphericGlow color={COLORS.aquaGlow} />

			{/* Weather clouds */}
			{(activeLayer === null || activeLayer === 'weather') && (
				<WeatherClouds intensity={layerData.weather / 100} />
			)}

			{/* Holographic grid */}
			<HolographicGrid visible={activeLayer === null} />

			{/* Energy streams */}
			<EnergyStreams active={!isOffline} />

			{/* Scan line effect */}
			<ScanLine active={!isOffline} />

			{/* Core Globe */}
			<Sphere ref={meshRef} args={[2, 64, 64]}>
				<meshPhongMaterial
					color={COLORS.deepBlue}
					transparent
					opacity={globeOpacity}
					emissive={COLORS.deepBlue}
					emissiveIntensity={0.2}
					shininess={100}
				/>
			</Sphere>

			{/* Weather Layer - Outer most */}
			<Sphere
				ref={weatherLayerRef}
				args={[2.4, 32, 32]}
				visible={activeLayer === null || activeLayer === 'weather'}
			>
				<meshPhongMaterial
					color={COLORS.aquaGlow}
					transparent
					opacity={0.15 * (layerData.weather / 100)}
					wireframe
					emissive={COLORS.aquaGlow}
					emissiveIntensity={0.4}
				/>
			</Sphere>

			{/* Crowd Density Layer - Middle */}
			<Sphere
				ref={crowdLayerRef}
				args={[2.25, 32, 32]}
				visible={activeLayer === null || activeLayer === 'crowd'}
			>
				<meshStandardMaterial
					color={
						layerData.crowd > 70
							? COLORS.dangerRed
							: layerData.crowd > 40
							? COLORS.cautionYellow
							: COLORS.safeGreen
					}
					transparent
					opacity={0.25 * (layerData.crowd / 100)}
					emissive={
						layerData.crowd > 70
							? COLORS.dangerRed
							: layerData.crowd > 40
							? COLORS.cautionYellow
							: COLORS.safeGreen
					}
					emissiveIntensity={0.5}
				/>
			</Sphere>

			{/* Safety Layer - Inner most */}
			<Sphere
				ref={safetyLayerRef}
				args={[2.1, 32, 32]}
				visible={activeLayer === null || activeLayer === 'safety'}
			>
				<meshStandardMaterial
					color={
						layerData.safety > 75
							? COLORS.safeGreen
							: layerData.safety > 45
							? COLORS.cautionYellow
							: COLORS.dangerRed
					}
					transparent
					opacity={0.2}
					emissive={
						layerData.safety > 75
							? COLORS.safeGreen
							: layerData.safety > 45
							? COLORS.cautionYellow
							: COLORS.dangerRed
					}
					emissiveIntensity={0.6}
				/>
			</Sphere>

			{/* Risk zone indicators on globe surface */}
			{(activeLayer === null || activeLayer === 'safety') &&
				layerData.safety < 75 && (
					<>
						<RiskZoneIndicator
							position={[1.5, 0.5, 1]}
							riskLevel={layerData.safety < 45 ? 'high' : 'medium'}
						/>
						<RiskZoneIndicator
							position={[-1.2, -0.8, 1.5]}
							riskLevel={layerData.safety < 45 ? 'high' : 'medium'}
						/>
					</>
				)}

			{/* Crowd density hotspots */}
			{(activeLayer === null || activeLayer === 'crowd') && (
				<>
					<HeatmapPulse intensity={layerData.crowd} position={[1.8, 0, 0.5]} />
					<HeatmapPulse
						intensity={layerData.crowd * 0.8}
						position={[-1.5, 0.7, 0.8]}
					/>
					<HeatmapPulse
						intensity={layerData.crowd * 0.6}
						position={[0.5, -1.6, 0.9]}
					/>
				</>
			)}

			{/* Atmospheric glow effect */}
			<Sphere args={[2.6, 32, 32]}>
				<meshBasicMaterial
					color={COLORS.aquaGlow}
					transparent
					opacity={0.05}
					side={THREE.BackSide}
				/>
			</Sphere>
		</group>
	)
}

// Particle system for score convergence
const ScoreParticles = ({
	healthScore,
	status,
}: {
	healthScore: number
	status: HealthStatus
}) => {
	const particlesRef = useRef<THREE.Points>(null)
	const particleCount = 500

	const particlePositions = new Float32Array(particleCount * 3)
	for (let i = 0; i < particleCount * 3; i++) {
		particlePositions[i] = (Math.random() - 0.5) * 10
	}

	useFrame((state) => {
		if (particlesRef.current) {
			const time = state.clock.getElapsedTime()
			const positions = particlesRef.current.geometry.attributes.position
				.array as Float32Array

			for (let i = 0; i < particleCount; i++) {
				const i3 = i * 3
				const x = positions[i3]
				const y = positions[i3 + 1]
				const z = positions[i3 + 2]

				// Particles converge toward center
				const convergeFactor = 0.98
				positions[i3] = x * convergeFactor
				positions[i3 + 1] = y * convergeFactor + Math.sin(time + i) * 0.01
				positions[i3 + 2] = z * convergeFactor

				// Reset particles that get too close to center
				const dist = Math.sqrt(x * x + y * y + z * z)
				if (dist < 0.5) {
					positions[i3] = (Math.random() - 0.5) * 10
					positions[i3 + 1] = (Math.random() - 0.5) * 10
					positions[i3 + 2] = (Math.random() - 0.5) * 10
				}
			}

			particlesRef.current.geometry.attributes.position.needsUpdate = true
		}
	})

	const particleColor =
		status === 'healthy'
			? COLORS.safeGreen
			: status === 'moderate'
			? COLORS.cautionYellow
			: COLORS.dangerRed

	return (
		<points ref={particlesRef}>
			<bufferGeometry>
				<bufferAttribute
					attach="attributes-position"
					count={particleCount}
					array={particlePositions}
					itemSize={3}
					args={[particlePositions, 3]}
				/>
			</bufferGeometry>
			<pointsMaterial
				size={0.05}
				color={particleColor}
				transparent
				opacity={0.6}
				sizeAttenuation
			/>
		</points>
	)
}

// Scene lighting setup
const SceneLighting = () => {
	return (
		<>
			<ambientLight intensity={0.3} />
			<pointLight
				position={[10, 10, 10]}
				intensity={1}
				color={COLORS.aquaGlow}
			/>
			<pointLight
				position={[-10, -10, -10]}
				intensity={0.5}
				color={COLORS.deepBlue}
			/>
			<spotLight
				position={[0, 5, 5]}
				intensity={0.8}
				angle={0.6}
				penumbra={0.5}
				color={COLORS.aquaGlow}
			/>
		</>
	)
}

// Main Health Score Interface Component
export const HealthScoreInterface = () => {
	const [layerData, setLayerData] = useState<LayerData>({
		weather: 75,
		crowd: 55,
		safety: 82,
	})
	const [activeLayer, setActiveLayer] = useState<DataLayer | null>(null)
	const [healthScore, setHealthScore] = useState(0)
	const [isOffline, setIsOffline] = useState(false)
	const [showScore, setShowScore] = useState(false)
	const [isLoading, setIsLoading] = useState(true)

	// Tooltip for first-time visitors
	const { showTooltip, handleCloseTooltip } = useHealthScoreTooltip()

	// Check online status
	useEffect(() => {
		const handleOnline = () => setIsOffline(false)
		const handleOffline = () => setIsOffline(true)

		setIsOffline(!navigator.onLine)

		window.addEventListener('online', handleOnline)
		window.addEventListener('offline', handleOffline)

		// Simulate initial loading
		const loadTimer = setTimeout(() => setIsLoading(false), 2000)

		return () => {
			window.removeEventListener('online', handleOnline)
			window.removeEventListener('offline', handleOffline)
			clearTimeout(loadTimer)
		}
	}, [])

	// Simulate real-time data updates
	useEffect(() => {
		const interval = setInterval(
			() => {
				if (!isOffline) {
					setLayerData({
						weather: Math.max(
							0,
							Math.min(100, layerData.weather + (Math.random() - 0.5) * 10)
						),
						crowd: Math.max(
							0,
							Math.min(100, layerData.crowd + (Math.random() - 0.5) * 15)
						),
						safety: Math.max(
							0,
							Math.min(100, layerData.safety + (Math.random() - 0.5) * 8)
						),
					})
				}
			},
			isOffline ? 8000 : 3000
		)

		return () => clearInterval(interval)
	}, [layerData, isOffline])

	// Calculate composite health score
	useEffect(() => {
		const weights = { weather: 0.3, crowd: 0.3, safety: 0.4 }
		const calculated =
			layerData.weather * weights.weather +
			layerData.crowd * weights.crowd +
			layerData.safety * weights.safety

		setHealthScore(Math.round(calculated))

		// Show score after layers are revealed
		const timer = setTimeout(() => setShowScore(true), 2000)
		return () => clearTimeout(timer)
	}, [layerData])

	const getHealthStatus = (): HealthStatus => {
		if (healthScore >= 75) return 'healthy'
		if (healthScore >= 50) return 'moderate'
		return 'risky'
	}

	const status = getHealthStatus()

	const getStatusColor = () => {
		switch (status) {
			case 'healthy':
				return COLORS.safeGreen
			case 'moderate':
				return COLORS.cautionYellow
			case 'risky':
				return COLORS.dangerRed
		}
	}

	const getStatusMessage = () => {
		if (isOffline) {
			return 'Operating on cached data — limited real-time accuracy'
		}

		switch (status) {
			case 'healthy':
				return `Environmental stability: ${layerData.safety}% — optimal conditions detected`
			case 'moderate':
				return `Environmental stability: ${layerData.safety}% — moderate crowd levels detected`
			case 'risky':
				return `Environmental stability: ${layerData.safety}% — elevated risk zones identified`
		}
	}

	const handleLayerToggle = (layer: DataLayer) => {
		setActiveLayer(activeLayer === layer ? null : layer)
	}

	// Show loader during initial load
	if (isLoading) {
		return <HealthScoreLoader />
	}

	return (
		<>
			{/* First-time visitor tooltip */}
			<HealthScoreTooltip show={showTooltip} onClose={handleCloseTooltip} />

			<div className="relative w-full h-screen overflow-hidden bg-linear-to-b from-[#0A1929] via-[#001520] to-black">
				{/* Background atmospheric effects */}
				<div className="absolute inset-0 opacity-30">
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(85,221,202,0.1),transparent_50%)]" />
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,89,124,0.15),transparent_40%)]" />
				</div>

				{/* Offline indicator */}
				<AnimatePresence>
					{isOffline && (
						<motion.div
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg backdrop-blur-md"
						>
							<p className="text-yellow-400 text-sm font-medium">
								⚠ Offline Mode
							</p>
						</motion.div>
					)}
				</AnimatePresence>

				{/* 3D Canvas */}
				<div className="absolute inset-0">
					<Canvas
						camera={{ position: [0, 0, 8], fov: 45 }}
						gl={{ alpha: true, antialias: true }}
						style={{ background: 'transparent' }}
					>
						<Suspense fallback={null}>
							<SceneLighting />
							<AmbientParticles count={200} />
							<Globe3D
								layerData={layerData}
								activeLayer={activeLayer}
								isOffline={isOffline}
							/>
							<ScoreParticles healthScore={healthScore} status={status} />
							<OrbitControls
								enableZoom={true}
								enablePan={false}
								minDistance={5}
								maxDistance={15}
								enableDamping
								dampingFactor={0.05}
								rotateSpeed={0.5}
							/>
						</Suspense>
					</Canvas>
				</div>

				{/* Data Panel */}
				<HealthScoreDataPanel
					layerData={layerData}
					healthScore={healthScore}
					isOffline={isOffline}
				/>

				{/* UI Overlay */}
				<div className="absolute inset-0 pointer-events-none flex flex-col">
					{/* Header */}
					<motion.div
						initial={{ opacity: 0, y: -30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1, delay: 0.3 }}
						className="pt-8 px-8 pointer-events-auto"
					>
						<h1
							className="text-4xl md:text-5xl font-bold tracking-tight"
							style={{
								background: `linear-gradient(135deg, ${COLORS.aquaGlow}, ${COLORS.deepBlue})`,
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
							}}
						>
							Destination Health Score™
						</h1>
						<p className="text-gray-400 text-sm mt-2 font-light tracking-wide">
							Live environmental analysis
						</p>
					</motion.div>

					{/* Central Health Score Display */}
					<div className="flex-1 flex items-center justify-center">
						<AnimatePresence>
							{showScore && (
								<motion.div
									initial={{ scale: 0, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{ type: 'spring', duration: 1.2, bounce: 0.4 }}
									className="text-center pointer-events-auto"
								>
									<motion.div
										animate={{
											boxShadow: [
												`0 0 20px ${getStatusColor()}40`,
												`0 0 60px ${getStatusColor()}60`,
												`0 0 20px ${getStatusColor()}40`,
											],
										}}
										transition={{
											duration: 2,
											repeat: Infinity,
											ease: 'easeInOut',
										}}
										className="relative inline-block p-8 rounded-full border-2"
										style={{ borderColor: getStatusColor() }}
									>
										<motion.div
											animate={{ rotate: 360 }}
											transition={{
												duration: 20,
												repeat: Infinity,
												ease: 'linear',
											}}
											className="absolute inset-0 rounded-full border-t-2 border-r-2 opacity-30"
											style={{ borderColor: getStatusColor() }}
										/>
										<div className="relative z-10">
											<motion.div
												key={healthScore}
												initial={{ scale: 0.8, opacity: 0 }}
												animate={{ scale: 1, opacity: 1 }}
												className="text-8xl font-bold tabular-nums"
												style={{ color: getStatusColor() }}
											>
												{healthScore}
											</motion.div>
											<div className="text-gray-400 text-sm uppercase tracking-widest mt-2">
												Composite Score
											</div>
										</div>
									</motion.div>

									<motion.p
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.5 }}
										className="mt-6 text-gray-300 text-sm max-w-md mx-auto leading-relaxed"
										style={{ opacity: isOffline ? 0.7 : 1 }}
									>
										{getStatusMessage()}
									</motion.p>
								</motion.div>
							)}
						</AnimatePresence>
					</div>

					{/* Layer Controls */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1, delay: 0.6 }}
						className="pb-8 px-8 pointer-events-auto mb-12"
					>
						<div className="flex flex-col md:flex-row gap-4 justify-center items-center">
							{/* Weather Layer */}
							<button
								onClick={() => handleLayerToggle('weather')}
								className={`group relative px-6 py-3 rounded-lg border transition-all duration-300 ${
									activeLayer === 'weather'
										? 'bg-[#55DDCA]/20 border-[#55DDCA]'
										: 'bg-white/5 border-white/10 hover:border-[#55DDCA]/50'
								}`}
							>
								<div className="flex items-center gap-3">
									<div
										className={`w-3 h-3 rounded-full ${
											activeLayer === 'weather' ? 'bg-[#55DDCA]' : 'bg-white/30'
										}`}
										style={{
											boxShadow:
												activeLayer === 'weather'
													? `0 0 10px ${COLORS.aquaGlow}`
													: 'none',
										}}
									/>
									<div className="text-left">
										<div className="text-white text-sm font-medium">
											Weather Layer
										</div>
										<div className="text-gray-400 text-xs">
											{layerData.weather}% clarity
										</div>
									</div>
								</div>
							</button>

							{/* Crowd Layer */}
							<button
								onClick={() => handleLayerToggle('crowd')}
								className={`group relative px-6 py-3 rounded-lg border transition-all duration-300 ${
									activeLayer === 'crowd'
										? `bg-${
												layerData.crowd > 70
													? 'red'
													: layerData.crowd > 40
													? 'yellow'
													: 'green'
										  }-500/20 border-${
												layerData.crowd > 70
													? 'red'
													: layerData.crowd > 40
													? 'yellow'
													: 'green'
										  }-500`
										: 'bg-white/5 border-white/10 hover:border-yellow-500/50'
								}`}
							>
								<div className="flex items-center gap-3">
									<div
										className={`w-3 h-3 rounded-full`}
										style={{
											backgroundColor:
												activeLayer === 'crowd'
													? layerData.crowd > 70
														? COLORS.dangerRed
														: layerData.crowd > 40
														? COLORS.cautionYellow
														: COLORS.safeGreen
													: 'rgba(255,255,255,0.3)',
											boxShadow:
												activeLayer === 'crowd'
													? `0 0 10px ${
															layerData.crowd > 70
																? COLORS.dangerRed
																: layerData.crowd > 40
																? COLORS.cautionYellow
																: COLORS.safeGreen
													  }`
													: 'none',
										}}
									/>
									<div className="text-left">
										<div className="text-white text-sm font-medium">
											Crowd Density
										</div>
										<div className="text-gray-400 text-xs">
											{layerData.crowd}% capacity
										</div>
									</div>
								</div>
							</button>

							{/* Safety Layer */}
							<button
								onClick={() => handleLayerToggle('safety')}
								className={`group relative px-6 py-3 rounded-lg border transition-all duration-300 ${
									activeLayer === 'safety'
										? `bg-${
												layerData.safety > 75
													? 'green'
													: layerData.safety > 45
													? 'yellow'
													: 'red'
										  }-500/20 border-${
												layerData.safety > 75
													? 'green'
													: layerData.safety > 45
													? 'yellow'
													: 'red'
										  }-500`
										: 'bg-white/5 border-white/10 hover:border-green-500/50'
								}`}
							>
								<div className="flex items-center gap-3">
									<div
										className={`w-3 h-3 rounded-full`}
										style={{
											backgroundColor:
												activeLayer === 'safety'
													? layerData.safety > 75
														? COLORS.safeGreen
														: layerData.safety > 45
														? COLORS.cautionYellow
														: COLORS.dangerRed
													: 'rgba(255,255,255,0.3)',
											boxShadow:
												activeLayer === 'safety'
													? `0 0 10px ${
															layerData.safety > 75
																? COLORS.safeGreen
																: layerData.safety > 45
																? COLORS.cautionYellow
																: COLORS.dangerRed
													  }`
													: 'none',
										}}
									/>
									<div className="text-left">
										<div className="text-white text-sm font-medium">
											Safety Index
										</div>
										<div className="text-gray-400 text-xs">
											{layerData.safety}% secure
										</div>
									</div>
								</div>
							</button>
						</div>

						{/* Legend */}
						<div className="mt-6 text-center text-xs text-gray-500">
							<p>Click layers to isolate • Drag to rotate • Scroll to zoom</p>
						</div>
					</motion.div>
				</div>
			</div>
		</>
	)
}
