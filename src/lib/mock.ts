/**
 * 壹咖小程序原型 — 模拟数据契约
 *
 * 所有页面组件统一从此文件读取数据与状态配置，保证各页面数据一致。
 * 注意：样式类名均为静态字符串（Tailwind JIT 依赖静态类名），
 * 不要在代码中动态拼接（如 `text-${color}`）。
 */

import {
  Snowflake,
  SprayCan,
  Lightbulb,
  Droplets,
  Wrench,
  Cpu,
  Filter,
  Radar,
  RollerCoaster,
  Pipette,
  Zap,
  Sparkles,
  Sun,
  Package,
  CircleDot,
  type LucideIcon,
} from 'lucide-react'

/* ═══════════════ 紧急程度 ═══════════════ */

export type Urgency = 1 | 2 | 3 | 4

export interface UrgencyConfig {
  label: string
  /** 标签配色（静态类名） */
  badge: string
  /** 圆点颜色 */
  dot: string
  /** 文字颜色 */
  text: string
}

export const URGENCY_CONFIG: Record<Urgency, UrgencyConfig> = {
  1: { label: '普通', badge: 'bg-green-50 text-green-700', dot: 'bg-green-500', text: 'text-green-600' },
  2: { label: '一般', badge: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500', text: 'text-amber-600' },
  3: { label: '紧急', badge: 'bg-orange-50 text-orange-700', dot: 'bg-orange-500', text: 'text-orange-600' },
  4: { label: '加急', badge: 'bg-red-50 text-red-700', dot: 'bg-red-500', text: 'text-red-600' },
}

/* ═══════════════ 工单状态（PRD §3.2 简化状态集） ═══════════════ */

export type OrderStatus = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

export interface StatusConfig {
  label: string
  /** 标签配色 */
  badge: string
  /** 圆点颜色 */
  dot: string
  /** 进度条颜色 */
  bar: string
  /** 大状态文字颜色 */
  text: string
}

export const STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  0: { label: '待审核', badge: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500', bar: 'bg-amber-500', text: 'text-amber-600' },
  1: { label: '已派单', badge: 'bg-blue-50 text-blue-700', dot: 'bg-blue-500', bar: 'bg-blue-500', text: 'text-blue-600' },
  2: { label: '已接单', badge: 'bg-blue-50 text-blue-700', dot: 'bg-blue-500', bar: 'bg-blue-500', text: 'text-blue-600' },
  3: { label: '维修中', badge: 'bg-orange-50 text-orange-700', dot: 'bg-orange-500', bar: 'bg-orange-500', text: 'text-orange-600' },
  4: { label: '待验收', badge: 'bg-purple-50 text-purple-700', dot: 'bg-purple-500', bar: 'bg-purple-500', text: 'text-purple-600' },
  5: { label: '已完成', badge: 'bg-green-50 text-green-700', dot: 'bg-green-500', bar: 'bg-green-500', text: 'text-green-600' },
  6: { label: '已驳回', badge: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400', bar: 'bg-gray-400', text: 'text-gray-500' },
  7: { label: '已关闭', badge: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400', bar: 'bg-gray-400', text: 'text-gray-500' },
}

/** 状态 → 进度百分比（用于列表/详情进度条） */
export function progressPercent(status: OrderStatus): number {
  switch (status) {
    case 0: return 10
    case 1: return 25
    case 2: return 40
    case 3: return 60
    case 4: return 80
    case 5: return 100
    default: return 100
  }
}

/** 报修类型 key → 页面自行映射为 lucide 图标（无匹配时回退 Wrench） */
export type RepairTypeKey = 'ac' | 'water' | 'power' | 'door' | 'elevator' | 'lamp' | 'network' | 'other' | 'construction'

export interface RepairType {
  key: RepairTypeKey
  label: string
}

/** 报修类型（表单动态加载，PRD §3.1.3） */
export const REPAIR_TYPES: RepairType[] = [
  { key: 'ac', label: '空调故障' },
  { key: 'water', label: '水管漏水' },
  { key: 'power', label: '电路故障' },
  { key: 'door', label: '门窗损坏' },
  { key: 'elevator', label: '电梯故障' },
  { key: 'lamp', label: '灯具照明' },
  { key: 'network', label: '网络故障' },
  { key: 'other', label: '其他' },
  { key: 'construction', label: '施工工程' },
]

/** 施工类型 key（选中后表单进入「施工」专属文案与字段） */
export const CONSTRUCTION_KEY = 'construction'

/* ═══════════════ 工单 ═══════════════ */

export interface TimelineNode {
  label: string
  time?: string
  operator?: string
  done: boolean
}

export interface RepairSummary {
  cause: string
  method: string
  parts: string
  duration: string
  cost: string
  /** 维修后照片张数（原型用占位图块） */
  afterImages: number
}

export interface WorkOrder {
  id: string
  title: string
  typeKey: RepairTypeKey
  typeLabel: string
  /** 所属门店 id（业务上这笔工单挂在哪家店） */
  storeId: string
  location: string
  urgency: Urgency
  status: OrderStatus
  createdAt: string
  description: string
  contactName: string
  contactPhone: string
  /** 故障照片张数（原型用占位图块） */
  images: number
  technician?: { name: string; phone: string }
  timeline: TimelineNode[]
  repairSummary?: RepairSummary
}

/** 时间轴阶段（用于生成 timeline） */
const STAGES = ['已提交', '已审核', '已派单', '已接单', '维修中', '待验收', '已完成']

/** 根据状态与提交时间生成时间轴节点（已完成节点带时间与操作人） */
function buildTimeline(status: OrderStatus, createdAt: string, technician?: string): TimelineNode[] {
  const doneCount = status === 5 ? 7 : status === 6 || status === 7 ? 2 : status + 1
  const base = new Date(createdAt.replace(' ', 'T')).getTime()
  const hour = 3600_000
  const nodes: TimelineNode[] = []
  for (let i = 0; i < 7; i++) {
    const done = i < doneCount
    if (done) {
      const d = new Date(base + (i === 0 ? 0 : i * 40 * 60_000))
      const pad = (n: number) => String(n).padStart(2, '0')
      nodes.push({
        label: STAGES[i],
        time: `${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`,
        operator:
          i === 1 ? '王管理' :
          i === 2 || i === 3 ? technician :
          i === 4 ? technician : undefined,
        done,
      })
    } else {
      nodes.push({ label: STAGES[i], done: false })
    }
  }
  return nodes
}

export const workOrders: WorkOrder[] = [
  {
    id: 'WO20260814003',
    title: '3楼空调不制冷',
    typeKey: 'ac',
    typeLabel: '空调故障',
    storeId: 'ST001',
    location: 'A栋 3楼 301',
    urgency: 3,
    status: 4,
    createdAt: '2026-08-14 09:20',
    description: '办公室空调开机后不出冷风，出风口有异响，温度一直降不下来，已影响正常办公。',
    contactName: '张三',
    contactPhone: '138****8888',
    images: 2,
    technician: { name: '李师傅', phone: '139****6688' },
    timeline: buildTimeline(4, '2026-08-14 09:20', '李师傅'),
    repairSummary: {
      cause: '压缩机启动电容损坏',
      method: '更换启动电容并补充制冷剂',
      parts: '启动电容 ×1、制冷剂 500g',
      duration: '2.5 小时',
      cost: '¥580.00',
      afterImages: 2,
    },
  },
  {
    id: 'WO20260814001',
    title: '洗手间水龙头漏水',
    typeKey: 'water',
    typeLabel: '水管漏水',
    storeId: 'ST001',
    location: 'B栋 2楼 205',
    urgency: 2,
    status: 3,
    createdAt: '2026-08-14 08:05',
    description: '洗手间第三个水龙头关闭后仍持续滴水，地面已有积水，需要尽快处理。',
    contactName: '张三',
    contactPhone: '138****8888',
    images: 1,
    technician: { name: '王师傅', phone: '137****5521' },
    timeline: buildTimeline(3, '2026-08-14 08:05', '王师傅'),
  },
  {
    id: 'WO20260813006',
    title: '前台电路跳闸',
    typeKey: 'power',
    typeLabel: '电路故障',
    storeId: 'ST001',
    location: 'C栋 1楼 前台',
    urgency: 4,
    status: 1,
    createdAt: '2026-08-13 17:40',
    description: '前台区域频繁跳闸，收银设备无法正常使用，怀疑线路老化短路。',
    contactName: '李四',
    contactPhone: '136****3321',
    images: 0,
    timeline: buildTimeline(1, '2026-08-13 17:40'),
  },
  {
    id: 'WO20260812002',
    title: '仓库门锁损坏',
    typeKey: 'door',
    typeLabel: '门窗损坏',
    storeId: 'ST001',
    location: 'D栋 仓库 101',
    urgency: 2,
    status: 2,
    createdAt: '2026-08-12 14:15',
    description: '仓库大门门锁卡死，钥匙无法转动，需要更换锁芯。',
    contactName: '王五',
    contactPhone: '135****9908',
    images: 1,
    technician: { name: '刘师傅', phone: '133****4477' },
    timeline: buildTimeline(2, '2026-08-12 14:15', '刘师傅'),
  },
  {
    id: 'WO20260810005',
    title: '走廊灯闪烁',
    typeKey: 'lamp',
    typeLabel: '灯具照明',
    storeId: 'ST001',
    location: 'A栋 2楼 走廊',
    urgency: 1,
    status: 0,
    createdAt: '2026-08-10 10:00',
    description: '走廊两盏灯管闪烁不停，夜间照明不稳定，存在安全隐患。',
    contactName: '赵六',
    contactPhone: '134****1122',
    images: 0,
    timeline: buildTimeline(0, '2026-08-10 10:00'),
  },
  {
    id: 'WO20260809007',
    title: '电梯运行异响',
    typeKey: 'elevator',
    typeLabel: '电梯故障',
    storeId: 'ST001',
    location: 'B栋 1楼 电梯厅',
    urgency: 3,
    status: 5,
    createdAt: '2026-08-09 09:30',
    description: '电梯运行时发出刺耳异响，担心存在安全隐患，请求全面检查。',
    contactName: '张三',
    contactPhone: '138****8888',
    images: 1,
    technician: { name: '李师傅', phone: '139****6688' },
    timeline: buildTimeline(5, '2026-08-09 09:30', '李师傅'),
    repairSummary: {
      cause: '电梯导轨润滑油干涸',
      method: '导轨清洁并重新润滑，紧固轿厢螺栓',
      parts: '导轨润滑油 ×2',
      duration: '3 小时',
      cost: '¥320.00',
      afterImages: 1,
    },
  },
  {
    id: 'WO20260808004',
    title: '办公区网络中断',
    typeKey: 'network',
    typeLabel: '网络故障',
    storeId: 'ST001',
    location: 'C栋 5楼 办公区',
    urgency: 4,
    status: 5,
    createdAt: '2026-08-08 11:20',
    description: '整个办公区无线网络中断，交换机疑似故障，影响线上会议。',
    contactName: '李四',
    contactPhone: '136****3321',
    images: 2,
    technician: { name: '周师傅', phone: '131****8845' },
    timeline: buildTimeline(5, '2026-08-08 11:20', '周师傅'),
    repairSummary: {
      cause: '核心交换机端口烧毁',
      method: '更换交换机并重新配置 VLAN',
      parts: '千兆交换机 ×1、网线 ×6',
      duration: '4 小时',
      cost: '¥1,280.00',
      afterImages: 2,
    },
  },
  {
    id: 'WO20260805002',
    title: '空调滤网清洗申请',
    typeKey: 'ac',
    typeLabel: '空调故障',
    storeId: 'ST001',
    location: 'D栋 2楼 会议室',
    urgency: 1,
    status: 6,
    createdAt: '2026-08-05 15:00',
    description: '会议室空调制冷效果差，申请清洗滤网。',
    contactName: '王五',
    contactPhone: '135****9908',
    images: 0,
    timeline: buildTimeline(6, '2026-08-05 15:00'),
  },
  {
    id: 'WO20260803001',
    title: '卫生间排风扇故障',
    typeKey: 'other',
    typeLabel: '其他',
    storeId: 'ST001',
    location: 'B栋 3楼 卫生间',
    urgency: 2,
    status: 7,
    createdAt: '2026-08-03 16:45',
    description: '排风扇无法启动，卫生间异味无法排出。',
    contactName: '赵六',
    contactPhone: '134****1122',
    images: 1,
    timeline: buildTimeline(7, '2026-08-03 16:45'),
  },
]

/** 各状态工单数量（首页"我的工单"卡片与列表 Tab 角标使用） */
export function countOrdersByStatus(status: OrderStatus | 'all'): number {
  if (status === 'all') return workOrders.length
  return workOrders.filter((o) => o.status === status).length
}

/* ═══════════════ 消息（PRD §3.1.7） ═══════════════ */

export interface MessageItem {
  id: string
  title: string
  content: string
  time: string
  unread: boolean
  orderId: string
  type: 'audit' | 'assign' | 'accept' | 'repairing' | 'finish' | 'reject'
}

export const messages: MessageItem[] = [
  {
    id: 'MSG001',
    title: '维修完成提醒',
    content: '您的工单 WO20260814003 已完成维修，请及时验收评价。',
    time: '10:30',
    unread: true,
    orderId: 'WO20260814003',
    type: 'finish',
  },
  {
    id: 'MSG002',
    title: '工单已派单',
    content: '李师傅已接单，预计 30 分钟内到达。',
    time: '昨天 14:00',
    unread: true,
    orderId: 'WO20260812002',
    type: 'assign',
  },
  {
    id: 'MSG003',
    title: '工单审核通过',
    content: '您的报修已审核通过，正在派单中...',
    time: '昨天 11:00',
    unread: false,
    orderId: 'WO20260813006',
    type: 'audit',
  },
  {
    id: 'MSG004',
    title: '维修进行中',
    content: '王师傅已开始维修您的工单 WO20260814001。',
    time: '08-14 09:10',
    unread: false,
    orderId: 'WO20260814001',
    type: 'repairing',
  },
  {
    id: 'MSG005',
    title: '报修已驳回',
    content: '您的工单 WO20260805002 未通过审核：请补充故障照片后重新提交。',
    time: '08-06 09:30',
    unread: false,
    orderId: 'WO20260805002',
    type: 'reject',
  },
]

/** 未读消息数 */
export const unreadMessageCount = messages.filter((m) => m.unread).length

/* ═══════════════ 设备（PRD 设备管理） ═══════════════ */

export interface Device {
  id: string
  name: string
  code: string
  category: string
  location: string
  status: '正常' | '维修中' | '停用'
  lastCheck: string
  owner: string
}

export const devices: Device[] = [
  { id: 'DEV001', name: '中央空调 1 号机', code: 'AC-001', category: '空调设备', location: 'A栋 楼顶机房', status: '正常', lastCheck: '2026-08-01', owner: '李师傅' },
  { id: 'DEV002', name: '货梯 A', code: 'ELV-A', category: '电梯设备', location: 'B栋 1楼', status: '正常', lastCheck: '2026-07-28', owner: '刘师傅' },
  { id: 'DEV003', name: '配电柜 3 号', code: 'PWR-003', category: '电力设备', location: 'C栋 地下 1层', status: '维修中', lastCheck: '2026-08-10', owner: '周师傅' },
  { id: 'DEV004', name: '感应门禁（东门）', code: 'ACC-东', category: '门禁设备', location: 'A栋 1楼 东门', status: '正常', lastCheck: '2026-07-20', owner: '王师傅' },
  { id: 'DEV005', name: '监控硬盘录像机', code: 'CCTV-01', category: '安防设备', location: '监控室', status: '停用', lastCheck: '2026-06-30', owner: '周师傅' },
]

/* ═══════════════ 门店（PRD 门店管理） ═══════════════ */

export interface Store {
  id: string
  name: string
  address: string
  distance: string
  bound: boolean
  phone: string
}

export const stores: Store[] = [
  { id: 'ST001', name: '壹咖·万象城店', address: '杭州市西湖区文三路 100 号万象城 3F', distance: '1.2km', bound: true, phone: '0571-88001234' },
  { id: 'ST002', name: '壹咖·滨江天街店', address: '杭州市滨江区江汉路 1515 号天街 2F', distance: '3.8km', bound: false, phone: '0571-86665566' },
  { id: 'ST003', name: '壹咖·城西银泰店', address: '杭州市拱墅区丰潭路 380 号银泰城 1F', distance: '5.6km', bound: false, phone: '0571-88997788' },
  { id: 'ST004', name: '壹咖·钱江新城店', address: '杭州市上城区钱江路 1366 号来福士 B1', distance: '7.9km', bound: false, phone: '0571-88002345' },
]

/** 按 id 取门店（找不到时回退到第一家店） */
export function getStore(storeId: string): Store {
  return stores.find((s) => s.id === storeId) ?? stores[0]
}

/** 当前绑定的门店 id（原型默认绑定 壹咖·万象城店；真实场景由登录/绑定流程写入） */
export const defaultStoreId = 'ST001'

/* ═══════════════ 门店登记（PRD §3.1.3 关联：报修人登记门店） ═══════════════ */

/** 可选登记区域（用于「选择地址 → 生成店名」） */
export const REGISTER_DISTRICTS = [
  '西湖区', '滨江区', '拱墅区', '上城区', '下城区', '江干区', '萧山区', '余杭区', '临平区', '钱塘区',
]

/**
 * 登记新门店：根据「区域 + 店名」新增一家门店并返回该门店。
 * 原型内立即登记生效（登记即绑定），真实场景由管理端审核后上线。
 * 地址自动拼装为「杭州市{区}{详细地址}」。
 */
export function registerStore(district: string, storeName: string, detailAddress: string): Store {
  const seq = stores.length + 1
  const id = `ST${String(seq).padStart(3, '0')}`
  // 保证 id 唯一
  let finalId = id
  let n = 1
  while (stores.some((s) => s.id === finalId)) {
    finalId = `ST${String(seq + n).padStart(3, '0')}`
    n++
  }
  const store: Store = {
    id: finalId,
    name: storeName,
    address: `杭州市${district}${detailAddress}`,
    distance: '—',
    bound: false,
    phone: '—',
  }
  stores.push(store)
  return store
}

/**
 * 根据所选区域生成默认店名（可被用户手动修改）：
 * 例：滨江区 → 「壹咖·滨江区店」
 */
export function suggestStoreName(district: string): string {
  return `壹咖·${district}店`
}

/* ═══════════════ 当前用户（PRD §3.1.1） ═══════════════ */

export interface CurrentUser {
  name: string
  phone: string
  /** 所属门店由绑定流程决定，见 boundStoreId；此处保留展示兜底 */
  storeId: string
  avatarText: string
}

export const currentUser: CurrentUser = {
  name: '张三',
  phone: '138****8888',
  storeId: defaultStoreId,
  avatarText: '张',
}

/** 原型中的"当前选中工单"（用于演示工单详情 / 验收评价，可被页面切换） */
export const demoOrderId = 'WO20260814003'

/* ═══════════════ 商城（门店采购/耗材商城模块） ═══════════════ */

/* ---- 分类层级：主分类 → 子分类 → 子子分类 ---- */

/** 最末级分类 key（商品归属此级，用于商城/商品页筛选） */
export type MallLeafKey =
  | 'ac-cap-start'
  | 'ac-cap-run'
  | 'ac-gas-r410a'
  | 'ac-filter'
  | 'clean-filter'
  | 'clean-mold'
  | 'clean-sterilize'
  | 'lamp-tube'
  | 'lamp-bulb'
  | 'lamp-sensor'
  | 'pipe-seal'
  | 'pipe-valve'
  | 'pipe-filter'
  | 'tool-manual'
  | 'tool-meter'

/** 子子分类 */
export interface MallLeafCategory {
  key: MallLeafKey
  label: string
  /** 缩略图占位：lucide 图标（真实场景替换为图片 URL） */
  Icon: LucideIcon
  /** 缩略图底色（静态类名） */
  bg: string
}

/** 子分类（右侧展示；可含子子分类） */
export interface MallSubCategory {
  key: string
  label: string
  leaves: MallLeafCategory[]
}

/** 主分类（左侧导航） */
export interface MallMainCategory {
  key: string
  label: string
  /** 左侧图标（lucide-react 图标组件） */
  Icon: LucideIcon
  subs: MallSubCategory[]
}

/** 商城主分类树（商城 Tab 双栏：左侧主分类，右侧子分类+子子分类） */
export const MALL_CATEGORIES: MallMainCategory[] = [
  {
    key: 'ac',
    label: '空调配件',
    Icon: Snowflake,
    subs: [
      {
        key: 'ac-capacitor',
        label: '电容类',
        leaves: [
          { key: 'ac-cap-start', label: '启动电容', Icon: CircleDot, bg: 'bg-sky-50' },
          { key: 'ac-cap-run', label: '运行电容', Icon: Cpu, bg: 'bg-blue-50' },
        ],
      },
      {
        key: 'ac-refrigerant',
        label: '制冷剂',
        leaves: [{ key: 'ac-gas-r410a', label: 'R410A', Icon: Snowflake, bg: 'bg-cyan-50' }],
      },
      {
        key: 'ac-filter',
        label: '滤网风叶',
        leaves: [{ key: 'ac-filter', label: '滤网', Icon: Filter, bg: 'bg-sky-50' }],
      },
    ],
  },
  {
    key: 'consumable',
    label: '清洗耗材',
    Icon: SprayCan,
    subs: [
      {
        key: 'clean-agent',
        label: '清洁剂',
        leaves: [
          { key: 'clean-filter', label: '滤网清洗剂', Icon: SprayCan, bg: 'bg-emerald-50' },
          { key: 'clean-mold', label: '除霉剂', Icon: Sparkles, bg: 'bg-rose-50' },
        ],
      },
      {
        key: 'clean-sanitize',
        label: '消毒除味',
        leaves: [{ key: 'clean-sterilize', label: '消毒除味', Icon: Sparkles, bg: 'bg-teal-50' }],
      },
    ],
  },
  {
    key: 'lamp',
    label: '灯具照明',
    Icon: Lightbulb,
    subs: [
      {
        key: 'lamp-tube',
        label: '灯管',
        leaves: [{ key: 'lamp-tube', label: 'T8/T5 灯管', Icon: Lightbulb, bg: 'bg-amber-50' }],
      },
      {
        key: 'lamp-bulb',
        label: '球泡',
        leaves: [{ key: 'lamp-bulb', label: 'E27/E14 球泡', Icon: Sun, bg: 'bg-yellow-50' }],
      },
      {
        key: 'lamp-sensor',
        label: '感应开关',
        leaves: [{ key: 'lamp-sensor', label: '感应开关面板', Icon: Radar, bg: 'bg-indigo-50' }],
      },
    ],
  },
  {
    key: 'pipe',
    label: '水暖管件',
    Icon: Droplets,
    subs: [
      {
        key: 'pipe-seal',
        label: '密封辅材',
        leaves: [{ key: 'pipe-seal', label: '生料带/密封胶', Icon: Package, bg: 'bg-gray-50' }],
      },
      {
        key: 'pipe-valve',
        label: '阀芯',
        leaves: [{ key: 'pipe-valve', label: '水龙头阀芯', Icon: Droplets, bg: 'bg-cyan-50' }],
      },
      {
        key: 'pipe-filter',
        label: '过滤滤芯',
        leaves: [{ key: 'pipe-filter', label: '前置滤芯', Icon: Filter, bg: 'bg-teal-50' }],
      },
    ],
  },
  {
    key: 'tool',
    label: '维修工具',
    Icon: Wrench,
    subs: [
      {
        key: 'tool-manual',
        label: '手动工具',
        leaves: [{ key: 'tool-manual', label: '螺丝刀套装', Icon: Wrench, bg: 'bg-orange-50' }],
      },
      {
        key: 'tool-meter',
        label: '检测仪表',
        leaves: [{ key: 'tool-meter', label: '测电笔', Icon: Zap, bg: 'bg-purple-50' }],
      },
    ],
  },
]

/** 由主分类 key 取主分类（找不到回退第一个） */
export function getMainCategory(key: string): MallMainCategory {
  return MALL_CATEGORIES.find((c) => c.key === key) ?? MALL_CATEGORIES[0]
}

/** 子分类下所有子子分类 key */
export function getAllLeaves(sub: MallSubCategory): MallLeafKey[] {
  return sub.leaves.map((l) => l.key)
}

/** 由最末级分类 key 取标签（找不到回退 key 本身） */
export function getLeafLabel(key: MallLeafKey): string {
  for (const main of MALL_CATEGORIES) {
    for (const sub of main.subs) {
      const hit = sub.leaves.find((l) => l.key === key)
      if (hit) return hit.label
    }
  }
  return key
}

export interface MallProduct {
  id: string
  name: string
  /** 归属的最末级分类 key */
  leaf: MallLeafKey
  /** 展示价格（元） */
  price: number
  /** 划线价（元），0 表示无优惠，原型用于展示折扣 */
  originalPrice?: number
  /** 商品图（原型用 lucide 图标占位，真实场景替换为图片 URL） */
  Icon: LucideIcon
  /** 图片底色（静态类名） */
  bg: string
  /** 规格/单位说明 */
  spec: string
  /** 已售数量（用于「已售 N」展示） */
  sold: number
  /** 是否支持立即购买 */
  inStock: boolean
}

/** 商城商品列表（门店员工采购配件/耗材使用，PRD 设备管理配套） */
export const mallProducts: MallProduct[] = [
  { id: 'M001', name: '空调启动电容 35μF', leaf: 'ac-cap-start', price: 28, originalPrice: 35, Icon: Cpu, bg: 'bg-sky-50', spec: 'CBB65A/35μF', sold: 128, inStock: true },
  { id: 'M013', name: '空调运行电容 40μF', leaf: 'ac-cap-run', price: 32, Icon: Cpu, bg: 'bg-blue-50', spec: 'CBB61/40μF', sold: 64, inStock: true },
  { id: 'M002', name: '空调制冷剂 R410A', leaf: 'ac-gas-r410a', price: 88, originalPrice: 108, Icon: Snowflake, bg: 'bg-cyan-50', spec: '450g/瓶', sold: 76, inStock: true },
  { id: 'M014', name: '空调滤网（通用款）', leaf: 'ac-filter', price: 15, Icon: Filter, bg: 'bg-sky-50', spec: '40×80cm', sold: 119, inStock: true },
  { id: 'M003', name: '空调滤网清洗剂', leaf: 'clean-filter', price: 22, Icon: SprayCan, bg: 'bg-emerald-50', spec: '500ml/瓶', sold: 231, inStock: true },
  { id: 'M004', name: '除霉菌专用喷剂', leaf: 'clean-mold', price: 35, Icon: SprayCan, bg: 'bg-rose-50', spec: '420ml/瓶', sold: 92, inStock: false },
  { id: 'M015', name: '消毒除味喷雾', leaf: 'clean-sterilize', price: 19, Icon: SprayCan, bg: 'bg-teal-50', spec: '300ml/瓶', sold: 156, inStock: true },
  { id: 'M005', name: 'LED 日光灯管 1.2m', leaf: 'lamp-tube', price: 16, originalPrice: 20, Icon: Lightbulb, bg: 'bg-amber-50', spec: 'T8/18W 白光', sold: 315, inStock: true },
  { id: 'M006', name: 'LED 球泡 9W', leaf: 'lamp-bulb', price: 8, Icon: Lightbulb, bg: 'bg-yellow-50', spec: 'E27/暖光', sold: 408, inStock: true },
  { id: 'M012', name: '感应开关面板', leaf: 'lamp-sensor', price: 39, originalPrice: 49, Icon: Radar, bg: 'bg-indigo-50', spec: '86 型红外感应', sold: 33, inStock: false },
  { id: 'M007', name: '生料带防水胶带', leaf: 'pipe-seal', price: 5, Icon: RollerCoaster, bg: 'bg-gray-50', spec: '20m/卷', sold: 562, inStock: true },
  { id: 'M016', name: '管螺纹密封胶', leaf: 'pipe-seal', price: 11, Icon: Pipette, bg: 'bg-slate-50', spec: '85g/支', sold: 74, inStock: true },
  { id: 'M008', name: '水龙头阀芯', leaf: 'pipe-valve', price: 18, Icon: Droplets, bg: 'bg-cyan-50', spec: '通用陶瓷阀芯', sold: 143, inStock: true },
  { id: 'M011', name: '水龙头过滤芯 5μm', leaf: 'pipe-filter', price: 12, Icon: Filter, bg: 'bg-teal-50', spec: 'PP 棉 5支装', sold: 88, inStock: true },
  { id: 'M009', name: '螺丝刀套装', leaf: 'tool-manual', price: 45, originalPrice: 59, Icon: Wrench, bg: 'bg-orange-50', spec: '24 合 1', sold: 67, inStock: true },
  { id: 'M010', name: '电子测电笔', leaf: 'tool-meter', price: 25, Icon: Zap, bg: 'bg-purple-50', spec: '数显 AC/DC', sold: 51, inStock: true },
]
