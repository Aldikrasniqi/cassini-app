'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import {
	WifiOff,
	Navigation,
	Cloud,
	Wind,
	Droplets,
	Info,
	Clock,
	TrendingUp,
	X,
	MapPin,
	Waves,
	Activity,
	Timer,
	Route,
	Zap,
} from 'lucide-react'

// Mapbox access token - Per API docs: https://docs.mapbox.com/api/guides/#access-tokens-and-token-scopes
// MUST use NEXT_PUBLIC_ prefix for client-side access
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''

// Log token status for debugging (only first 20 chars for security)
if (typeof window !== 'undefined') {
	console.log('🔑 Mapbox Token Status:', {
		fromEnv: !!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
		tokenPrefix: MAPBOX_TOKEN
			? MAPBOX_TOKEN.substring(0, 20) + '...'
			: 'MISSING',
		tokenLength: MAPBOX_TOKEN.length,
		isValid: MAPBOX_TOKEN.startsWith('pk.'),
		envVarName: 'NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN',
	})

	// Set token globally ONLY if valid
	if (MAPBOX_TOKEN && MAPBOX_TOKEN.startsWith('pk.')) {
		mapboxgl.accessToken = MAPBOX_TOKEN
		console.log('✅ Mapbox token set successfully')
	} else {
		console.error(
			'❌ Invalid or missing Mapbox token. Please check your .env.local file.'
		)
		console.error('Expected format: NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.ey...')
	}
}

interface Waypoint {
	id: string
	coordinates: [number, number] // [lng, lat]
	label: string
	eta?: string
}

interface GhostPath {
	id: string
	coordinates: [number, number][]
	reason: string
	confidence: number
	riskLevel: 'low' | 'medium' | 'high'
	description: string
	weatherCondition?: string
	estimatedDelay?: string
}

interface CachedData {
	timestamp: string
	weatherConditions: string
	terrainStatus: string
	lastSync: string
}

interface TripStats {
	speed: number
	distance: number
	eta: string
	distanceRemaining: string
}

