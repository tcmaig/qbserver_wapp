import {
  ClipboardList,
  Wrench,
  Handshake,
  Hammer,
  BadgeCheck,
  XCircle,
  type LucideIcon,
} from 'lucide-react'
import { messages, MessageItem } from '@/lib/mock'
import { Card, CardContent } from '@/components/ui/card'

interface MessagePageProps {
  onDetail: (orderId: string) => void
}

/** 消息类型 → 图标 + 配色 */
const TYPE_STYLE: Record<MessageItem['type'], { icon: LucideIcon; bg: string; color: string }> = {
  audit: { icon: ClipboardList, bg: 'bg-brand-50', color: 'text-brand-500' },
  assign: { icon: Wrench, bg: 'bg-blue-50', color: 'text-blue-500' },
  accept: { icon: Handshake, bg: 'bg-sky-50', color: 'text-sky-500' },
  repairing: { icon: Hammer, bg: 'bg-orange-50', color: 'text-orange-500' },
  finish: { icon: BadgeCheck, bg: 'bg-green-50', color: 'text-green-500' },
  reject: { icon: XCircle, bg: 'bg-red-50', color: 'text-red-500' },
}

export function MessagePage({ onDetail }: MessagePageProps) {
  return (
    <div className="pb-2 space-y-3">
      {messages.map((m) => (
        <MessageCard key={m.id} item={m} onDetail={onDetail} />
      ))}
    </div>
  )
}

function MessageCard({ item: m, onDetail }: { item: MessageItem; onDetail: (id: string) => void }) {
  const style = TYPE_STYLE[m.type]
  const Icon = style.icon
  return (
    <button onClick={() => onDetail(m.orderId)} className="w-full text-left">
      <Card
        className={`active:bg-gray-50 transition-colors ${
          m.unread ? 'border-brand-200' : ''
        }`}
      >
        <CardContent className="p-4 flex items-start gap-3">
          <span
            className={`relative shrink-0 h-11 w-11 rounded-xl flex items-center justify-center ${style.bg}`}
          >
            <Icon size={20} className={style.color} />
            {m.unread && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span
                className={`text-sm font-semibold truncate ${
                  m.unread ? 'text-gray-900' : 'text-gray-600'
                }`}
              >
                {m.title}
              </span>
              <span className="text-[11px] text-gray-400 shrink-0 ml-2">{m.time}</span>
            </div>
            <p
              className={`mt-1 text-xs leading-relaxed ${
                m.unread ? 'text-gray-600' : 'text-gray-400'
              }`}
            >
              {m.content}
            </p>
          </div>
        </CardContent>
      </Card>
    </button>
  )
}
