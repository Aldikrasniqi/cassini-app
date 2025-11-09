'use client'

export default function Offline() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
			<h1 className="text-4xl font-bold mb-4">You are offline</h1>
			<p className="text-lg text-gray-600 mb-8">
				It seems you are not connected to the internet. Please check your
				connection and try again.
			</p>
			<button
				onClick={() => window.location.reload()}
				className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
			>
				Try Again
			</button>
		</div>
	)
}