export const GhostRouteInterface = () => {
	const mapContainer = useRef<HTMLDivElement>(null)
	const map = useRef<mapboxgl.Map | null>(null)
	const [isOffline, setIsOffline] = useState(false)
	const [selectedGhostPath, setSelectedGhostPath] = useState<GhostPath | null>(
		null
	)
	const [hoveredWaypoint, setHoveredWaypoint] = useState<string | null>(null)
	const [currentPosition, setCurrentPosition] = useState<[number, number]>([
		-122.4194, 37.7749,
	]) // San Francisco
	const [mapLoaded, setMapLoaded] = useState(false)
	const [mapError, setMapError] = useState<string | null>(null)
	const animationFrame = useRef<number | undefined>(undefined)
	const routeProgress = useRef(0)
	const longPressTimer = useRef<NodeJS.Timeout | null>(null)
	const initAttempted = useRef(false)

	// Trip statistics
	const [tripStats] = useState<TripStats>({
		speed: 65,
		distance: 24.8,
		eta: '18:45',
		distanceRemaining: '24.8 km',
	})

	// Planned route waypoints (San Francisco area example)
	const plannedRoute: Waypoint[] = [
		{
			id: 'start',
			coordinates: [-122.4194, 37.7749],
			label: 'Current Location',
			eta: 'Now',
		},
		{
			id: 'wp1',
			coordinates: [-122.4084, 37.7849],
			label: 'Checkpoint Alpha',
			eta: '15 min',
		},
		{
			id: 'wp2',
			coordinates: [-122.3974, 37.7949],
			label: 'Checkpoint Beta',
			eta: '32 min',
		},
		{
			id: 'wp3',
			coordinates: [-122.3764, 37.8049],
			label: 'Checkpoint Gamma',
			eta: '48 min',
		},
		{
			id: 'wp4',
			coordinates: [-122.3554, 37.8149],
			label: 'Checkpoint Delta',
			eta: '61 min',
		},
		{
			id: 'destination',
			coordinates: [-122.3344, 37.8249],
			label: 'Destination',
			eta: '75 min',
		},
	]

	// Ghost alternative paths (predictive)
	const ghostPaths: GhostPath[] = [
		{
			id: 'ghost1',
			coordinates: [
				[-122.3974, 37.7949],
				[-122.3874, 37.8],
				[-122.3674, 37.8089],
				[-122.3554, 37.8149],
			],
			reason: 'High Wind Risk Ahead',
			confidence: 0.78,
			riskLevel: 'medium',
			description:
				'Predictive model suggests northern route deviation due to sustained wind speeds exceeding 45 km/h in 2 hours.',
			weatherCondition: 'Strong Crosswinds',
			estimatedDelay: '+12 min',
		},
		{
			id: 'ghost2',
			coordinates: [
				[-122.4084, 37.7849],
				[-122.4, 37.79],
				[-122.39, 37.793],
				[-122.3974, 37.7949],
			],
			reason: 'Flooding Expected',
			confidence: 0.92,
			riskLevel: 'high',
			description:
				'Satellite imagery and terrain analysis indicate high probability of road flooding near original checkpoint.',
			weatherCondition: 'Heavy Precipitation',
			estimatedDelay: '+8 min',
		},
	]

	// Cached predictive data
	const cachedData: CachedData = {
		timestamp: new Date().toISOString(),
		weatherConditions: 'Partly Cloudy, Wind 25 km/h',
		terrainStatus: 'Stable, No Obstructions',
		lastSync: '8 minutes ago',
	}

	// Initialize Mapbox map
	useEffect(() => {
		// Prevent double initialization
		if (!mapContainer.current || map.current) {
			return
		}

		// Check if Mapbox token is valid
		const token = mapboxgl.accessToken
		if (!token || !token.startsWith('pk.')) {
			console.error('❌ Mapbox token not configured or invalid.')
			console.error(
				'Please ensure NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN is set in .env.local'
			)
			console.error(
				'Get your token from: https://account.mapbox.com/access-tokens/'
			)
			setMapError(
				'Mapbox token missing or invalid. Please add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to .env.local'
			)
			// Still show the interface after 1 second
			setTimeout(() => setMapLoaded(true), 1000)
			return
		}

		console.log(
			'✅ Initializing Mapbox with valid token:',
			token.substring(0, 20) + '...'
		)

		let isMounted = true
		let newMap: mapboxgl.Map | null = null
		let offlineTimeout: NodeJS.Timeout | null = null

		const initMap = async () => {
			try {
				console.log('🗺️ Creating Mapbox instance...')
				console.log('📍 Center:', currentPosition)
				console.log(
					'🎨 Style:',
					process.env.NEXT_PUBLIC_MAPBOX_STYLE ||
						'mapbox://styles/mapbox/dark-v11'
				)

				// Per Mapbox docs: https://docs.mapbox.com/mapbox-gl-js/api/map/
				newMap = new mapboxgl.Map({
					container: mapContainer.current!,
					style:
						process.env.NEXT_PUBLIC_MAPBOX_STYLE ||
						'mapbox://styles/mapbox/dark-v11',
					center: currentPosition,
					zoom: 12,
					pitch: 45,
					bearing: 0,
					antialias: true,
					attributionControl: false,
					logoPosition: 'bottom-right',
					// Optimize for performance
					preserveDrawingBuffer: false,
					refreshExpiredTiles: true,
					// Ensure proper rendering
					renderWorldCopies: false,
					trackResize: true,
					maxTileCacheSize: 50,
					// Add access token explicitly (per docs recommendation)
					accessToken: MAPBOX_TOKEN,
				})

				// Store reference immediately
				map.current = newMap
				console.log('📦 Map instance created, waiting for load...')

				// Add loading timeout
				const loadTimeout = setTimeout(() => {
					if (!mapLoaded && isMounted) {
						console.warn('⚠️ Map load timeout - showing UI anyway')
						setMapLoaded(true)
						setMapError('Map took too long to load. Try refreshing.')
					}
				}, 10000) // 10 second timeout

				newMap.once('load', () => {
					clearTimeout(loadTimeout)

					if (!isMounted) {
						console.log('Component unmounted, skipping map setup')
						return
					}

					console.log('✅ Map loaded successfully!')
					console.log('📍 Center:', currentPosition)
					console.log('🎯 Zoom:', newMap?.getZoom())
					setMapLoaded(true)

					// Initialize routes after map is ready
					setTimeout(() => {
						if (isMounted && newMap) {
							console.log('🛣️ Initializing routes...')
							initializeRoutes(newMap)
							animateCurrentPosition(newMap)
						}
					}, 100)
				})

				newMap.once('styledata', () => {
					console.log('🎨 Map style loaded')
				})

				newMap.once('idle', () => {
					console.log('💤 Map idle (fully loaded)')
				})

				newMap.on('error', (e: any) => {
					console.error('❌ Mapbox error event fired:', e)

					// Extract detailed error information
					const error = e.error || e
					const errorDetails = {
						type: error?.type || 'Unknown',
						message: error?.message || 'Unknown error',
						status: error?.status,
						url: error?.url,
						fullError: error,
					}

					console.error('📊 Detailed error info:', errorDetails)
					console.error('🔗 Error URL:', error?.url)
					console.error('🔢 HTTP Status:', error?.status)

					// Check for common issues per Mapbox API docs
					let errorMessage = 'Map failed to load. '
					const status = error?.status
					const message = error?.message || ''

					if (status === 401) {
						// Per docs: https://docs.mapbox.com/api/guides/#access-tokens-and-token-scopes
						errorMessage += 'Invalid access token (401 Unauthorized). '
						errorMessage +=
							'Please verify your NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in .env.local'
						console.error(
							'💡 Get a new token: https://account.mapbox.com/access-tokens/'
						)
					} else if (status === 403) {
						errorMessage +=
							'Access forbidden (403). Token may have URL restrictions or insufficient scopes.'
						console.error(
							'💡 Check token scopes and URL restrictions at: https://account.mapbox.com/access-tokens/'
						)
					} else if (status === 429) {
						// Per docs: https://docs.mapbox.com/api/guides/#rate-limits
						errorMessage +=
							'Rate limit exceeded (429). Try again in 60 seconds.'
						console.error('💡 Rate limits: 2,000 requests/min for Styles API')
					} else if (status === 404) {
						errorMessage +=
							'Style not found (404). Check NEXT_PUBLIC_MAPBOX_STYLE value.'
						console.error(
							'💡 Valid styles: streets-v12, dark-v11, light-v11, satellite-v9'
						)
					} else if (message.toLowerCase().includes('cors')) {
						errorMessage +=
							'CORS error. Request blocked by browser security policy.'
						console.error('💡 Check CSP headers in next.config.ts')
						console.error(
							'💡 Try disabling browser extensions (ad blockers, privacy tools)'
						)
					} else if (message.toLowerCase().includes('network')) {
						errorMessage +=
							'Network error. Request may be blocked by firewall or ad blocker.'
						console.error(
							'💡 Check Network tab in DevTools for blocked requests'
						)
						console.error(
							'💡 Try disabling browser extensions or testing in incognito mode'
						)
					} else if (
						error?.type === 'RequestError' ||
						message.includes('fetch')
					) {
						errorMessage +=
							'Request blocked or failed. Check browser extensions and network policy.'
						console.error('💡 Common causes:')
						console.error('  - Ad blockers (uBlock Origin, Privacy Badger)')
						console.error('  - Privacy extensions')
						console.error('  - Corporate firewall')
						console.error('  - CSP policy too strict')
					} else {
						errorMessage += `Error: ${message || 'Unknown'}`
					}

					if (isMounted) {
						setMapError(errorMessage)
						setMapLoaded(true)
					}
				})

				// Simulate offline mode after 5 seconds
				offlineTimeout = setTimeout(() => {
					if (isMounted) {
						console.log('🔌 Offline mode activated')
						setIsOffline(true)
					}
				}, 5000)
			} catch (error) {
				console.error('Failed to initialize map:', error)
				if (isMounted) {
					setMapError('Failed to initialize map')
					setMapLoaded(true)
				}
			}
		}

		// Initialize map
		initMap()

		// Cleanup function
		return () => {
			console.log('🧹 Cleaning up Mapbox instance')
			isMounted = false

			if (offlineTimeout) {
				clearTimeout(offlineTimeout)
			}

			if (animationFrame.current) {
				cancelAnimationFrame(animationFrame.current)
			}

			if (newMap) {
				try {
					newMap.remove()
					map.current = null
				} catch (e) {
					console.warn('Error removing map:', e)
				}
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// Initialize route layers
	const initializeRoutes = (mapInstance: mapboxgl.Map) => {
		// Add 3D buildings layer for depth
		const layers = mapInstance.getStyle()?.layers
		const labelLayerId = layers?.find(
			(layer) => layer.type === 'symbol' && layer.layout?.['text-field']
		)?.id

		if (labelLayerId) {
			mapInstance.addLayer(
				{
					id: '3d-buildings',
					source: 'composite',
					'source-layer': 'building',
					filter: ['==', 'extrude', 'true'],
					type: 'fill-extrusion',
					minzoom: 15,
					paint: {
						'fill-extrusion-color': '#001E2C',
						'fill-extrusion-height': [
							'interpolate',
							['linear'],
							['zoom'],
							15,
							0,
							15.05,
							['get', 'height'],
						],
						'fill-extrusion-base': [
							'interpolate',
							['linear'],
							['zoom'],
							15,
							0,
							15.05,
							['get', 'min_height'],
						],
						'fill-extrusion-opacity': 0.6,
					},
				},
				labelLayerId
			)
		}

		// Add planned route source
		mapInstance.addSource('planned-route', {
			type: 'geojson',
			data: {
				type: 'Feature',
				properties: {},
				geometry: {
					type: 'LineString',
					coordinates: plannedRoute.map((wp) => wp.coordinates),
				},
			},
		})

		// Add planned route layer with glow
		mapInstance.addLayer({
			id: 'planned-route-glow',
			type: 'line',
			source: 'planned-route',
			layout: {
				'line-join': 'round',
				'line-cap': 'round',
			},
			paint: {
				'line-color': '#00597C',
				'line-width': 8,
				'line-blur': 4,
				'line-opacity': 0.6,
			},
		})

		mapInstance.addLayer({
			id: 'planned-route-line',
			type: 'line',
			source: 'planned-route',
			layout: {
				'line-join': 'round',
				'line-cap': 'round',
			},
			paint: {
				'line-color': '#00597C',
				'line-width': 4,
				'line-opacity': 1,
			},
		})

		// Add ghost paths
		ghostPaths.forEach((ghostPath, index) => {
			mapInstance.addSource(`ghost-route-${index}`, {
				type: 'geojson',
				data: {
					type: 'Feature',
					properties: {},
					geometry: {
						type: 'LineString',
						coordinates: ghostPath.coordinates,
					},
				},
			})

			// Ghost route glow
			mapInstance.addLayer({
				id: `ghost-route-glow-${index}`,
				type: 'line',
				source: `ghost-route-${index}`,
				layout: {
					'line-join': 'round',
					'line-cap': 'round',
				},
				paint: {
					'line-color': '#55DDCA',
					'line-width': 12,
					'line-blur': 8,
					'line-opacity': 0.4,
				},
			})

			// Ghost route line
			mapInstance.addLayer({
				id: `ghost-route-line-${index}`,
				type: 'line',
				source: `ghost-route-${index}`,
				layout: {
					'line-join': 'round',
					'line-cap': 'round',
				},
				paint: {
					'line-color': '#55DDCA',
					'line-width': 3,
					'line-opacity': 0.7,
					'line-dasharray': [2, 2],
				},
			})

			// Make ghost routes interactive
			mapInstance.on('click', `ghost-route-line-${index}`, () => {
				setSelectedGhostPath(ghostPath)
			})

			mapInstance.on('mouseenter', `ghost-route-line-${index}`, () => {
				mapInstance.getCanvas().style.cursor = 'pointer'
			})

			mapInstance.on('mouseleave', `ghost-route-line-${index}`, () => {
				mapInstance.getCanvas().style.cursor = ''
			})
		})

		// Add waypoint markers
		plannedRoute.forEach((waypoint, index) => {
			const el = document.createElement('div')
			el.className = 'waypoint-marker'
			el.style.width = '20px'
			el.style.height = '20px'
			el.style.borderRadius = '50%'
			el.style.border = '3px solid #00597C'
			el.style.backgroundColor =
				index === 0
					? '#55DDCA'
					: index === plannedRoute.length - 1
					? '#00597C'
					: '#ffffff'
			el.style.boxShadow = '0 0 20px rgba(0, 89, 124, 0.6)'
			el.style.cursor = 'pointer'

			if (index === 0) {
				el.style.animation =
					'pulse-wave 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
			}

			const marker = new mapboxgl.Marker({ element: el })
				.setLngLat(waypoint.coordinates)
				.setPopup(
					new mapboxgl.Popup({
						offset: 25,
						className: 'waypoint-popup',
					}).setHTML(
						`<div class="px-3 py-2">
              <div class="font-semibold text-sm text-slate-100">${waypoint.label}</div>
              <div class="text-xs text-slate-400 mt-1">ETA: ${waypoint.eta}</div>
            </div>`
					)
				)
				.addTo(mapInstance)
		})
	}

	// Animate current position along route
	const animateCurrentPosition = (mapInstance: mapboxgl.Map) => {
		const animate = () => {
			routeProgress.current += 0.0001

			if (routeProgress.current >= 1) {
				routeProgress.current = 0
			}

			const totalPoints = plannedRoute.length - 1
			const segment = Math.floor(routeProgress.current * totalPoints)
			const segmentProgress = (routeProgress.current * totalPoints) % 1

			if (segment < totalPoints) {
				const start = plannedRoute[segment].coordinates
				const end = plannedRoute[segment + 1].coordinates

				const lng = start[0] + (end[0] - start[0]) * segmentProgress
				const lat = start[1] + (end[1] - start[1]) * segmentProgress

				setCurrentPosition([lng, lat])

				// Update current position marker
				if (mapInstance.getSource('current-position')) {
					;(
						mapInstance.getSource('current-position') as mapboxgl.GeoJSONSource
					).setData({
						type: 'Feature',
						properties: {},
						geometry: {
							type: 'Point',
							coordinates: [lng, lat],
						},
					})
				} else {
					mapInstance.addSource('current-position', {
						type: 'geojson',
						data: {
							type: 'Feature',
							properties: {},
							geometry: {
								type: 'Point',
								coordinates: [lng, lat],
							},
						},
					})

					mapInstance.addLayer({
						id: 'current-position-glow',
						type: 'circle',
						source: 'current-position',
						paint: {
							'circle-radius': 20,
							'circle-color': '#55DDCA',
							'circle-opacity': 0.3,
							'circle-blur': 1,
						},
					})

					mapInstance.addLayer({
						id: 'current-position',
						type: 'circle',
						source: 'current-position',
						paint: {
							'circle-radius': 10,
							'circle-color': '#55DDCA',
							'circle-stroke-width': 3,
							'circle-stroke-color': '#ffffff',
						},
					})
				}
			}

			animationFrame.current = requestAnimationFrame(animate)
		}

		animate()
	}

	// Apply offline mode effect to map
	useEffect(() => {
		if (!map.current || !mapLoaded) return

		if (isOffline) {
			// Desaturate map when offline
			map.current.setPaintProperty('water', 'fill-color', '#0A1A20')
			map.current.setPaintProperty('land', 'background-color', '#001E2C')
		}
	}, [isOffline, mapLoaded])

	const handleCloseModal = () => {
		setSelectedGhostPath(null)
	}

	const handleSavePrediction = () => {
		console.log('Prediction saved:', selectedGhostPath)
		setSelectedGhostPath(null)
	}

	const getRiskColor = (level: 'low' | 'medium' | 'high') => {
		switch (level) {
			case 'low':
				return 'text-emerald-400'
			case 'medium':
				return 'text-amber-400'
			case 'high':
				return 'text-red-400'
			default:
				return 'text-slate-400'
		}
	}

	const getRiskBg = (level: 'low' | 'medium' | 'high') => {
		switch (level) {
			case 'low':
				return 'bg-emerald-500/10 border-emerald-500/30'
			case 'medium':
				return 'bg-amber-500/10 border-amber-500/30'
			case 'high':
				return 'bg-red-500/10 border-red-500/30'
			default:
				return 'bg-slate-500/10 border-slate-500/30'
		}
	}

	return (
		<div className="relative w-full h-screen overflow-hidden bg-linear-to-br from-[#001E2C] via-[#0A1A20] to-[#001E2C]">
			{/* Mapbox Container */}
			<div ref={mapContainer} className="absolute inset-0" />

			{/* Fallback SVG Visualization (when Mapbox fails) */}
			{!mapError && mapLoaded && (
				<div className="absolute inset-0 flex items-center justify-center p-3">
					<div className="relative w-full h-full max-w-7xl max-h-[800px]">
						<div className="relative w-full h-full rounded-3xl glass-panel shadow-2xl overflow-hidden">
							{/* Background Grid */}
							<div className="absolute inset-0 opacity-10">
								<div className="absolute inset-0 bg-[linear-gradient(to_right,#55DDCA_1px,transparent_1px),linear-gradient(to_bottom,#55DDCA_1px,transparent_1px)] bg-size-[40px_40px] neural-grid-flow" />
							</div>

							{/* SVG Route Visualization */}
							<svg
								viewBox="0 0 100 100"
								preserveAspectRatio="xMidYMid meet"
								className="absolute inset-0 w-full h-full"
							>
								<defs>
									<filter
										id="routeGlow"
										x="-50%"
										y="-50%"
										width="200%"
										height="200%"
									>
										<feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
										<feMerge>
											<feMergeNode in="coloredBlur" />
											<feMergeNode in="SourceGraphic" />
										</feMerge>
									</filter>
									<linearGradient
										id="ghostGrad"
										x1="0%"
										y1="0%"
										x2="100%"
										y2="0%"
									>
										<stop offset="0%" stopColor="#55DDCA" stopOpacity="0.8" />
										<stop offset="50%" stopColor="#55DDCA" stopOpacity="0.5" />
										<stop offset="100%" stopColor="#55DDCA" stopOpacity="0.2" />
									</linearGradient>
								</defs>

								{/* Ghost Paths */}
								<path
									d="M 40 50 Q 42.5 47.5 45 45 Q 50 43.5 55 42 Q 60 40 65 38 L 75 30"
									fill="none"
									stroke="url(#ghostGrad)"
									strokeWidth="1.5"
									strokeLinecap="round"
									filter="url(#routeGlow)"
									className="ghost-route-path"
								/>
								<path
									d="M 25 65 Q 27.5 61.5 30 58 Q 32.5 53 35 48 L 40 50"
									fill="none"
									stroke="url(#ghostGrad)"
									strokeWidth="1.5"
									strokeLinecap="round"
									filter="url(#routeGlow)"
									className="ghost-route-path"
									style={{ animationDelay: '0.5s' }}
								/>

								{/* Main Route */}
								<path
									d="M 15 80 Q 20 72.5 25 65 Q 32.5 57.5 40 50 Q 50 45 60 40 Q 67.5 35 75 30 L 85 20"
									fill="none"
									stroke="#00597C"
									strokeWidth="2.5"
									strokeLinecap="round"
									filter="url(#routeGlow)"
									className="planned-route-path"
								/>

								{/* Waypoints */}
								{[
									{ x: 15, y: 80 },
									{ x: 25, y: 65 },
									{ x: 40, y: 50 },
									{ x: 60, y: 40 },
									{ x: 75, y: 30 },
									{ x: 85, y: 20 },
								].map((point, i) => (
									<g key={i}>
										<circle
											cx={point.x}
											cy={point.y}
											r="2"
											fill="none"
											stroke="#00597C"
											strokeWidth="0.3"
											opacity="0.6"
											className="waypoint-pulse"
											style={{ animationDelay: `${i * 0.2}s` }}
										/>
										<circle
											cx={point.x}
											cy={point.y}
											r="1.2"
											fill={i === 0 ? '#55DDCA' : i === 5 ? '#00597C' : '#fff'}
											stroke="#00597C"
											strokeWidth="0.5"
										/>
										{i === 0 && (
											<circle
												cx={point.x}
												cy={point.y}
												r="2.5"
												fill="none"
												stroke="#55DDCA"
												strokeWidth="0.5"
												opacity="0.8"
												className="pulse-wave"
											/>
										)}
									</g>
								))}
							</svg>

							{/* Token Warning */}
							<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-center">
								<div className="glass-panel rounded-2xl px-6 py-4 max-w-md">
									<div className="text-amber-400 text-sm font-semibold mb-2">
										⚠️ Mapbox Token Required
									</div>
									<div className="text-xs text-slate-400 leading-relaxed">
										Add your Mapbox token to{' '}
										<code className="px-1 py-0.5 bg-slate-700/50 rounded text-[#55DDCA]">
											.env.local
										</code>
									</div>
									<div className="text-[10px] text-slate-500 mt-3">
										Showing fallback visualization
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Dark gradient overlay for atmosphere */}
			<div className="absolute inset-0 bg-linear-to-br from-[#001E2C]/20 via-transparent to-[#0A1A20]/20 pointer-events-none" />

			{/* Connection Status Indicator */}
			<div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 animate-fadeIn">
				<div className="flex items-center gap-3 px-5 py-2.5 rounded-full glass-panel shadow-2xl">
					<div className="relative flex items-center justify-center">
						<div
							className={cn(
								'w-2 h-2 rounded-full',
								isOffline ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
							)}
						/>
						{isOffline && (
							<div className="absolute w-2 h-2 bg-amber-400 rounded-full pulse-wave" />
						)}
					</div>
					<span className="text-xs font-medium text-slate-200 tracking-wide">
						{isOffline ? 'Offline Mode' : 'Connected'}
					</span>
					{isOffline && (
						<div className="px-2 py-0.5 rounded-full bg-slate-700/50 text-[10px] text-slate-300">
							Continuing via cached path
						</div>
					)}
					{!isOffline && mapLoaded && (
						<div className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-[10px] text-emerald-400 border border-emerald-500/20">
							🔒 HTTPS Secure
						</div>
					)}
				</div>
			</div>

			{/* Floating Trip Stats Panel */}
			<div className="absolute top-22 left-6 z-30 space-y-3 animate-fadeIn">
				{/* Speed Panel */}
				<div className="glass-panel rounded-2xl px-5 py-4 shadow-2xl min-w-[180px]">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-xl bg-[#55DDCA]/10">
							<Activity className="w-5 h-5 text-[#55DDCA]" />
						</div>
						<div>
							<div className="text-[10px] text-slate-400 uppercase tracking-wider">
								Speed
							</div>
							<div className="text-2xl font-bold text-slate-100 tracking-tight">
								{tripStats.speed}
								<span className="text-sm text-slate-400 ml-1">km/h</span>
							</div>
						</div>
					</div>
				</div>

				{/* ETA Panel */}
				<div className="glass-panel rounded-2xl px-5 py-4 shadow-2xl min-w-[180px]">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-xl bg-[#00597C]/20">
							<Timer className="w-5 h-5 text-[#00597C]" />
						</div>
						<div>
							<div className="text-[10px] text-slate-400 uppercase tracking-wider">
								ETA
							</div>
							<div className="text-2xl font-bold text-slate-100 tracking-tight">
								{tripStats.eta}
							</div>
						</div>
					</div>
				</div>

				{/* Distance Panel */}
				<div className="glass-panel rounded-2xl px-5 py-4 shadow-2xl min-w-[180px]">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-xl bg-blue-500/10">
							<Route className="w-5 h-5 text-blue-400" />
						</div>
						<div>
							<div className="text-[10px] text-slate-400 uppercase tracking-wider">
								Distance
							</div>
							<div className="text-xl font-bold text-slate-100 tracking-tight">
								{tripStats.distanceRemaining}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Cached Data Info Panel */}
			<div className="absolute top-22 right-6 z-30 glass-panel rounded-2xl px-5 py-4 shadow-2xl max-w-xs animate-fadeIn">
				<div className="flex items-center gap-2 mb-3">
					<Info className="w-4 h-4 text-[#55DDCA]" />
					<span className="text-xs font-semibold text-slate-200 tracking-wide">
						Cached Intelligence
					</span>
				</div>
				<div className="space-y-2 text-[11px]">
					<div className="flex items-center gap-2 text-slate-300">
						<Cloud className="w-3.5 h-3.5 text-slate-400" />
						<span>{cachedData.weatherConditions}</span>
					</div>
					<div className="flex items-center gap-2 text-slate-300">
						<Waves className="w-3.5 h-3.5 text-slate-400" />
						<span>{cachedData.terrainStatus}</span>
					</div>
					<div className="flex items-center gap-2 text-slate-400 pt-2 border-t border-slate-700/50">
						<Clock className="w-3.5 h-3.5" />
						<span>Last sync: {cachedData.lastSync}</span>
					</div>
				</div>
			</div>

			{/* Bottom Control Panel */}
			<div className="absolute bottom-30 left-1/2 transform -translate-x-1/2 z-30 animate-fadeIn">
				<div className="glass-panel rounded-2xl px-6 py-4 shadow-2xl">
					<div className="flex items-center gap-6">
						{/* Navigation Status */}
						<div className="flex items-center gap-3">
							<Navigation className="w-5 h-5 text-[#55DDCA] animate-pulse" />
							<div>
								<div className="text-xs font-semibold text-slate-200">
									En Route
								</div>
								<div className="text-[10px] text-slate-400">
									Next: Checkpoint Alpha
								</div>
							</div>
						</div>

						{/* Divider */}
						<div className="h-10 w-px bg-slate-700/50" />

						{/* Legend */}
						<div className="space-y-1.5">
							<div className="flex items-center gap-2">
								<div className="w-8 h-1 bg-[#00597C] rounded-full shadow-lg shadow-[#00597C]/30" />
								<span className="text-[10px] text-slate-300 font-medium">
									Planned Route
								</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-8 h-1 bg-[#55DDCA]/70 rounded-full shadow-lg shadow-[#55DDCA]/20" />
								<span className="text-[10px] text-slate-300 font-medium">
									Ghost Prediction
								</span>
							</div>
						</div>

						{/* Divider */}
						<div className="h-10 w-px bg-slate-700/50" />

						{/* Predictive Drift Info */}
						{isOffline && (
							<div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
								<Zap className="w-4 h-4 text-amber-400" />
								<div>
									<div className="text-[10px] text-amber-400 font-semibold">
										Predicted drift
									</div>
									<div className="text-xs text-amber-300">+3 mins</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Alternative Route Insight Modal */}
			{selectedGhostPath && (
				<div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-[#001E2C]/90 backdrop-blur-lg animate-fadeIn">
					<div className="relative w-full max-w-lg rounded-3xl glass-panel shadow-2xl overflow-hidden animate-scaleIn">
						{/* Modal Header */}
						<div className="relative px-6 py-5 border-b border-slate-700/50">
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-3">
									<div className="p-2.5 rounded-xl bg-[#55DDCA]/10 border border-[#55DDCA]/20">
										<TrendingUp className="w-5 h-5 text-[#55DDCA]" />
									</div>
									<div>
										<h3 className="text-lg font-bold text-slate-100 tracking-tight">
											Alternative Route Insight
										</h3>
										<p className="text-xs text-slate-400 mt-0.5">
											Predictive analysis based on cached data
										</p>
									</div>
								</div>
								<button
									onClick={handleCloseModal}
									className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors duration-200"
									aria-label="Close modal"
									tabIndex={0}
								>
									<X className="w-5 h-5 text-slate-400" />
								</button>
							</div>
						</div>

						{/* Modal Content */}
						<div className="px-6 py-5 space-y-4">
							{/* Risk Level Badge */}
							<div
								className={cn(
									'inline-flex items-center gap-2 px-4 py-2 rounded-full border',
									getRiskBg(selectedGhostPath.riskLevel)
								)}
							>
								<div
									className={cn(
										'w-2 h-2 rounded-full animate-pulse',
										getRiskColor(selectedGhostPath.riskLevel)
									)}
								/>
								<span
									className={cn(
										'text-xs font-semibold uppercase tracking-wider',
										getRiskColor(selectedGhostPath.riskLevel)
									)}
								>
									{selectedGhostPath.riskLevel} Risk
								</span>
							</div>

							{/* Reason */}
							<div className="space-y-2">
								<div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
									<Wind className="w-4 h-4 text-amber-400" />
									<span>{selectedGhostPath.reason}</span>
								</div>
								<p className="text-sm text-slate-400 leading-relaxed">
									{selectedGhostPath.description}
								</p>
							</div>

							{/* Details Grid */}
							<div className="grid grid-cols-2 gap-3">
								{/* Confidence Level */}
								<div className="px-4 py-3 rounded-xl bg-slate-700/30 border border-slate-700/50">
									<div className="text-[10px] text-slate-400 mb-1 uppercase tracking-wider">
										Confidence
									</div>
									<div className="text-xl font-bold text-[#55DDCA]">
										{(selectedGhostPath.confidence * 100).toFixed(0)}%
									</div>
								</div>

								{/* Estimated Delay */}
								<div className="px-4 py-3 rounded-xl bg-slate-700/30 border border-slate-700/50">
									<div className="text-[10px] text-slate-400 mb-1 uppercase tracking-wider">
										Est. Delay
									</div>
									<div className="text-xl font-bold text-amber-400">
										{selectedGhostPath.estimatedDelay}
									</div>
								</div>
							</div>

							{/* Weather Condition */}
							{selectedGhostPath.weatherCondition && (
								<div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-700/20 border border-slate-700/30">
									<Droplets className="w-5 h-5 text-blue-400" />
									<div>
										<div className="text-[10px] text-slate-400 uppercase tracking-wider">
											Weather Condition
										</div>
										<div className="text-sm font-medium text-slate-200">
											{selectedGhostPath.weatherCondition}
										</div>
									</div>
								</div>
							)}
						</div>

						{/* Modal Actions */}
						<div className="px-6 py-4 border-t border-slate-700/50 bg-slate-800/30">
							<div className="flex gap-3">
								<button
									onClick={handleCloseModal}
									className="flex-1 px-4 py-2.5 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-sm font-medium text-slate-300 transition-all duration-200"
									tabIndex={0}
								>
									Dismiss
								</button>
								<button
									onClick={handleSavePrediction}
									className="flex-1 px-4 py-2.5 rounded-xl bg-[#55DDCA] hover:bg-[#55DDCA]/90 text-sm font-semibold text-slate-900 transition-all duration-200 shadow-lg shadow-[#55DDCA]/20"
									tabIndex={0}
								>
									Save Prediction
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Loading State */}
			{!mapLoaded && (
				<div className="absolute inset-0 flex items-center justify-center bg-[#001E2C] z-40">
					<div className="text-center space-y-6 px-6">
						<div className="w-16 h-16 border-4 border-[#55DDCA]/20 border-t-[#55DDCA] rounded-full animate-spin mx-auto" />
						<div className="space-y-2">
							<div className="text-lg font-semibold text-slate-200">
								Initializing Ghost Route...
							</div>
							<div className="text-sm text-slate-400">
								Loading predictive navigation system
							</div>
						</div>
						<div className="glass-panel rounded-xl px-4 py-3 max-w-sm mx-auto">
							<div className="text-xs text-slate-400 leading-relaxed">
								💡 <strong className="text-slate-300">First time setup:</strong>{' '}
								Add your Mapbox token to{' '}
								<code className="px-1 py-0.5 bg-slate-700/50 rounded text-[#55DDCA]">
									.env.local
								</code>{' '}
								for full map features
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
