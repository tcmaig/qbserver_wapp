import { Home, Store, ClipboardList, User } from 'lucide-react'

export type TabKey = 'home' | 'mall' | 'orders' | 'mine'

interface TabBarProps {
  activeTab: TabKey
  onTabChange: (tab: TabKey) => void
}

const tabs = [
  { key: 'home' as const, label: '首页', icon: Home },
  { key: 'mall' as const, label: '商城', icon: Store },
  { key: 'orders' as const, label: '工单', icon: ClipboardList },
  { key: 'mine' as const, label: '我的', icon: User },
]

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="flex items-center justify-around h-[56px] bg-white border-t border-gray-100 px-6 pb-1">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.key
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className="relative flex flex-col items-center gap-0.5 min-w-[64px] active:scale-95 transition-transform"
          >
            <Icon
              size={22}
              className={isActive ? 'text-brand-500' : 'text-gray-400'}
            />
            <span
              className={`text-[10px] font-medium ${
                isActive ? 'text-brand-500' : 'text-gray-400'
              }`}
            >
              {tab.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
