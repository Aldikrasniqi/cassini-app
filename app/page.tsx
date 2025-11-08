import Link from 'next/link'

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h1>Hello World</h1>
			<p>This is a test of the offline mode.</p>
			<Link href="/_offline" className="text-blue-500">
				Go to the offline mode
			</Link>
		</div>
	)
}
