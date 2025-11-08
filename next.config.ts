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
}

export default withPWA(nextConfig)
