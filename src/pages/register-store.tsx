import { useState } from 'react'
import { MapPin, Store as StoreIcon, ChevronDown, Check } from 'lucide-react'
import { REGISTER_DISTRICTS, suggestStoreName, registerStore } from '@/lib/mock'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface RegisterStorePageProps {
  /** 登记新门店成功后回调，参数为新门店 id（登记即绑定为当前门店） */
  onRegistered: (storeId: string) => void
}

/**
 * 登记新门店页（PRD §3.1 门店管理相关）：
 * 1. 选择所在区域 → 自动生成默认店名（可改）
 * 2. 填写详细地址
 * 3. 登记后立即生效并绑定为当前门店（原型内「登记即生效」，真实场景由管理端审核）
 */
export function RegisterStorePage({ onRegistered }: RegisterStorePageProps) {
  const [district, setDistrict] = useState<string>('')
  const [districtOpen, setDistrictOpen] = useState(false)
  const [storeName, setStoreName] = useState('')
  const [detail, setDetail] = useState('')
  const [touchedName, setTouchedName] = useState(false)

  // 区域变化或首次选择时，自动带出默认店名（但用户手动改过则保留）
  const pickDistrict = (d: string) => {
    setDistrict(d)
    setDistrictOpen(false)
    if (!touchedName) setStoreName(suggestStoreName(d))
  }

  const canSubmit = district && storeName.trim().length > 0 && detail.trim().length > 0

  const submit = () => {
    if (!canSubmit) return
    const store = registerStore(district, storeName.trim(), detail.trim())
    onRegistered(store.id)
  }

  return (
    <div className="pb-2">
      {/* 顶部说明 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 h-10 w-10 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center shrink-0">
              <StoreIcon size={19} />
            </span>
            <div>
              <div className="text-sm font-semibold text-gray-900">登记新门店</div>
              <div className="mt-0.5 text-xs text-gray-500 leading-relaxed">
                找不到你的门店？在此登记。登记后立即成为当前绑定门店（真实场景由管理端审核后上线）。
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 选择所在区域 */}
      <Card>
        <CardContent className="p-4">
          <FieldLabel required>选择所在区域</FieldLabel>
          <div className="relative mt-3">
            <button
              onClick={() => setDistrictOpen((v) => !v)}
              className="w-full h-11 rounded-xl border border-gray-200 bg-white px-4 flex items-center justify-between text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              <span className={district ? 'text-gray-900' : 'text-gray-400'}>
                {district || '请选择区域'}
              </span>
              <ChevronDown size={16} className="text-gray-400" />
            </button>
            {districtOpen && (
              <div className="absolute z-10 mt-1.5 w-full rounded-xl border border-gray-100 bg-white shadow-lg max-h-48 overflow-auto">
                {REGISTER_DISTRICTS.map((d) => (
                  <button
                    key={d}
                    onClick={() => pickDistrict(d)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left active:bg-gray-50 ${
                      district === d ? 'text-brand-600 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {d}
                    {district === d && <Check size={15} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-3.5 text-[11px] text-gray-400 flex items-center gap-1">
            <MapPin size={12} /> 系统将根据所选区域自动生成店名，可修改。
          </div>
        </CardContent>
      </Card>

      {/* 门店名称（自动生成，可改） */}
      <Card>
        <CardContent className="p-4">
          <FieldLabel required>门店名称</FieldLabel>
          <Input
            value={storeName}
            onChange={(e) => {
              setStoreName(e.target.value)
              setTouchedName(true)
            }}
            placeholder={district ? suggestStoreName(district) : '如：壹咖·滨江区店'}
            className="mt-3"
          />
          {district && (
            <div className="mt-2 text-[11px] text-brand-500 flex items-center gap-1">
              <Check size={12} /> 已按「{district}」自动生成，可直接修改。
            </div>
          )}
        </CardContent>
      </Card>

      {/* 详细地址 */}
      <Card>
        <CardContent className="p-4">
          <FieldLabel required>详细地址</FieldLabel>
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="如：江汉路 1515 号天街 2F"
            rows={2}
            className="mt-3 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none"
          />
          <div className="mt-2 text-[11px] text-gray-400">
            完整地址将自动拼装为：{district ? `杭州市${district}` : '杭州市（请选择区域）'}
            {detail ? detail : ''}
          </div>
        </CardContent>
      </Card>

      {/* 底部提交 */}
      <div className="sticky bottom-0 -mx-4 px-4 pt-3 bg-white border-t border-gray-100 safe-bottom pb-3">
        <Button className="w-full h-12 text-base" disabled={!canSubmit} onClick={submit}>
          登记并绑定该门店
        </Button>
      </div>
    </div>
  )
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
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
