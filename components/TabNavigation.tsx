'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { HeartbeatInterface } from './pages/HeartbeatInterface'
import { SatelliteVisionToggle } from './pages/SatelliteVisionToggle'
import { TimelineInterface } from './pages/TimelineInterface'
import { HealthScoreInterface } from './pages/HealthScoreInterface'
import { GhostRouteInterface } from './pages/GhostRouteInterface'

import {
	HeartPulse,
	SatelliteDish,
	Clock3,
	Activity,
	Ghost,
} from 'lucide-react'

type TabId = 'heartbeat' | 'satellite' | 'timeline' | 'health' | 'ghost'

interface Tab {
	id: TabId
	label: string
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
	component: React.ComponentType
}

const tabs: Tab[] = [
	{
		id: 'heartbeat',
		label: 'Heartbeat',
		icon: HeartPulse,
		component: HeartbeatInterface,
	},
	{
		id: 'satellite',
		label: 'Satellite',
		icon: SatelliteDish,
		component: SatelliteVisionToggle,
	},
	{
		id: 'timeline',
		label: 'Timeline',
		icon: Clock3,
		component: TimelineInterface,
	},
	{
		id: 'health',
		label: 'Health',
		icon: Activity,
		component: HealthScoreInterface,
	},
	{
		id: 'ghost',
		label: 'Ghost',
		icon: Ghost,
		component: GhostRouteInterface,
	},
]

export const TabNavigation = () => {
	const [activeTab, setActiveTab] = useState<TabId>('heartbeat')

	const handleTabClick = (tabId: TabId) => setActiveTab(tabId)
	const handleKeyDown = (event: React.KeyboardEvent, tabId: TabId) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault()
			setActiveTab(tabId)
		}
	}

	const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component

	return (
		<div className="flex flex-col h-screen bg-slate-50 text-slate-900 relative">
			{/* Content Area */}
			<div className="flex-1 overflow-hidden bg-slate-50 pb-20">
				{ActiveComponent && <ActiveComponent />}
			</div>

			{/* Fixed Bottom Tab Bar - Mobile First */}
			<div className="fixed bottom-4 left-0 right-0 bg-white/5 backdrop-blur-sm border-t border-slate-100/20 shadow-lg w-[95%] mx-auto rounded-full p-1 z-50">
				{/* Safe area padding for mobile devices */}
				<div className="px-2 pt-2 pb-safe h-full">
					<div className="flex justify-between items-center ">
						{tabs.map((tab) => {
							const Icon = tab.icon
							const isActive = activeTab === tab.id

							return (
								<button
									key={tab.id}
									onClick={() => handleTabClick(tab.id)}
									onKeyDown={(e) => handleKeyDown(e, tab.id)}
									tabIndex={0}
									aria-label={`Switch to ${tab.label} tab`}
									className={cn(
										'flex flex-col items-center justify-center py-2 min-w-0 flex-1 transition-all duration-300 ease-out',
										'hover:scale-105 focus:outline-none focus:scale-105',
										'active:scale-95 touch-manipulation'
									)}
								>
									{/* Tab icon container with background */}
									<div
										className={cn(
											'relative flex items-center justify-center w-13 h-13 rounded-full mb-1 transition-all duration-300 ease-out',
											isActive
												? 'bg-black/70 shadow-lg shadow-primary/25 scale-110'
												: 'bg-transparent hover:bg-slate-100'
										)}
									>
										<Icon
											className={cn(
												'w-6 h-6 transition-all duration-300',
												isActive
													? 'text-white/90 stroke-[2.5]'
													: 'text-slate-400 stroke-2'
											)}
										/>
									</div>
								</button>
							)
						})}
					</div>
				</div>
			</div>
		</div>
	)
}
