'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

// Set Mapbox token
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''

if (typeof window !== 'undefined' && MAPBOX_TOKEN) {
	mapboxgl.accessToken = MAPBOX_TOKEN
	// Disable telemetry to prevent events.mapbox.com requests
	// This fixes the blocked request issue
	;(mapboxgl as any).config = {
		...(mapboxgl as any).config,
		EVENTS_URL: false,
	}
	console.log('🔒 Mapbox telemetry disabled (prevents blocked requests)')
}

export const SimpleMapTest = () => {
	const mapContainer = useRef<HTMLDivElement>(null)
	const map = useRef<mapboxgl.Map | null>(null)
	const [mapLoaded, setMapLoaded] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!mapContainer.current || map.current) return

		// Verify token
		if (!MAPBOX_TOKEN || !MAPBOX_TOKEN.startsWith('pk.')) {
			setError('Invalid Mapbox token')
			return
		}

		console.log('🗺️ Initializing simple Mapbox map...')

		try {
			// Create minimal map
			const newMap = new mapboxgl.Map({
				container: mapContainer.current,
				style: 'mapbox://styles/mapbox/dark-v11',
				center: [-122.4194, 37.7749], // San Francisco
				zoom: 12,
			})

			map.current = newMap

			// Handle load event
			newMap.on('load', () => {
				console.log('✅ Map loaded successfully!')
				setMapLoaded(true)
			})

			// Handle errors
			newMap.on('error', (e) => {
				console.error('❌ Map error:', e)
				setError('Map failed to load. Check console.')
			})

			// Add navigation controls
			newMap.addControl(new mapboxgl.NavigationControl(), 'top-right')

			// Add a marker
			new mapboxgl.Marker({ color: '#55DDCA' })
				.setLngLat([-122.4194, 37.7749])
				.setPopup(
					new mapboxgl.Popup().setHTML(
						'<div style="padding: 8px; color: #000;">📍 San Francisco</div>'
					)
				)
				.addTo(newMap)
		} catch (err: any) {
			console.error('Failed to create map:', err)
			setError(err.message || 'Failed to create map')
		}

		// Cleanup
		return () => {
			if (map.current) {
				map.current.remove()
				map.current = null
			}
		}
	}, [])

	return (
		<div className="relative w-full h-screen bg-slate-900">
			{/* Map Container */}
			<div ref={mapContainer} className="absolute inset-0" />

			{/* Loading State */}
			{!mapLoaded && !error && (
				<div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-50">
					<div className="text-center space-y-4">
						<div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto" />
						<div className="text-lg font-semibold text-white">
							Loading Map...
						</div>
						<div className="text-sm text-slate-400">Connecting to Mapbox</div>
					</div>
				</div>
			)}

			{/* Error State */}
			{error && (
				<div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500/90 text-white px-6 py-3 rounded-lg shadow-lg">
					<div className="font-semibold">⚠️ Error</div>
					<div className="text-sm">{error}</div>
				</div>
			)}

			{/* Success Indicator */}
			{mapLoaded && !error && (
				<div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-green-500/90 text-white px-6 py-3 rounded-lg shadow-lg animate-fadeIn">
					✅ Map Loaded Successfully!
				</div>
			)}

			{/* Info Panel */}
			<div className="absolute bottom-30 left-4 z-40 bg-slate-800/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg shadow-lg">
				<div className="text-xs font-semibold mb-2">Simple Map Test</div>
				<div className="text-xs space-y-1">
					<div>📍 San Francisco, CA</div>
					<div>🗺️ Style: dark-v11</div>
					<div className="flex items-center gap-2">
						<div
							className={`w-2 h-2 rounded-full ${
								mapLoaded ? 'bg-green-400' : 'bg-yellow-400 animate-pulse'
							}`}
						/>
						<span>{mapLoaded ? 'Connected' : 'Connecting...'}</span>
					</div>
				</div>
			</div>
		</div>
	)
}
