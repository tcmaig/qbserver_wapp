import { Phone, Plus } from 'lucide-react'
import { workOrders, STATUS_CONFIG, URGENCY_CONFIG, progressPercent, getStore } from '@/lib/mock'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface OrderDetailPageProps {
  orderId: string
  onEvaluate: (orderId: string) => void
}

export function OrderDetailPage({ orderId, onEvaluate }: OrderDetailPageProps) {
  const o = workOrders.find((x) => x.id === orderId) ?? workOrders[0]
  const status = STATUS_CONFIG[o.status]
  const urgency = URGENCY_CONFIG[o.urgency]
  const pct = progressPercent(o.status)
  const isWaitingReview = o.status === 4

  return (
    <div className="pb-2 space-y-3">
      {/* 状态头部卡片 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-gray-900">{o.id}</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1 ${status.badge}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          </div>

          <div className="mt-3">
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div className={`h-full rounded-full ${status.bar}`} style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-1.5 text-[11px] text-gray-400">进度 {pct}%</div>
          </div>
        </CardContent>
      </Card>

      {/* 工单信息 */}
      <Card>
        <CardContent className="p-4">
          <SectionTitle>工单信息</SectionTitle>
          <div className="mt-3 space-y-3">
            <InfoRow label="归属门店" value={getStore(o.storeId).name} />
            <InfoRow label="报修类型" value={o.typeLabel} />
            <InfoRow label="报修地点" value={o.location} />
            <InfoRow label="紧急程度" value={<span className={`inline-flex items-center gap-1.5 ${urgency.text}`}><span className={`h-2 w-2 rounded-full ${urgency.dot}`} />{urgency.label}</span>} />
            <InfoRow label="提交时间" value={o.createdAt} />
            <InfoRow label="联系信息" value={`${o.contactName} ${o.contactPhone}`} />
          </div>
        </CardContent>
      </Card>

      {/* 进度追踪 */}
      <Card>
        <CardContent className="p-4">
          <SectionTitle>进度追踪</SectionTitle>
          <div className="mt-3">
            <Timeline nodes={o.timeline} />
          </div>
        </CardContent>
      </Card>

      {/* 维修人信息 */}
      {o.technician && (
        <Card>
          <CardContent className="p-4">
            <SectionTitle>维修人员</SectionTitle>
            <div className="mt-3 flex items-center gap-3">
              <span className="h-11 w-11 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center text-base font-semibold">
                {o.technician.name.slice(0, 1)}
              </span>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{o.technician.name}</div>
                <div className="text-xs text-gray-500">{o.technician.phone}</div>
              </div>
              <a
                href={`tel:${o.technician.phone}`}
                className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-brand-500 text-white text-sm font-medium"
              >
                <Phone size={15} /> 拨打电话
              </a>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 图片附件 */}
      <Card>
        <CardContent className="p-4">
          <SectionTitle>附件图片</SectionTitle>
          <div className="mt-3 flex gap-2">
            {Array.from({ length: Math.max(o.images, 1) }).map((_, i) => (
              <ImgPlaceholder key={i} index={i} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 底部操作栏（sticky 于底部安全区） */}
      <div className="sticky bottom-0 -mx-4 px-4 pt-3 bg-white border-t border-gray-100 safe-bottom pb-3">
        {isWaitingReview ? (
          <Button
            className="w-full h-12 text-base"
            onClick={() => onEvaluate(o.id)}
          >
            去验收评价
          </Button>
        ) : (
          <a
            href={`tel:${o.contactPhone}`}
            className="w-full h-12 rounded-xl border border-gray-200 bg-white text-gray-700 text-base font-medium flex items-center justify-center gap-2 active:bg-gray-50"
          >
            <Phone size={18} /> 联系报修人
          </a>
        )}
      </div>
    </div>
  )
}

/* ── 小组件 ── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-1 h-4 rounded-full bg-brand-500" />
      <span className="text-sm font-semibold text-gray-900">{children}</span>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-gray-500 shrink-0">{label}</span>
      <span className="text-[13px] text-gray-900 text-right">{value}</span>
    </div>
  )
}

function Timeline({ nodes }: { nodes: { label: string; time?: string; operator?: string; done: boolean }[] }) {
  return (
    <ol className="relative ml-1">
      {nodes.map((node, i) => {
        const isLast = i === nodes.length - 1
        const current = node.done && !nodes[i + 1]?.done
        return (
          <li key={node.label} className="relative pl-7 pb-5 last:pb-0">
            {!isLast && (
              <span
                className={`absolute left-[9px] top-5 bottom-0 w-px ${
                  nodes[i + 1]?.done ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
            <span
              className={`absolute left-0 top-1 h-[18px] w-[18px] rounded-full border-2 flex items-center justify-center ${
                current
                  ? 'border-orange-500 bg-orange-500 animate-pulse'
                  : node.done
                  ? 'border-green-500 bg-green-500 text-white'
                  : 'border-gray-300 bg-white'
              }`}
            >
              {node.done && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              )}
            </span>
            <div className="pt-0.5 flex items-start justify-between gap-2">
              <div>
                <span className={`text-sm ${current ? 'font-semibold text-orange-600' : node.done ? 'font-medium text-gray-900' : 'text-gray-400'}`}>
                  {node.label}
                </span>
                {node.operator && (
                  <span className="block text-[11px] text-gray-400 mt-0.5">
                    {node.operator === '王管理' ? '审核人：' : '责任人：'}
                    {node.operator}
                  </span>
                )}
              </div>
              {node.time && <span className="text-[11px] text-gray-400 shrink-0">{node.time}</span>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function ImgPlaceholder({ index }: { index: number }) {
  return (
    <button className="relative h-20 w-20 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
      <Plus size={22} className="text-gray-300" />
      <span className="absolute bottom-1 right-1 text-[9px] text-gray-400">{index + 1}</span>
    </button>
  )
}
