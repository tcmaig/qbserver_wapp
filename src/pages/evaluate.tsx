import { useState } from 'react'
import { Star, RotateCcw, CheckCircle2, Camera } from 'lucide-react'
import { workOrders, getStore } from '@/lib/mock'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface EvaluatePageProps {
  orderId: string
  onDetail: (orderId: string) => void
}

export function EvaluatePage({ orderId, onDetail }: EvaluatePageProps) {
  const o = workOrders.find((x) => x.id === orderId) ?? workOrders[0]
  const summary = o.repairSummary

  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState('')

  const showRating = hover || rating

  return (
    <div className="pb-2">
      {/* 完成横幅 */}
      <div className="bg-brand-500 text-white px-4 py-5 rounded-2xl flex items-center gap-3 -mx-1">
        <span className="h-11 w-11 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <CheckCircle2 size={22} />
        </span>
        <div>
          <div className="text-base font-semibold leading-tight">维修已完成</div>
          <div className="text-[12px] text-white/80 leading-snug mt-0.5">请确认维修结果并评价，帮助提升服务质量</div>
        </div>
      </div>

      {/* 工单信息 */}
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-[13px] font-medium text-gray-900 truncate">{o.title}</div>
            <div className="text-xs text-gray-500 mt-0.5 truncate">{o.id} · {getStore(o.storeId).name} · {o.location}</div>
          </div>
          <button onClick={() => onDetail(o.id)} className="shrink-0 text-xs text-brand-500 font-medium ml-3">
            查看详情
          </button>
        </CardContent>
      </Card>

      {/* 维修摘要 */}
      {summary && (
        <Card>
          <CardContent className="p-4">
            <SectionTitle>维修摘要</SectionTitle>
            <div className="mt-3 space-y-3">
              <SumRow label="故障原因" value={summary.cause} />
              <SumRow label="处理方法" value={summary.method} />
              <SumRow label="更换备件" value={summary.parts} />
              <SumRow label="维修耗时" value={summary.duration} />
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">维修费用</span>
                <span className="text-sm font-semibold text-orange-600">{summary.cost}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 维修后照片 */}
      <Card>
        <CardContent className="p-4">
          <SectionTitle>维修后照片</SectionTitle>
          <div className="mt-3 flex gap-2">
            {Array.from({ length: Math.max(summary?.afterImages ?? 1, 1) }).map((_, i) => (
              <div
                key={i}
                className="h-20 w-20 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center"
              >
                <Camera size={22} className="text-gray-300" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 满意度评分 */}
      <Card>
        <CardContent className="p-4">
          <SectionTitle>满意度评分</SectionTitle>
          <div className="mt-3 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                size={34}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(n)}
                className={`cursor-pointer transition-colors ${
                  n <= showRating
                    ? rating > 0
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-amber-300'
                    : 'text-gray-200'
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-500">
              {rating > 0 ? `${rating} 星` : ''}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 文字评价 */}
      <Card>
        <CardContent className="p-4">
          <SectionTitle>
            评价 <span className="text-[11px] font-normal text-gray-400">（选填）</span>
          </SectionTitle>
          <Input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="说说这次维修体验吧..."
            maxLength={120}
            className="mt-3 h-20 items-start py-3 rounded-xl bg-gray-50"
          />
          <div className="text-right text-[11px] text-gray-400 mt-1">{comment.length}/120</div>
        </CardContent>
      </Card>

      {/* 底部操作 */}
      <div className="sticky bottom-0 -mx-4 px-4 pt-3 bg-white border-t border-gray-100 safe-bottom pb-3">
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-12"
            disabled={rating === 0}
            onClick={() => alert('已退回重修，工单将回到「维修中」状态')}
          >
            <RotateCcw size={18} /> 退回重修
          </Button>
          <Button className="flex-1 h-12" disabled={rating === 0}>
            确认完成
          </Button>
        </div>
        {rating === 0 && (
          <p className="text-center text-[11px] text-gray-400 mt-2">请先完成满意度评分</p>
        )}
      </div>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-1 h-4 rounded-full bg-brand-500" />
      <span className="text-sm font-semibold text-gray-900">{children}</span>
    </div>
  )
}

function SumRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs text-gray-500 shrink-0">{label}</span>
      <span className="text-[13px] text-gray-900 text-right">{value}</span>
    </div>
  )
}
