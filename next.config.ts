import type { NextConfig } from 'next'
import withPWAInit from '@ducanh2912/next-pwa'

const withPWA = withPWAInit({
	dest: 'public',
	cacheOnFrontEndNav: true,
	aggressiveFrontEndNavCaching: true,
	reloadOnOnline: true,
	// Enable PWA in development for testing offline mode
	disable: false,
	// Custom service worker
	sw: 'sw-custom.js',
	workboxOptions: {
		disableDevLogs: true,
		// Don't fail on precaching errors
		skipWaiting: true,
		clientsClaim: true,
		// Ignore precaching errors for development
		ignoreURLParametersMatching: [/.*/],
		// Add runtime caching fallback for navigation
		runtimeCaching: [
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
	allowedDevOrigins: [
		'local-origin.dev',
		'*.local-origin.dev',
		'http://10.21.236.45:3000',
		'https://10.21.236.45:3000',
	],
	// Enable CORS for mobile testing
	async headers() {
		return [
			{
				// Apply CORS headers to all routes
				source: '/(.*)',
				headers: [
					{
						key: 'Access-Control-Allow-Origin',
						value: '*', // Allow all origins for development
					},
					{
						key: 'Access-Control-Allow-Methods',
						value: 'GET, POST, PUT, DELETE, OPTIONS',
					},
					{
						key: 'Access-Control-Allow-Headers',
						value: 'Content-Type, Authorization, X-Requested-With',
					},
					{
						key: 'Access-Control-Allow-Credentials',
						value: 'true',
					},
				],
			},
		]
	},
}

export default withPWA(nextConfig)
