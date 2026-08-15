import { useEffect, useState } from 'react'
import { ChevronRight, ClipboardList, Store, Wrench, Zap, Box, ShoppingCart, Repeat } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { workOrders, URGENCY_CONFIG, STATUS_CONFIG, countOrdersByStatus } from '@/lib/mock'

interface HomePageProps {
  onNavigate: (tab: 'orders' | 'mine') => void
  onForm: () => void
  onDetail: (orderId: string) => void
  /** 点击门店名称（返回门店绑定/切换页） */
  onBindStore: () => void
}

const STATUS_CARDS: Array<{ status: Parameters<typeof countOrdersByStatus>[0]; label: string }> = [
  { status: 'all', label: '全部工单' },
  { status: 0, label: STATUS_CONFIG[0].label },
  { status: 3, label: STATUS_CONFIG[3].label },
  { status: 4, label: STATUS_CONFIG[4].label },
]

const COMMON_TOOLS = [
  { label: '设备管理', icon: <Box size={20} />, color: 'bg-sky-50 text-sky-500' },
  { label: '门店列表', icon: <Store size={20} />, color: 'bg-emerald-50 text-emerald-500' },
  { label: '报修记录', icon: <ClipboardList size={20} />, color: 'bg-indigo-50 text-indigo-500' },
  { label: '帮助中心', icon: <Wrench size={20} />, color: 'bg-rose-50 text-rose-500' },
]

/** 金刚区：核心业务快捷入口（放置于首页较上方）——每项为单层配色的瓷片 */
const KENGANG = [
  { label: '安装', icon: <Wrench size={24} />, bg: 'bg-brand-50', color: 'text-brand-600' },
  { label: '采购', icon: <ShoppingCart size={24} />, bg: 'bg-emerald-50', color: 'text-emerald-600' },
  { label: '保养', icon: <Repeat size={24} />, bg: 'bg-sky-50', color: 'text-sky-600' },
  { label: '耗材', icon: <Box size={24} />, bg: 'bg-purple-50', color: 'text-purple-600' },
]

/* ── 滚动 banner ── */

/** banner 数据（不同类型给不同强调色） */
interface Banner {
  title: string
  subtitle: string
  tag: string
  gradient: string
}

const BANNERS: Banner[] = [
  { title: '壹咖保障 · 报修无忧', subtitle: '统一维修服务，全程可追踪', tag: '服务保障', gradient: 'from-brand-500 to-brand-600' },
  { title: '预约上门维修', subtitle: '专业师傅，快速上门', tag: '上门服务', gradient: 'from-sky-500 to-sky-600' },
  { title: '新店开业 · 免费检测', subtitle: '安装保养特惠进行中', tag: '特惠活动', gradient: 'from-emerald-500 to-emerald-600' },
]

