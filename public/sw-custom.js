// Simple custom service worker for offline testing
const CACHE_NAME = 'terra-pulse-v1'
const OFFLINE_URL = '/_offline'

// Install event - no precaching to avoid 404 errors
self.addEventListener('install', (event) => {
	console.log('[Service Worker] Installing...')
	// Skip waiting to activate immediately
	self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
	console.log('[Service Worker] Activating...')
	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) => {
				return Promise.all(
					cacheNames
						.filter((cacheName) => cacheName !== CACHE_NAME)
						.map((cacheName) => {
							console.log('[Service Worker] Deleting old cache:', cacheName)
							return caches.delete(cacheName)
						})
				)
			})
			.then(() => {
				console.log('[Service Worker] Claiming clients...')
				return self.clients.claim()
			})
	)
})

// Fetch event - handle offline with fallback
self.addEventListener('fetch', (event) => {
	const { request } = event
	const url = new URL(request.url)

	// Only handle same-origin requests
	if (url.origin !== location.origin) {
		return
	}

	// Skip Chrome extension requests
	if (url.protocol === 'chrome-extension:') {
		return
	}

	// Handle navigation requests (page loads)
	if (request.mode === 'navigate') {
		event.respondWith(
			fetch(request)
				.then((response) => {
					// Clone and cache successful responses
					if (response.ok) {
						const responseClone = response.clone()
						caches.open(CACHE_NAME).then((cache) => {
							cache.put(request, responseClone)
						})
					}
					return response
				})
				.catch(() => {
					console.log('[Service Worker] Network failed, showing offline page')
					// When offline, ALWAYS show the offline page (don't serve cached pages)
					return new Response(
						`<!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Offline - Terra Pulse</title>
                <style>
                  body {
                    font-family: system-ui, -apple-system, sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    margin: 0;
                    padding: 2rem;
                    text-align: center;
                    background: #f5f5f5;
                  }
                  h1 { font-size: 2.5rem; margin-bottom: 1rem; color: #000; }
                  p { color: #666; font-size: 1.125rem; margin-bottom: 2rem; max-width: 500px; }
                  button {
                    padding: 0.75rem 1.5rem;
                    background: #000;
                    color: #fff;
                    border: none;
                    border-radius: 0.5rem;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: background 0.2s;
                  }
                  button:hover { background: #333; }
                </style>
              </head>
              <body>
                <h1>🌐 You are offline</h1>
                <p>It seems you are not connected to the internet. Please check your connection and try again.</p>
                <button onclick="window.location.reload()">Try Again</button>
              </body>
              </html>`,
						{
							status: 503,
							statusText: 'Service Unavailable',
							headers: new Headers({
								'Content-Type': 'text/html',
							}),
						}
					)
				})
		)
	} else {
		// For other requests (JS, CSS, images, etc.)
		event.respondWith(
			fetch(request)
				.then((response) => {
					// Only cache successful responses
					if (response.ok && response.status === 200) {
						const responseClone = response.clone()
						caches.open(CACHE_NAME).then((cache) => {
							cache.put(request, responseClone)
						})
					}
					return response
				})
				.catch(() => {
					// Try to serve from cache if network fails
					return caches.match(request).then((cachedResponse) => {
						if (cachedResponse) {
							return cachedResponse
						}
						// Return empty response for failed non-navigation requests
						return new Response('', { status: 503 })
					})
				})
		)
	}
})

console.log('[Service Worker] Loaded')
