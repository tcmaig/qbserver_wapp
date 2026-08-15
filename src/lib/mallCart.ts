import { useCallback, useMemo, useState } from 'react'
import { mallProducts } from '@/lib/mock'

/**
 * 商城购物车：商品 id → 数量。
 * 在「商城首页」与「分类商品页」之间共享，由 App 层持有并下发给两个页面。
 */
export type MallCart = Record<string, number>

export interface MallCartModel {
  cart: MallCart
  /** 购物车中商品总数（所有条目数量之和） */
  count: number
  /** 购物车合计金额（元） */
  total: number
  /** 指定商品数量 */
  add: (id: string) => void
  remove: (id: string) => void
}

/** 计算购物车合计金额（元，小数两位） */
export function cartTotal(cart: MallCart): number {
  return Object.entries(cart).reduce((sum, [id, n]) => {
    const p = mallProducts.find((x) => x.id === id)
    return sum + (p ? p.price * n : 0)
  }, 0)
}

/** 购物车商品总数 */
export function cartCount(cart: MallCart): number {
  return Object.values(cart).reduce((sum, n) => sum + n, 0)
}

/** 商城购物车状态模型 */
export function useMallCart(): MallCartModel {
  const [cart, setCart] = useState<MallCart>({})

  const add = useCallback((id: string) => {
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }))
  }, [])

  const remove = useCallback((id: string) => {
    setCart((c) => {
      const next = { ...c }
      const n = (next[id] ?? 0) - 1
      if (n <= 0) delete next[id]
      else next[id] = n
      return next
    })
  }, [])

  const count = useMemo(() => cartCount(cart), [cart])
  const total = useMemo(() => cartTotal(cart), [cart])

  return { cart, count, total, add, remove }
}
