import { ChevronRight, ClipboardList, FileText, MapPin, BookOpen, Settings } from 'lucide-react'
import type { ReactNode } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { currentUser, workOrders, getStore } from '@/lib/mock'

interface MinePageProps {
  boundStoreId: string
  onNavigate: (tab: 'home' | 'orders') => void
  onBindStore: () => void
}

const MENUS: Array<{ label: string; icon: ReactNode; color: string }> = [
  { label: '设备管理', icon: <ClipboardList size={18} />, color: 'text-sky-500' },
  { label: '门店列表', icon: <MapPin size={18} />, color: 'text-emerald-500' },
  { label: '报修记录', icon: <FileText size={18} />, color: 'text-indigo-500' },
  { label: '帮助中心', icon: <BookOpen size={18} />, color: 'text-rose-500' },
  { label: '设置', icon: <Settings size={18} />, color: 'text-gray-500' },
]

function statOf(statuses: number[]) {
  return workOrders.filter((o) => statuses.includes(o.status)).length
}

export function MinePage({ boundStoreId, onNavigate, onBindStore }: MinePageProps) {
  const total = workOrders.length
  const doing = statOf([3, 4])
  const done = statOf([5])
  const storeName = getStore(boundStoreId).name

  return (
    <div className="pb-2 space-y-3">
      {/* 用户信息卡 */}
      <button onClick={onBindStore} className="w-full text-left">
        <Card className="active:bg-gray-50 transition-colors">
          <CardContent className="p-5 flex items-center gap-4">
            <Avatar size="lg" className="bg-brand-50 text-brand-500" fallback={currentUser.avatarText} />
            <div className="flex-1 min-w-0">
              <div className="text-lg font-semibold text-gray-900">{currentUser.name}</div>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                <MapPin size={12} className="text-gray-400" />
                <span className="truncate">{storeName}</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </CardContent>
        </Card>
      </button>

      {/* 工单统计 */}
      <Card>
        <CardContent className="grid grid-cols-3 divide-x divide-gray-100 py-4">
          <StatCell label="全部工单" value={total} onClick={() => onNavigate('orders')} />
          <StatCell label="进行中" value={doing} onClick={() => onNavigate('orders')} />
          <StatCell label="已完成" value={done} onClick={() => onNavigate('orders')} />
        </CardContent>
      </Card>

      {/* 菜单 */}
      <Card>
        <CardContent className="p-1 py-1.5">
          {MENUS.map((m, i) => (
            <button
              key={m.label}
              className={`w-full flex items-center gap-3 px-3 py-3.5 active:bg-gray-50 ${
                i !== 0 ? 'border-t border-gray-50' : ''
              }`}
              onClick={() =>
                m.label === '报修记录'
                  ? onNavigate('orders')
                  : m.label === '门店列表'
                  ? onBindStore()
                  : undefined
              }
            >
              <span className={m.color}>{m.icon}</span>
              <span className="flex-1 text-left text-sm text-gray-800">{m.label}</span>
              <ChevronRight size={16} className="text-gray-300" />
            </button>
          ))}
        </CardContent>
      </Card>

      {/* 手机号展示（脱敏） */}
      <Card>
        <CardContent className="p-1 py-1.5">
          <div className="flex items-center gap-3 px-3 py-3.5">
            <span className="text-gray-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </span>
            <span className="flex-1 text-left text-sm text-gray-800">绑定手机号</span>
            <span className="text-xs text-gray-400">{currentUser.phone}</span>
          </div>
        </CardContent>
      </Card>

      <div className="px-1 pt-1">
        <Button className="w-full" size="lg" variant="outline" onClick={() => alert('已退出登录')}>
          退出登录
        </Button>
      </div>
    </div>
  )
}

function StatCell({ label, value, onClick }: { label: string; value: number; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-0.5 py-1 active:opacity-70">
      <span className="text-xl font-semibold text-gray-900 leading-none">{value}</span>
      <span className="text-[11px] text-gray-500">{label}</span>
    </button>
  )
}
