import { Check, MapPin, Plus, Phone, Search } from 'lucide-react'
import { stores } from '@/lib/mock'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface StorePageProps {
  /** 当前已绑定门店 id */
  boundStoreId: string
  /** 绑定某家门店后回调（由 App 更新绑定状态） */
  onBind: (storeId: string) => void
  /** 跳转「登记新店」 */
  onRegister: () => void
}

/**
 * 绑定门店页（对应 PRD「店铺账号绑定/门店列表」）。
 * 门店员工在此选择自己所属的门店进行绑定；绑定后全局的门店归属随之更新，
 * 新提交的报修工单自动挂在所绑门店下。找不到门店时可登记新店。
 */
export function StorePage({ boundStoreId, onBind, onRegister }: StorePageProps) {
  return (
    <div className="pb-2 space-y-3">
      {/* 顶部说明 */}
      <Card>
        <CardContent className="p-4">
          <div className="text-[13px] font-medium text-gray-900">选择你的门店</div>
          <div className="mt-1 text-xs text-gray-500">
            绑定后，报修工单将自动归属于该门店，便于派单与跟踪。
          </div>
        </CardContent>
      </Card>

      {/* 门店列表 */}
      <Card>
        <CardContent className="p-1 py-1.5">
          {stores.map((s, i) => {
            const bound = s.id === boundStoreId
            return (
              <button
                key={s.id}
                onClick={() => onBind(s.id)}
                className={`w-full flex items-start gap-3 px-4 py-3.5 text-left active:bg-gray-50 ${
                  i !== 0 ? 'border-t border-gray-50' : ''
                }`}
              >
                <span
                  className={`mt-0.5 h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                    bound ? 'bg-brand-50 text-brand-500' : 'bg-gray-50 text-gray-400'
                  }`}
                >
                  <MapPin size={18} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 truncate">{s.name}</span>
                    {bound && (
                      <span className="px-1.5 py-0.5 rounded-full bg-brand-50 text-brand-600 text-[10px] font-medium flex items-center gap-0.5">
                        <Check size={11} /> 当前绑定
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-xs text-gray-500 truncate">{s.address}</div>
                  <div className="mt-1 flex items-center gap-3 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Search size={11} /> {s.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone size={11} /> {s.phone}
                    </span>
                  </div>
                </div>
                {bound ? (
                  <span className="mt-1 h-5 w-5 rounded-full bg-brand-500 text-white flex items-center justify-center shrink-0">
                    <Check size={13} />
                  </span>
                ) : (
                  <span className="mt-1 text-[12px] text-brand-500 shrink-0">绑定</span>
                )}
              </button>
            )
          })}
        </CardContent>
      </Card>

      {/* 找不到门店 → 登记新店 */}
      <button
        onClick={onRegister}
        className="w-full flex items-center gap-3 rounded-2xl border border-dashed border-brand-300 bg-brand-50/50 px-4 py-3.5 active:bg-brand-50"
      >
        <span className="h-9 w-9 rounded-lg bg-brand-500 text-white flex items-center justify-center">
          <Plus size={18} />
        </span>
        <span className="flex-1 text-left">
          <span className="block text-sm font-medium text-brand-600">找不到你的门店？</span>
          <span className="block text-[11px] text-gray-400 mt-0.5">选择地址并登记新店，登记后即可绑定</span>
        </span>
      </button>

      <div className="px-1 pt-2 text-[11px] text-gray-400 leading-relaxed">
        已登记门店会作为「当前绑定」生效；若需新增/下线门店，由管理端统一维护。
      </div>

      <div className="sticky bottom-0 -mx-4 px-4 pt-3 bg-white border-t border-gray-100 safe-bottom pb-3">
        <Button className="w-full h-12 text-base" variant="outline" onClick={() => onBind(boundStoreId)}>
          确认当前门店
        </Button>
      </div>
    </div>
  )
}
