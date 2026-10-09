import { useState } from 'react'
import { Plus, MapPin, Phone, Store, CalendarClock, TriangleAlert } from 'lucide-react'
import { REPAIR_TYPES, URGENCY_CONFIG, Urgency, currentUser, getStore, CONSTRUCTION_KEY } from '@/lib/mock'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const URGENCY_KEYS: Urgency[] = [1, 2, 3, 4]

/** 施工需要的资质选项 */
const QUALIFICATIONS = ['建筑施工', '装饰装修', '机电安装', '防水工程', '消防工程', '其他']

interface FormPageProps {
  /** 当前绑定门店 id —— 提交的工单归属于该门店 */
  boundStoreId: string
}

export function FormPage({ boundStoreId }: FormPageProps) {
  const [type, setType] = useState<string | null>(null)
  const [urgency, setUrgency] = useState<Urgency>(2)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [location, setLocation] = useState('A栋 3楼 301')
  const [images, setImages] = useState(0)
  const [visitTime, setVisitTime] = useState('')
  const store = getStore(boundStoreId)

  // 施工专属字段
  const [qualifications, setQualifications] = useState<string[]>([])
  const [environment, setEnvironment] = useState('')
  const [budget, setBudget] = useState('')
  const [quote, setQuote] = useState('')
  const [drawings, setDrawings] = useState(0)

  const isConstruction = type === CONSTRUCTION_KEY

  const canSubmit = type && title.trim().length > 0 && desc.trim().length > 0 && visitTime

  const toggleQualification = (q: string) =>
    setQualifications((prev) => (prev.includes(q) ? prev.filter((x) => x !== q) : [...prev, q]))

  return (
    <div className="pb-2 space-y-3">
      {/* 所属门店（只读，绑定后自动带出） */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <span className="h-9 w-9 rounded-lg bg-brand-50 text-brand-500 flex items-center justify-center">
              <Store size={17} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-gray-400">归属门店</div>
              <div className="text-sm font-medium text-gray-900 truncate">{store.name}</div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-[10px] font-medium">
              已绑定
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 类型（报修 / 施工） */}
      <Card>
        <CardContent className="p-4">
          <SectionTitle required>{isConstruction ? '施工类型' : '报修类型'}</SectionTitle>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {REPAIR_TYPES.map((t) => {
              const active = type === t.key
              return (
                <button
                  key={t.key}
                  onClick={() => setType(t.key)}
                  className={`py-3 rounded-xl border text-center text-[12px] transition-colors ${
                    active
                      ? 'border-brand-500 bg-brand-50 text-brand-600 font-medium'
                      : 'border-gray-100 bg-gray-50 text-gray-600'
                  }`}
                >
                  {t.label}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 标题 */}
      <Card>
        <CardContent className="p-4">
          <SectionTitle required>{isConstruction ? '施工标题' : '报修标题'}</SectionTitle>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={isConstruction ? '简单描述施工内容，如：三楼办公区间隔改造' : '简单描述一下问题，如：3楼空调不制冷'}
            className="mt-3"
          />
        </CardContent>
      </Card>

      {/* 故障/施工描述 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <SectionTitle required>{isConstruction ? '施工说明' : '故障描述'}</SectionTitle>
            <span className={`text-[11px] ${desc.length < 10 ? 'text-orange-500' : 'text-gray-400'}`}>{desc.length}/10+</span>
          </div>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder={
              isConstruction
                ? '请详细描述施工范围、方案要求等...'
                : '请详细描述故障现象（建议最少 10 字），便于维修人员快速判断...'
            }
            rows={4}
            className="mt-3 w-full h-24 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none"
          />
        </CardContent>
      </Card>

      {/* 现场/施工图片 */}
      <Card>
        <CardContent className="p-4">
          <SectionTitle>{isConstruction ? '施工实景' : '故障图片'}</SectionTitle>
          <div className="mt-3 flex gap-2">
            {Array.from({ length: images }).map((_, i) => (
              <button
                key={i}
                onClick={() => setImages((n) => n - 1)}
                className="relative h-20 w-20 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
                <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">×</span>
              </button>
            ))}
            {images < 3 && (
              <button
                onClick={() => setImages((n) => n + 1)}
                className="h-20 w-20 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 flex flex-col items-center justify-center gap-1 active:bg-gray-50"
              >
                <Plus size={20} />
                <span className="text-[10px]">拍照/相册</span>
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 紧急程度 */}
      <Card>
        <CardContent className="p-4">
          <SectionTitle required>紧急程度</SectionTitle>
          <div className="mt-3 flex gap-2">
            {URGENCY_KEYS.map((k) => {
              const cfg = URGENCY_CONFIG[k]
              const active = urgency === k
              return (
                <button
                  key={k}
                  onClick={() => setUrgency(k)}
                  className={`flex-1 py-2.5 rounded-xl border text-[12px] text-center transition-colors ${
                    active ? `${cfg.badge} font-medium border-2` : 'border-gray-100 bg-gray-50 text-gray-500'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 上门时间 */}
      <Card>
        <CardContent className="p-4">
          <SectionTitle required>上门时间</SectionTitle>
          <div className="mt-3 relative">
            <Input
              type="datetime-local"
              value={visitTime}
              onChange={(e) => setVisitTime(e.target.value)}
              className="pr-10"
            />
            <CalendarClock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="mt-2 text-[11px] text-gray-400">请选择合适的到店/到场时间，便于安排人员。</div>
        </CardContent>
      </Card>

      {/* 施工专属字段 */}
      {isConstruction && (
        <>
          {/* 需要资质 */}
          <Card>
            <CardContent className="p-4">
              <SectionTitle required>需要资质</SectionTitle>
              <div className="mt-3 flex flex-wrap gap-2">
                {QUALIFICATIONS.map((q) => {
                  const active = qualifications.includes(q)
                  return (
                    <button
                      key={q}
                      onClick={() => toggleQualification(q)}
                      className={`px-3 py-2 rounded-xl border text-[12px] transition-colors ${
                        active
                          ? 'border-brand-500 bg-brand-50 text-brand-600 font-medium'
                          : 'border-gray-100 bg-gray-50 text-gray-600'
                      }`}
                    >
                      {q}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* 施工环境 */}
          <Card>
            <CardContent className="p-4">
              <SectionTitle required>施工环境</SectionTitle>
              <Input
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                placeholder="如：室内隔断施工、室外高空作业、夜间施工等"
                className="mt-3"
              />
            </CardContent>
          </Card>

          {/* 预算目标 + 工程报价 */}
          <Card>
            <CardContent className="p-4">
              <SectionTitle>预算目标</SectionTitle>
              <div className="mt-3 relative">
                <Input
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="请输入预算金额"
                  inputMode="decimal"
                  className="pr-12"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">元</span>
              </div>

              <div className="mt-4 border-t border-gray-50 pt-4">
                <SectionTitle>工程报价</SectionTitle>
                <div className="mt-3 relative">
                  <Input
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    placeholder="请输入报价金额"
                    inputMode="decimal"
                    className="pr-12"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">元</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 施工图纸 */}
          <Card>
            <CardContent className="p-4">
              <SectionTitle>施工图纸</SectionTitle>
              <div className="mt-3 flex gap-2">
                {Array.from({ length: drawings }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setDrawings((n) => n - 1)}
                    className="relative h-20 w-20 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 6 15 12 9 18" />
                    </svg>
                    <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">×</span>
                  </button>
                ))}
                {drawings < 5 && (
                  <button
                    onClick={() => setDrawings((n) => n + 1)}
                    className="h-20 w-20 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 flex flex-col items-center justify-center gap-1 active:bg-gray-50"
                  >
                    <Plus size={20} />
                    <span className="text-[10px]">上传图纸</span>
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* 地点 + 联系信息 */}
      <Card>
        <CardContent className="p-4">
          <SectionTitle required>{isConstruction ? '施工地点' : '报修地点'}</SectionTitle>
          <div className="mt-3 flex gap-2">
            <div className="flex-1 relative">
              <Input value={location} onChange={(e) => setLocation(e.target.value)} className="pr-10" />
              <MapPin size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <Button variant="outline" className="shrink-0 h-11 px-4" onClick={() => setLocation('已自动定位')}>
              定位
            </Button>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Phone size={15} className="text-gray-400" />
              <span>{currentUser.name}</span>
              <span className="text-gray-400">{currentUser.phone}</span>
            </div>
            <button className="text-[12px] text-brand-500">修改</button>
          </div>
        </CardContent>
      </Card>

      {/* 重要提示 */}
      <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
        <TriangleAlert size={16} className="text-amber-500 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-700 leading-relaxed">
          请如实填写，提交后将由专员审核派单{isConstruction ? '，施工类工单需附施工图纸与报价供审核确认' : ''}。如有紧急情况请直接致电门店或客服，避免延误处理。
        </p>
      </div>

      {/* 底部提交 */}
      <div className="sticky bottom-0 -mx-4 px-4 pt-3 bg-white border-t border-gray-100 safe-bottom pb-3">
        <Button
          className="w-full h-12 text-base"
          disabled={!canSubmit}
          onClick={() => alert(`${isConstruction ? '施工' : '报修'}提交成功！已进入待审核队列（归属门店：${store.name}）。`)}
        >
          提交{isConstruction ? '施工' : '报修'}
        </Button>
      </div>
    </div>
  )
}

function SectionTitle({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-1 h-4 rounded-full bg-brand-500" />
      <span className="text-sm font-semibold text-gray-900">
        {children}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
    </div>
  )
}
