import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import {
  MALL_CATEGORIES,
  MallSubCategory,
  MallLeafKey,
  getAllLeaves,
} from '@/lib/mock'
import { MallCart, cartCount } from '@/lib/mallCart'

interface MallPageProps {
  cart: MallCart
  onOpenCategory: (leafKeys: MallLeafKey[], title: string) => void
  onViewCart: () => void
}

/** 商城顶部横幅 */
const MALL_BANNER = {
  title: '门店采购 · 次日达',
  subtitle: '配件、耗材、照明一站购齐，报修常用件低至 5 折',
  gradient: 'from-emerald-500 to-emerald-600',
}

/** 商城 Tab：左侧主分类 + 右侧子分类/子子分类（双栏），商品在分类商品页展示 */
export function MallPage({ cart, onOpenCategory, onViewCart }: MallPageProps) {
  const [mainKey, setMainKey] = useState(MALL_CATEGORIES[0].key)
  const main = MALL_CATEGORIES.find((c) => c.key === mainKey) ?? MALL_CATEGORIES[0]
  const quantity = cartCount(cart)

  return (
    <div className="pb-2 space-y-3">
      {/* 商城横幅 */}
      <div className={`bg-gradient-to-r ${MALL_BANNER.gradient} rounded-2xl px-5 py-4 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[17px] font-bold">{MALL_BANNER.title}</div>
            <div className="text-white/80 text-[11px] mt-1">{MALL_BANNER.subtitle}</div>
          </div>
          <button
            onClick={onViewCart}
            className="relative shrink-0 h-9 w-9 rounded-full bg-white/20 flex items-center justify-center"
            aria-label="购物车"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            {quantity > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-medium flex items-center justify-center">
                {quantity > 99 ? '99+' : quantity}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 双栏分类：左侧主分类（sticky）+ 右侧子分类/子子分类 */}
      <div className="flex items-start -mx-4 px-4">
        {/* 左侧主分类（滚动到顶部时吸附） */}
        <nav className="sticky top-2 w-[92px] shrink-0 bg-white overflow-hidden shadow-sm">
          {MALL_CATEGORIES.map((c) => {
            const active = c.key === main.key
            const Icon = c.Icon
            return (
              <button
                key={c.key}
                onClick={() => setMainKey(c.key)}
                className={`w-full flex flex-col items-center gap-1.5 py-3 text-[12px] transition-colors ${
                  active ? 'bg-brand-50 text-brand-600 font-semibold' : 'text-gray-500'
                }`}
              >
                <Icon size={20} strokeWidth={1.8} />
                <span>{c.label}</span>
              </button>
            )
          })}
        </nav>

        {/* 右侧：子分类 + 子子分类 */}
        <div className="flex-1 min-w-0 pl-3">
          {main.subs.map((sub) => (
            <SubSection
              key={sub.key}
              sub={sub}
              onOpenLeaf={(leafKeys, title) => onOpenCategory(leafKeys, title)}
            />
          ))}
          {main.subs.length === 0 && (
            <div className="text-center text-gray-400 text-sm py-20">该分类暂未上架商品</div>
          )}
        </div>
      </div>
    </div>
  )
}

function SubSection({
  sub,
  onOpenLeaf,
}: {
  sub: MallSubCategory
  onOpenLeaf: (leafKeys: MallLeafKey[], title: string) => void
}) {
  // 点击子分类「整类查看」= 该子分类下所有子子分类
  const subAllLeaves = getAllLeaves(sub)
  return (
    <section className="mb-2.5">
      <button
        onClick={() => onOpenLeaf(subAllLeaves, sub.label)}
        className="w-full flex items-center gap-1 text-[14px] font-semibold text-gray-800 py-1.5 text-left"
      >
        {sub.label}
        <ChevronRight size={15} className="text-gray-400" />
      </button>

      {/* 子子分类导航（直角列表）：每项带缩略图占位 */}
      <div className="mt-1 bg-white border border-gray-100 divide-y divide-gray-100">
        {sub.leaves.map((leaf) => {
          const LeafIcon = leaf.Icon
          return (
            <button
              key={leaf.key}
              onClick={() => onOpenLeaf([leaf.key], leaf.label)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left active:bg-gray-50"
            >
              {/* 缩略图占位（真实场景替换为商品分类图片） */}
              <span className={`shrink-0 h-11 w-11 rounded-none flex items-center justify-center ${leaf.bg}`}>
                <LeafIcon size={22} strokeWidth={1.6} className="text-gray-600" />
              </span>
              <span className="flex-1 text-[13px] text-gray-700">{leaf.label}</span>
              <ChevronRight size={15} className="text-gray-300 shrink-0" />
            </button>
          )
        })}
        {sub.leaves.length > 1 && (
          <button
            onClick={() => onOpenLeaf(subAllLeaves, sub.label)}
            className="w-full flex items-center gap-1 px-3 text-[11px] text-brand-500 font-medium py-2.5 active:bg-gray-50"
          >
            全部 {sub.label} <ChevronRight size={11} />
          </button>
        )}
      </div>
    </section>
  )
}
