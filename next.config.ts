import type { NextConfig } from 'next'
import withPWAInit from '@ducanh2912/next-pwa'

const withPWA = withPWAInit({
	dest: 'public',
	cacheOnFrontEndNav: true,
	aggressiveFrontEndNavCaching: true,
	reloadOnOnline: true,
	// Disable PWA only in development, enable in production
	disable: process.env.NODE_ENV === 'development',
	// Use default service worker name
	sw: 'sw.js',
	// Set fallback for offline
	fallbacks: {
		document: '/offline',
	},
	workboxOptions: {
		disableDevLogs: true,
		// Don't fail on precaching errors
		skipWaiting: true,
		clientsClaim: true,
		// Ignore precaching errors for development
		ignoreURLParametersMatching: [/.*/],
		// Exclude files that shouldn't be precached
		exclude: [
			/\.map$/,
			/manifest$/,
			/^manifest$/,
			/\.DS_Store$/,
			({ asset, compilation }) => {
				if (
					asset.name.startsWith('server/') ||
					asset.name.match(
						/^((app-|^)build-manifest\.json|react-loadable-manifest\.json)$/
					)
				) {
					return true
				}
				if (
					process.env.NODE_ENV === 'development' &&
					!asset.name.startsWith('static/runtime/')
				) {
					return true
				}
				return false
			},
		],
		// Add runtime caching fallback for navigation
		runtimeCaching: [
			{
				urlPattern: /^https:\/\/api\.mapbox\.com\/styles\/.*$/,
				handler: 'StaleWhileRevalidate',
				options: {
					cacheName: 'mapbox-styles',
					expiration: {
						maxEntries: 10,
						maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
					},
				},
			},
			{
				urlPattern: /^https:\/\/api\.mapbox\.com\/.*\.pbf.*$/,
				handler: 'CacheFirst',
				options: {
					cacheName: 'mapbox-tiles',
					expiration: {
						maxEntries: 500,
						maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
					},
				},
			},
			{
				urlPattern: /^https:\/\/api\.mapbox\.com\/fonts\/.*$/,
				handler: 'CacheFirst',
				options: {
					cacheName: 'mapbox-fonts',
					expiration: {
						maxEntries: 50,
						maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
					},
				},
			},
			{
				urlPattern: /^\/$/,
				handler: 'NetworkFirst',
				options: {
					cacheName: 'pages',
					expiration: {
						maxEntries: 32,
						maxAgeSeconds: 24 * 60 * 60, // 24 hours
					},
					networkTimeoutSeconds: 10,
				},
			},
			{
				urlPattern: /^\/.*$/,
				handler: 'NetworkFirst',
				options: {
					cacheName: 'pages',
					expiration: {
						maxEntries: 32,
						maxAgeSeconds: 24 * 60 * 60,
					},
					networkTimeoutSeconds: 10,
				},
			},
		],
	},
})

const nextConfig: NextConfig = {
	/* config options here */
	// Add empty turbopack config to silence the warning
	turbopack: {},
	allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
	experimental: {
		scrollRestoration: true,
		turbopackUseSystemTlsCerts: true,
	},
	// Enable external requests to Mapbox APIs
	// Per Mapbox docs: https://docs.mapbox.com/api/guides/#https-and-cors
	async headers() {
		return [
			{
				source: '/:path*',
				headers: [
					{
						key: 'Access-Control-Allow-Origin',
						value: '*',
					},
					{
						key: 'Access-Control-Allow-Methods',
						value: 'GET, POST, PUT, DELETE, OPTIONS',
					},
					{
						key: 'Access-Control-Allow-Headers',
						value: 'Content-Type, Authorization',
					},
					{
						key: 'Content-Security-Policy',
						value:
							"default-src 'self'; " +
							"script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://api.mapbox.com; " +
							"style-src 'self' 'unsafe-inline' https://api.mapbox.com; " +
							"img-src 'self' data: blob: https://api.mapbox.com https://*.tiles.mapbox.com; " +
							"font-src 'self' data: https://api.mapbox.com; " +
							"connect-src 'self' https://api.mapbox.com https://*.tiles.mapbox.com https://events.mapbox.com wss://*.tiles.mapbox.com; " +
							"worker-src 'self' blob:; " +
							'child-src blob:; ' +
							"frame-src 'self' blob:;",
					},
				],
			},
		]
	},
}

export default withPWA(nextConfig)