/** 首页顶部自动滚动的 banner 轮播 */
function BannerCarousel() {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % BANNERS.length), 3500)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative h-28 rounded-2xl overflow-hidden">
      {/* 轮播内容 */}
      <div className="absolute inset-0 overflow-hidden">
        {BANNERS.map((b, i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-gradient-to-r ${b.gradient} px-5 py-4 transition-opacity duration-500 ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="flex items-start gap-3 h-full">
              <span className="mt-0.5 h-7 px-2.5 rounded-full bg-white/20 text-white text-[11px] font-medium flex items-center shrink-0">
                {b.tag}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-white text-[16px] font-semibold leading-snug">{b.title}</div>
                <div className="text-white/80 text-[11px] mt-1">{b.subtitle}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 指示点 */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            aria-label={`banner ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`rounded-full transition-all ${
              i === index ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export function HomePage({ onNavigate, onForm, onDetail, onBindStore }: HomePageProps) {
  const pinnedOrders = workOrders
    .slice()
    .sort((a, b) => (b.createdAt < a.createdAt ? -1 : 1))
    .slice(0, 3)

  return (
    <div className="pb-2 space-y-3">
      {/* 顶部滚动 banner */}
      <BannerCarousel />

      {/* 金刚区：左 2 列大格（快速报修）+ 右 2 列小格（业务入口） */}
        <div className="grid grid-cols-4 gap-2.5 auto-rows-fr">
          {/* 左区大格：快速报修（主瓷片，跨 2 列 2 行放大） */}
          <button
            onClick={onForm}
            className="col-span-2 row-span-2 min-h-[132px] flex flex-col justify-between rounded-2xl bg-brand-500 p-4 text-left text-white active:bg-brand-600 active:scale-[0.99] transition-all shadow-lg shadow-brand-500/20"
          >
            <span className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                <Zap size={22} fill="currentColor" />
              </span>
              <span className="text-[17px] font-bold leading-none whitespace-nowrap">快速报修</span>
            </span>
            <span className="flex items-center gap-1 text-[13px] font-medium whitespace-nowrap">
              立即报修 <ChevronRight size={15} />
            </span>
          </button>

          {/* 右区小格：安装 / 采购 / 保养 / 耗材（2 列堆叠） */}
          {KENGANG.map((k) => (
            <button
              key={k.label}
              onClick={() => alert(`${k.label}功能建设中，敬请期待。`)}
              className={`flex flex-col items-center justify-center gap-1 rounded-2xl ${k.bg} active:scale-[0.96] transition-transform`}
            >
              <span className={k.color}>{k.icon}</span>
              <span className="text-[12px] font-medium text-gray-700">{k.label}</span>
            </button>
          ))}
        </div>

      {/* 我的工单 */}
      <section>
        <div className="flex items-center justify-between px-1 mb-2">
          <h2 className="text-base font-semibold text-gray-900">我的工单</h2>
          <button onClick={() => onNavigate('orders')} className="text-xs text-gray-400 flex items-center">
            查看全部 <ChevronRight size={14} />
          </button>
        </div>
        <Card>
          {/* 工单统计 */}
          <CardContent className="grid grid-cols-4 gap-1 px-3 pt-4 pb-3">
            {STATUS_CARDS.map((c) => (
              <button
                key={c.label}
                onClick={() => onNavigate('orders')}
                className="flex flex-col items-center gap-1 rounded-lg py-1 active:bg-gray-50"
              >
                <span className="text-xl font-bold text-gray-900 leading-none">{countOrdersByStatus(c.status)}</span>
                <span className="text-[11px] text-gray-500">{c.label}</span>
              </button>
            ))}
          </CardContent>

          {/* 分隔线 */}
          <div className="mx-4 h-px bg-gray-100" />

          {/* 置顶 3 条具体工单 */}
          <CardContent className="p-0 px-0 pb-0">
            {pinnedOrders.map((o) => {
              const st = STATUS_CONFIG[o.status]
              const urg = URGENCY_CONFIG[o.urgency]
              return (
                <button
                  key={o.id}
                  onClick={() => onDetail(o.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left active:bg-gray-50"
                >
                  <span className={`h-2 w-2 rounded-full shrink-0 ${urg.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{o.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{o.location}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${st.badge}`}>{st.label}</span>
                    <span className="text-[11px] text-gray-400">{o.createdAt.slice(5)}</span>
                  </div>
                </button>
              )
            })}
          </CardContent>
        </Card>
      </section>

      {/* 常用功能 */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 px-1 mb-2">常用功能</h2>
        <Card>
          <CardContent className="grid grid-cols-4 gap-1 p-3">
            {COMMON_TOOLS.map((t) => (
              <button
                key={t.label}
                onClick={() => (t.label === '门店列表' ? onBindStore() : undefined)}
                className="flex flex-col items-center gap-2 rounded-xl py-3 active:bg-gray-50"
              >
                <span className={`h-11 w-11 rounded-2xl flex items-center justify-center ${t.color}`}>{t.icon}</span>
                <span className="text-[11px] text-gray-600">{t.label}</span>
              </button>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
