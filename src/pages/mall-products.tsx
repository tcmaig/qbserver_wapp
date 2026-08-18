import { useMemo, useState } from 'react'
import { Search, ShoppingCart, Plus, Minus } from 'lucide-react'
import { mallProducts, MallLeafKey, getLeafLabel } from '@/lib/mock'
import { MallCart, cartCount } from '@/lib/mallCart'
import { Card, CardContent } from '@/components/ui/card'

interface MallProductsPageProps {
  /** 该页面展示的一批最末级分类 key（子分类整类或单个子子分类） */
  leafKeys: MallLeafKey[]
  cart: MallCart
  add: (id: string) => void
  remove: (id: string) => void
  onViewCart: () => void
}

/** 分类商品页：搜索 + 商品栅格 + 底部购物车栏（从商城分类进入，压栈可返回） */
export function MallProductsPage({ leafKeys, cart, add, remove, onViewCart }: MallProductsPageProps) {
  const [keyword, setKeyword] = useState('')

  const list = useMemo(
    () =>
      mallProducts.filter((p) => {
        if (!leafKeys.includes(p.leaf)) return false
        if (keyword && !p.name.includes(keyword) && !p.spec.includes(keyword)) return false
        return true
      }),
    [leafKeys, keyword],
  )

  const quantity = cartCount(cart)
  const total = Object.entries(cart).reduce((sum, [id, n]) => {
    const p = mallProducts.find((x) => x.id === id)
    return sum + (p ? p.price * n : 0)
  }, 0)

  return (
    <div className="pb-2 space-y-3">
      {/* 分类标签 + 搜索 */}
      <div className="flex items-center gap-2 px-3 h-10 rounded-xl bg-white border border-gray-100 shadow-sm">
        <Search size={16} className="text-gray-400 shrink-0" />
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={`搜索${leafKeys.map(getLeafLabel).join('/')}`}
          className="flex-1 min-w-0 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
        />
        {keyword && (
          <button onClick={() => setKeyword('')} className="text-xs text-gray-400 shrink-0">
            清除
          </button>
        )}
      </div>

      {/* 商品栅格（2 列） */}
      <div className="grid grid-cols-2 gap-3">
        {list.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            count={cart[p.id] ?? 0}
            onAdd={() => add(p.id)}
            onRemove={() => remove(p.id)}
          />
        ))}
      </div>

      {list.length === 0 && (
        <div className="text-center text-gray-400 text-sm py-16">该分类暂无商品，换个搜索试试</div>
      )}

      {/* 底部购物车栏（有商品时展示） */}
      {quantity > 0 && (
        <div className="sticky bottom-0 -mx-4 px-4">
          <div className="flex items-center gap-3 bg-gray-900 text-white rounded-2xl px-4 py-3 shadow-lg">
            <button onClick={onViewCart} className="relative flex items-center gap-2">
              <ShoppingCart size={22} className="text-white" />
              {quantity > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-medium flex items-center justify-center">
                  {quantity > 99 ? '99+' : quantity}
                </span>
              )}
            </button>
            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-semibold leading-none">¥{total.toFixed(2)}</div>
              <div className="text-[10px] text-gray-400 mt-1">共 {quantity} 件 · 支持到店自提</div>
            </div>
            <button
              onClick={() => alert('下单成功，门店采购专员将尽快为您安排备货配送。')}
              className="shrink-0 h-9 px-5 rounded-full bg-brand-500 text-white text-sm font-semibold active:bg-brand-600"
            >
              去结算
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function ProductCard({
  product: p,
  count,
  onAdd,
  onRemove,
}: {
  product: (typeof mallProducts)[number]
  count: number
  onAdd: () => void
  onRemove: () => void
}) {
  // 折扣：支付原价的比例，折算为「X 折」（28/35=0.8 → 8 折）
  const off = p.originalPrice ? Math.round((p.price / p.originalPrice) * 10) : 0
  return (
    <Card className="overflow-hidden">
      {/* 商品图（占位 lucide 图标块） */}
      <div className={`relative h-28 flex items-center justify-center ${p.bg}`}>
        <p.Icon size={52} strokeWidth={1.2} className="text-gray-600/60" />
        {off > 0 && off < 10 && (
          <span className="absolute top-2 left-0 h-5 px-2 rounded-r-full bg-red-500 text-white text-[10px] font-semibold flex items-center">
            {off} 折
          </span>
        )}
        {!p.inStock && (
          <span className="absolute inset-0 bg-white/60 flex items-center justify-center text-xs font-semibold text-gray-500">
            补货中
          </span>
        )}
      </div>

      <CardContent className="p-3 pt-2.5">
        <div className="text-[13px] font-medium text-gray-900 leading-snug line-clamp-2 min-h-[36px]">
          {p.name}
        </div>
        <div className="text-[11px] text-gray-400 mt-0.5">
          {p.spec} · 已售 {p.sold}
        </div>

        {/* 价格与按钮同一行：价格可收缩，按钮固定尺寸不挤压 */}
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5 min-w-0">
            <span className="text-[16px] font-bold text-brand-600">¥{p.price.toFixed(2)}</span>
            {p.originalPrice && (
              <span className="text-[11px] text-gray-400 line-through">¥{p.originalPrice}</span>
            )}
          </div>

          {count > 0 ? (
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={onRemove}
                className="h-7 w-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center active:bg-gray-200"
                aria-label="减少"
              >
                <Minus size={13} />
              </button>
              <span className="text-sm font-semibold text-gray-900 min-w-[18px] text-center">{count}</span>
              <button
                onClick={onAdd}
                className="h-7 w-7 rounded-full bg-brand-500 text-white flex items-center justify-center active:bg-brand-600"
                aria-label="增加"
              >
                <Plus size={13} />
              </button>
            </div>
          ) : (
            <button
              onClick={onAdd}
              disabled={!p.inStock}
              className="shrink-0 h-7 w-8 rounded-full bg-brand-500 text-white flex items-center justify-center active:bg-brand-600 disabled:opacity-50"
              aria-label="加入购物车"
            >
              <Plus size={15} />
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
