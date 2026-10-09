import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { WorkOrder, workOrders, STATUS_CONFIG, URGENCY_CONFIG, progressPercent, getStore } from '@/lib/mock'
import { Card, CardContent } from '@/components/ui/card'

interface OrdersPageProps {
  onDetail: (orderId: string) => void
}

type FilterKey = 'all' | 'pending' | 'doing' | 'done'

const FILTERS: Array<{ key: FilterKey; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待处理' },
  { key: 'doing', label: '进行中' },
  { key: 'done', label: '已完成' },
]

/** 待处理：待审核/已派单/已接单；进行中：维修中/待验收；已完成：已完成 */
function matches(o: WorkOrder, key: FilterKey): boolean {
  switch (key) {
    case 'pending':
      return [0, 1, 2].includes(o.status)
    case 'doing':
      return [3, 4].includes(o.status)
    case 'done':
      return o.status === 5
    case 'all':
    default:
      return true
  }
}

export function OrdersPage({ onDetail }: OrdersPageProps) {
  const [filter, setFilter] = useState<FilterKey>('all')
  const list = workOrders.filter((o) => matches(o, filter))

  return (
    <div className="pb-2">
      {/* 顶部筛选 Tab（sticky 跟随内容滚动，样式遵循小程序导航栏下的二级 Tab 栏） */}
      <div className="sticky top-0 -mx-4 px-4 bg-white shadow-sm" style={{ marginTop: '-18px' }}>
        <div className="flex">
          {FILTERS.map((f) => {
            const active = filter === f.key
            const count =
              f.key === 'all'
                ? workOrders.length
                : workOrders.filter((o) => matches(o, f.key)).length
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`relative flex-1 py-3 text-sm transition-colors ${
                  active ? 'text-brand-500 font-semibold' : 'text-gray-500'
                }`}
              >
                {f.label}
                {count > 0 && (
                  <span className={`text-[10px] ml-1 ${active ? 'text-brand-400' : 'text-gray-400'}`}>
                    {count}
                  </span>
                )}
                {active && (
                  <span className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 h-0.5 w-8 rounded-full bg-brand-500" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* 工单列表 */}
      <div className="mt-3 space-y-3 pb-2">
        {list.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-16">暂无相关工单</div>
        ) : (
          list.map((o) => <OrderCard key={o.id} order={o} onDetail={onDetail} />)
        )}
      </div>
    </div>
  )
}

function OrderCard({ order: o, onDetail }: { order: WorkOrder; onDetail: (id: string) => void }) {
  const status = STATUS_CONFIG[o.status]
  const urgency = URGENCY_CONFIG[o.urgency]
  const pct = progressPercent(o.status)

  return (
    <button
      onClick={() => onDetail(o.id)}
      className="w-full text-left"
    >
      <Card className="active:bg-gray-50 transition-colors">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${urgency.dot}`} />
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-50 text-gray-600 border border-gray-100">
                {urgency.label}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${status.badge}`}>
                {status.label}
              </span>
            </div>
          </div>

          <h3 className="mt-2.5 text-[15px] font-semibold text-gray-900 leading-snug">{o.title}</h3>

          <div className="mt-1.5 text-xs text-gray-500">
            <span className="text-gray-400">{getStore(o.storeId).name}</span>
            <span className="mx-1">·</span>
            {o.location}
            {o.technician && <span> · {o.technician.name}</span>}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div className={`h-full rounded-full ${status.bar}`} style={{ width: `${pct}%` }} />
            </div>
            <span className="text-[11px] text-gray-400 shrink-0">{o.createdAt.slice(5)}</span>
            <ChevronRight size={16} className="text-gray-300 shrink-0" />
          </div>
        </CardContent>
      </Card>
    </button>
  )
}
