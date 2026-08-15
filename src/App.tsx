import { useRef, useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { toPng } from 'html-to-image'
import { Camera, Crop, MousePointerClick, Bell } from 'lucide-react'
import { PhoneFrame } from '@/components/PhoneFrame'
import { StatusBar } from '@/components/StatusBar'
import { NavBar } from '@/components/NavBar'
import { PageContainer } from '@/components/PageContainer'
import { TabBar, type TabKey } from '@/components/TabBar'
import { CapsuleButton } from '@/components/CapsuleButton'
import { unreadMessageCount, currentUser, defaultStoreId, getStore } from '@/lib/mock'

import { HomePage } from '@/pages/home'
import { OrdersPage } from '@/pages/orders'
import { MessagePage } from '@/pages/message'
import { MallPage } from '@/pages/mall'
import { MallProductsPage } from '@/pages/mall-products'
import { MinePage } from '@/pages/mine'
import { OrderDetailPage } from '@/pages/order-detail'
import { EvaluatePage } from '@/pages/evaluate'
import { FormPage } from '@/pages/form'
import { StorePage } from '@/pages/store'
import { RegisterStorePage } from '@/pages/register-store'
import { useMallCart } from '@/lib/mallCart'
import type { MallLeafKey } from '@/lib/mock'

/** 可压栈的二级页面（带返回），覆盖当前 Tab 页面 */
type PageId =
  | TabKey
  | 'message'
  | 'order-detail'
  | 'evaluate'
  | 'form'
  | 'store'
  | 'register-store'
  | 'mall-products'

interface StackPage {
  name:
    | 'message'
    | 'order-detail'
    | 'evaluate'
    | 'form'
    | 'store'
    | 'register-store'
    | 'mall-products'
  orderId?: string
  /** 商城分类商品页：命中的最末级分类集合 */
  leafKeys?: MallLeafKey[]
  /** 商城分类商品页：导航栏标题（分类名） */
  title?: string
}

/** 页面顶栏配置（遵循微信小程序导航栏：标题 + 返回 + 右上胶囊） */
const navConfig: Record<PageId, { title: string; showBack: boolean; tabbar: boolean }> = {
  home: { title: '壹咖', showBack: false, tabbar: true },
  mall: { title: '壹咖商城', showBack: false, tabbar: true },
  orders: { title: '我的报修', showBack: false, tabbar: true },
  mine: { title: '我的', showBack: false, tabbar: true },
  message: { title: '消息中心', showBack: true, tabbar: false },
  'order-detail': { title: '工单详情', showBack: true, tabbar: false },
  evaluate: { title: '验收评价', showBack: true, tabbar: false },
  form: { title: '报修申请', showBack: true, tabbar: false },
  store: { title: '绑定门店', showBack: true, tabbar: false },
  'register-store': { title: '登记新店', showBack: true, tabbar: false },
  'mall-products': { title: '分类商品', showBack: true, tabbar: false },
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('home')
  const [stack, setStack] = useState<StackPage[]>([])
  // 当前绑定门店 id —— 真实场景由「登录/绑定」流程写入，这里在原型中用 state 承载
  const [boundStoreId, setBoundStoreId] = useState(defaultStoreId)
  // 商城购物车（商城首页与分类商品页共享）
  const mallCart = useMallCart()

  const push = (page: StackPage) => setStack((s) => [...s, page])
  const pop = () => setStack((s) => s.slice(0, -1))

  /** 绑定门店：更新全局归属并返回上一页 */
  const bindStore = (storeId: string) => {
    setBoundStoreId(storeId)
    setStack((s) => s.slice(0, -1))
  }

  // ===== 整页截图保存为图片（临时展开滚动容器，截取全部内容） =====
  const handleScreenshot = useCallback(async () => {
    const node = document.getElementById('phone-body')
    if (!node) return
    const saved: { el: HTMLElement; height: string; overflow: string; minHeight: string }[] = []
    const expand = (el: HTMLElement | null, minH: string) => {
      if (!el) return
      saved.push({ el, height: el.style.height, overflow: el.style.overflow, minHeight: el.style.minHeight })
      el.style.height = 'auto'
      el.style.minHeight = minH
      el.style.overflow = 'visible'
    }
    expand(node, '844px') // 手机框：最小高度 844px（短页保持手机屏尺寸，长页随内容扩展）
    expand(node.querySelector<HTMLElement>(':scope > div'), '0') // 内屏
    Array.from(node.querySelectorAll<HTMLElement>('.overflow-y-auto')).forEach((el) => expand(el, '0')) // 滚动容器（PageContainer 等）
    try {
      const dataUrl = await toPng(node, { pixelRatio: 2, backgroundColor: '#ffffff', cacheBust: true })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `壹咖截图-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (e) {
      alert('截图失败：' + (e as Error).message)
    } finally {
      saved.forEach(({ el, height, overflow, minHeight }) => {
        el.style.height = height
        el.style.minHeight = minHeight
        el.style.overflow = overflow
      })
    }
  }, [])

  // ===== 局部截图（元素选择器模式） =====
  const [selecting, setSelecting] = useState(false)
  const highlightRef = useRef<HTMLDivElement>(null)
  const capturingRef = useRef(false)

  // 截图目标元素：临时 id + 外围背景与阴影（贴纸效果），截图后恢复
  const captureElement = useCallback(async (el: HTMLElement) => {
    if (capturingRef.current) return
    capturingRef.current = true
    const prevId = el.id
    el.id = 'temp-screenshot-target'
    const saved: { el: HTMLElement; height: string; overflow: string; minHeight: string }[] = []
    const expand = (n: HTMLElement | null, minH: string) => {
      if (!n) return
      saved.push({ el: n, height: n.style.height, overflow: n.style.overflow, minHeight: n.style.minHeight })
      n.style.height = 'auto'
      n.style.minHeight = minH
      n.style.overflow = 'visible'
    }
    // 展开从目标元素到手机框之间所有带裁剪/滚动的祖先（内屏 overflow-hidden、PageContainer overflow-y-auto 等）
    let anc: HTMLElement | null = el
    while (anc && anc !== document.body) {
      const cs = getComputedStyle(anc)
      if (anc.id === 'phone-body') {
        expand(anc, '844px') // 手机框：短元素保持手机屏尺寸，长元素随内容扩展
      } else if (cs.overflowY === 'auto' || cs.overflowY === 'scroll' || cs.overflow === 'hidden' || anc.classList.contains('overflow-y-auto')) {
        expand(anc, '0')
      }
      anc = anc.parentElement
    }
    // 元素自身若是滚动容器，以及内部的滚动容器
    const csEl = getComputedStyle(el)
    if (csEl.overflowY === 'auto' || csEl.overflowY === 'scroll' || el.classList.contains('overflow-y-auto')) expand(el, '0')
    Array.from(el.querySelectorAll<HTMLElement>('.overflow-y-auto')).forEach((n) => expand(n, '0'))

    // 元素临时样式：贴近元素的紧凑阴影；元素本身无背景时补白，让阴影有依托
    const prevBoxShadow = el.style.boxShadow
    const prevElBg = el.style.backgroundColor
    el.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.16), 0 2px 6px rgba(0, 0, 0, 0.08)'
    if (!csEl.backgroundColor || csEl.backgroundColor === 'rgba(0, 0, 0, 0)' || csEl.backgroundColor === 'transparent') {
      el.style.backgroundColor = '#ffffff'
    }

    // 包裹层：透明留白（PNG 背景透明，仅保留元素与阴影），普通块级避免 html-to-image 渲染空白
    const rect = el.getBoundingClientRect()
    const PAD = 16
    const wrapper = document.createElement('div')
    wrapper.style.width = `${rect.width + PAD * 2}px`
    wrapper.style.padding = `${PAD}px`
    wrapper.style.boxSizing = 'border-box'
    const origParent = el.parentNode
    const origNext = el.nextSibling
    document.body.appendChild(wrapper)
    wrapper.appendChild(el)

    try {
      const dataUrl = await toPng(wrapper, { pixelRatio: 2, cacheBust: true }) // 不传 backgroundColor，背景透明
      const a = document.createElement('a')
      a.href = dataUrl
      const name = prevId || el.tagName.toLowerCase()
      a.download = `元素截图-${name}-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (e) {
      alert('截图失败：' + (e as Error).message)
    } finally {
      // 还原 DOM 与样式
      wrapper.remove()
      if (origParent && origNext) origParent.insertBefore(el, origNext)
      else if (origParent) origParent.appendChild(el)
      el.style.boxShadow = prevBoxShadow
      el.style.backgroundColor = prevElBg
      if (prevId) el.id = prevId
      else el.removeAttribute('id')
      saved.forEach(({ el: n, height, overflow, minHeight }) => {
        n.style.height = height
        n.style.minHeight = minHeight
        n.style.overflow = overflow
      })
      capturingRef.current = false
      setSelecting(false)
    }
  }, [])

  // 选择模式：悬停高亮目标元素，点击截图
  useEffect(() => {
    if (!selecting) return
    const isExcluded = (el: HTMLElement | null): boolean => {
      if (!el || el === document.body || el === document.documentElement) return true
      return !!el.closest('[data-float-btn], #screenshot-highlight')
    }
    // 拾取目标：从最深元素向上，吸附到最近的"视觉单元"（有背景/边框/圆角）
    const findPickTarget = (start: HTMLElement): HTMLElement => {
      let n: HTMLElement | null = start
      while (n && n !== document.body && n !== document.documentElement) {
        const cs = getComputedStyle(n)
        const rect = n.getBoundingClientRect()
        const hasBg = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent'
        const hasBorder = parseFloat(cs.borderTopWidth) > 0
        const hasRadius = parseFloat(cs.borderRadius) > 0 && rect.width >= 24 && rect.height >= 20
        if ((hasBg || hasBorder || hasRadius) && rect.width >= 20 && rect.height >= 16) {
          return n
        }
        n = n.parentElement
      }
      return start
    }
    const hideHighlight = () => {
      const hl = highlightRef.current
      if (hl) hl.style.display = 'none'
    }
    const updateHighlight = (el: HTMLElement) => {
      const hl = highlightRef.current
      if (!hl) return
      const rect = el.getBoundingClientRect()
      hl.style.display = 'block'
      hl.style.left = `${rect.left}px`
      hl.style.top = `${rect.top}px`
      hl.style.width = `${rect.width}px`
      hl.style.height = `${rect.height}px`
    }
    const onMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (isExcluded(target)) { hideHighlight(); return }
      updateHighlight(findPickTarget(target))
    }
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (isExcluded(target) || capturingRef.current) return
      e.preventDefault()
      e.stopPropagation()
      void captureElement(findPickTarget(target))
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelecting(false)
    }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('click', onClick, true)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('keydown', onKeyDown)
      hideHighlight()
    }
  }, [selecting, captureElement])

  // 选择模式下光标十字准星、禁止选中文本
  useEffect(() => {
    const prevCursor = document.body.style.cursor
    const prevUserSelect = document.body.style.userSelect
    if (selecting) {
      document.body.style.cursor = 'crosshair'
      document.body.style.userSelect = 'none'
    }
    return () => {
      document.body.style.cursor = prevCursor
      document.body.style.userSelect = prevUserSelect
    }
  }, [selecting])

  const current = stack[stack.length - 1]
  const pageId: PageId = current ? current.name : activeTab
  const config = navConfig[pageId]
  const storeLabel = getStore(boundStoreId).name
  // 首页顶栏标题展示当前绑定门店（作为一个店铺切换位）；分类商品页标题取分类名
  const navTitle = pageId === 'home' ? storeLabel : current?.title ?? config.title
  const badge = unreadMessageCount

  let content: ReactNode
  if (current) {
    if (current.name === 'mall-products') {
      content = (
        <MallProductsPage
          leafKeys={current.leafKeys ?? []}
          cart={mallCart.cart}
          add={mallCart.add}
          remove={mallCart.remove}
          onViewCart={() => alert('购物车管理功能建设中，敬请期待。')}
        />
      )
    } else if (current.name === 'message') {
      content = (
        <MessagePage onDetail={(id) => push({ name: 'order-detail', orderId: id })} />
      )
    } else if (current.name === 'form') {
      content = <FormPage boundStoreId={boundStoreId} />
    } else if (current.name === 'store') {
      content = (
        <StorePage
          boundStoreId={boundStoreId}
          onBind={bindStore}
          onRegister={() => push({ name: 'register-store' })}
        />
      )
    } else if (current.name === 'register-store') {
      content = <RegisterStorePage onRegistered={bindStore} />
    } else if (current.name === 'order-detail') {
      content = (
        <OrderDetailPage
          orderId={current.orderId ?? ''}
          onEvaluate={(id) => push({ name: 'evaluate', orderId: id })}
        />
      )
    } else {
      content = (
        <EvaluatePage
          orderId={current.orderId ?? ''}
          onDetail={(id) => push({ name: 'order-detail', orderId: id })}
        />
      )
    }
  } else {
    switch (activeTab) {
      case 'mall':
        content = (
          <MallPage
            cart={mallCart.cart}
            onOpenCategory={(leafKeys, title) => push({ name: 'mall-products', leafKeys, title })}
            onViewCart={() => alert('购物车管理功能建设中，敬请期待。')}
          />
        )
        break
      case 'orders':
        content = <OrdersPage onDetail={(id) => push({ name: 'order-detail', orderId: id })} />
        break
      case 'mine':
        content = (
          <MinePage
            boundStoreId={boundStoreId}
            onNavigate={(tab) => setActiveTab(tab)}
            onBindStore={() => push({ name: 'store' })}
          />
        )
        break
      case 'home':
      default:
        content = (
          <HomePage
            onNavigate={(tab) => setActiveTab(tab)}
            onForm={() => push({ name: 'form' })}
            onDetail={(id) => push({ name: 'order-detail', orderId: id })}
            onBindStore={() => push({ name: 'store' })}
          />
        )
        break
    }
  }

  return (
    <div className="flex h-screen bg-gray-200 overflow-hidden">
      <PhoneFrame>
        <StatusBar />
        {/* 统一导航栏：标题 + 返回 + 右上角小程序胶囊（遵循微信小程序样式） */}
        <NavBar
          title={navTitle}
          showBack={config.showBack}
          onBack={pop}
          leftElement={
            pageId === 'home' ? (
              <button
                onClick={() => push({ name: 'message' })}
                className="relative flex items-center justify-center"
                aria-label="消息"
              >
                <Bell size={20} className="text-gray-600" />
                {badge > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[15px] h-3.5 px-1 rounded-full bg-red-500 text-white text-[8px] font-semibold flex items-center justify-center">
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </button>
            ) : undefined
          }
          rightElement={<CapsuleButton />}
        />
        <PageContainer>{content}</PageContainer>
        {config.tabbar && (
          <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        )}
      </PhoneFrame>

      {/* 局部截图元素选择高亮框 */}
      {selecting && (
        <div
          ref={highlightRef}
          id="screenshot-highlight"
          className="fixed z-[60] pointer-events-none rounded-sm border-2 border-brand-500 bg-brand-500/10"
          style={{ display: 'none' }}
        />
      )}

      {/* 选择模式提示条 */}
      {selecting && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-2 bg-gray-900/90 text-white text-sm pl-3 pr-3.5 py-2 rounded-lg shadow-lg">
          <MousePointerClick className="w-4 h-4 text-brand-300" />
          点击页面中的元素进行局部截图，按 Esc 取消
        </div>
      )}

      {/* 悬浮按钮（右下角） */}
      <div className="fixed bottom-6 right-6 z-[80] flex flex-col gap-2">
        <button
          data-float-btn
          onClick={handleScreenshot}
          className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          <Camera className="w-4 h-4 text-gray-500" />
          截图保存
        </button>
        <button
          data-float-btn
          onClick={() => setSelecting((s) => !s)}
          className={`
            flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg shadow-md transition-colors
            ${selecting
              ? 'bg-brand-500 text-white border border-brand-500 hover:bg-brand-600'
              : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 active:bg-gray-100'
            }
          `}
        >
          <Crop className={`w-4 h-4 ${selecting ? 'text-white' : 'text-gray-500'}`} />
          局部截图
        </button>
      </div>
    </div>
  )
}
