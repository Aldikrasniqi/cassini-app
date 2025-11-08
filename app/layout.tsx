import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Script from 'next/script'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Terra Pulse',
	description: 'The Eye of Satellite.',
	applicationName: 'Terra Pulse',
	appleWebApp: {
		capable: true,
		statusBarStyle: 'default',
		title: 'Terra Pulse',
	},
	formatDetection: {
		telephone: false,
	},
	manifest: '/manifest.webmanifest',
	icons: {
		icon: [
			{ url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
			{ url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
		],
		apple: [
			{
				url: '/icons/apple-touch-icon.png',
				sizes: '180x180',
				type: 'image/png',
			},
		],
	},
}

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	themeColor: '#000000',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				{children}
				<Script
					id="register-sw"
					strategy="afterInteractive"
					dangerouslySetInnerHTML={{
						__html: `
                            if ('serviceWorker' in navigator) {
                                window.addEventListener('load', function() {
                                    navigator.serviceWorker
                                        .register('/sw.js')
                                        .then(function(registration) {
                                            console.log('✅ Service Worker registered with scope:', registration.scope);
                                        })
                                        .catch(function(error) {
                                            console.error('❌ Service Worker registration failed:', error);
                                        });
                                });
                            }
                        `,
					}}
				/>
			</body>
		</html>
	)
}
