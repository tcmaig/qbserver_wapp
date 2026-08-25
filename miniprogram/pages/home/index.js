// 从 mock.ts 导入数据（在小程序中用 require）
const mockData = require('../../utils/mock.js')

function parseDate(dateStr) {
  if (!dateStr) return new Date(0);

  // 如果已经是 Date 对象
  if (dateStr instanceof Date) return dateStr;

  // 如果是时间戳数字
  if (typeof dateStr === 'number') return new Date(dateStr);

  // 处理 iOS 兼容：将 "2026-08-12 14:15" 转换为 "2026/08/12 14:15"
  if (typeof dateStr === 'string') {
      // 替换日期分隔符 - 为 /
      var formatted = dateStr.replace(/-/g, '/');
      var date = new Date(formatted);
      if (!isNaN(date.getTime())) {
          return date;
      }
  }

  return new Date(0);
}

Page({
  data: {
    storeName: '壹咖·万象城店',
    unreadCount: 3,
    banners: [
      { title: '壹咖保障 · 报修无忧', subtitle: '统一维修服务，全程可追踪', tag: '服务保障' },
      { title: '预约上门维修', subtitle: '专业师傅，快速上门', tag: '上门服务' },
      { title: '新店开业 · 免费检测', subtitle: '安装保养特惠进行中', tag: '特惠活动' }
    ],
    totalOrders: 0,
    pendingOrders: 0,
    repairingOrders: 0,
    acceptOrders: 0,
    recentOrders: [],
    tools: [
      { label: '设备管理', icon: '📋', color: 'sky-50', tap: 'goToDevice' },
      { label: '门店列表', icon: '📍', color: 'emerald-50', tap: 'goToStoreList' },
      { label: '报修记录', icon: '📄', color: 'indigo-50', tap: 'goToOrders' },
      { label: '帮助中心', icon: '📖', color: 'rose-50', tap: 'goToHelp' }
    ]
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    this.loadData()
  },

  loadData() {
    // 从 mock 数据加载工单
    const orders = mockData.workOrders || []
    
    // 统计各状态数量
    const total = orders.length
    const pending = orders.filter(o => o.status === 0 || o.status === 1).length
    const repairing = orders.filter(o => o.status === 3 || o.status === 4).length
    const done = orders.filter(o => o.status === 5).length

    // 最近3条工单（按时间排序）
    const recent = orders
      .slice()
      .sort((a, b) => {
        const dateA = parseDate(a.createdAt);
        const dateB = parseDate(b.createdAt);
        return dateB - dateA;
      })
      .slice(0, 3)
      .map(o => {
        // 状态标签映射
        const statusMap = {
          0: { label: '待审核', class: 'pending' },
          1: { label: '已派单', class: 'dispatched' },
          2: { label: '已接单', class: 'accepted' },
          3: { label: '维修中', class: 'repair' },
          4: { label: '待验收', class: 'accept' },
          5: { label: '已完成', class: 'done' },
          6: { label: '已驳回', class: 'rejected' },
          7: { label: '已关闭', class: 'closed' }
        }
        const statusInfo = statusMap[o.status] || { label: '未知', class: 'pending' }
        return {
          id: o.id,
          title: o.title,
          location: o.location,
          statusLabel: statusInfo.label,
          statusClass: statusInfo.class,
          time: o.createdAt.slice(5, 16)
        }
      })

    this.setData({
      totalOrders: total,
      pendingOrders: pending,
      repairingOrders: repairing,
      acceptOrders: done,
      recentOrders: recent
    })
  },

  goToStoreList() {
    wx.navigateTo({ url: '/pages/store/index' })
  },

  goToMessage() {
    wx.navigateTo({ url: '/pages/message/index' })
  },

  goToForm() {
    wx.navigateTo({ url: '/pages/form/index' })
  },

  goToInstall() {
    wx.showToast({ title: '功能开发中', icon: 'none' })
  },

  goToPurchase() {
    wx.showToast({ title: '功能开发中', icon: 'none' })
  },

  goToMaintain() {
    wx.showToast({ title: '功能开发中', icon: 'none' })
  },

  goToMaterial() {
    wx.showToast({ title: '功能开发中', icon: 'none' })
  },

  goToOrders(e) {
    wx.switchTab({ url: '/pages/orders/index' })
  },

  goToOrderDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/order-detail/index?id=${id}` })
  },

  goToDevice() {
    wx.showToast({ title: '功能开发中', icon: 'none' })
  },

  goToHelp() {
    wx.showToast({ title: '功能开发中', icon: 'none' })
  }
})