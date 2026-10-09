const { getUserInfo, getOrders } = require('../../api/main.js')

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
    storeName: '加载中...',  // 先显示加载中
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
    this.loadStoreInfo()
    this.loadOrders()
  },

  onShow() {
    this.loadStoreInfo()
    this.loadOrders()
  },

  // ===== 加载门店信息 =====
  loadStoreInfo() {
    const token = wx.getStorageSync('token')
    if (!token) {
      this.setData({ storeName: '请登录' })
      return
    }

    getUserInfo().then(data => {
      if (data.success && data.data) {
        const user = data.data
        // 从用户信息中获取门店名称
        const storeName = user.store_name || user.storeName || user.bound_store_name || ''
        if (storeName) {
          this.setData({ storeName: storeName })
        } else {
          this.setData({ storeName: '无绑定门店' })
        }
        // 保存用户信息到缓存
        wx.setStorageSync('user', user)
      } else {
        // 接口失败，从缓存读取
        const user = wx.getStorageSync('user')
        if (user && (user.store_name || user.storeName)) {
          this.setData({ storeName: user.store_name || user.storeName })
        } else {
          this.setData({ storeName: '无绑定门店' })
        }
      }
    }).catch(() => {
      // 接口报错，从缓存读取
      const user = wx.getStorageSync('user')
      if (user && (user.store_name || user.storeName)) {
        this.setData({ storeName: user.store_name || user.storeName })
      } else {
        this.setData({ storeName: '无绑定门店' })
      }
    })
  },

  // ===== 加载工单数据 =====
  loadOrders() {
    const token = wx.getStorageSync('token')
    if (!token) {
      // 未登录，使用 mock 数据或显示空
      this.setData({
        totalOrders: 0,
        pendingOrders: 0,
        repairingOrders: 0,
        acceptOrders: 0,
        recentOrders: []
      })
      return
    }

    getOrders({ page: 1, limit: 20 }).then(data => {
      if (data.success && data.data) {
        const orders = data.data.data || []
        this.processOrders(orders)
      } else {
        // 接口返回失败，显示空数据
        this.setData({
          totalOrders: 0,
          pendingOrders: 0,
          repairingOrders: 0,
          acceptOrders: 0,
          recentOrders: []
        })
      }
    }).catch(() => {
      // 接口报错，使用 mock 数据
      this.loadMockData()
    })
  },

  // ===== 处理工单数据 =====
  processOrders(orders) {
    const total = orders.length
    const pending = orders.filter(o => o.status === 0 || o.status === 1).length
    const repairing = orders.filter(o => o.status === 3 || o.status === 4).length
    const done = orders.filter(o => o.status === 5).length

    // 最近3条工单（按时间排序）
    const recent = orders
      .slice()
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3)
      .map(o => {
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
          title: o.title || '未命名工单',
          location: o.address || o.location || '未指定地点',
          statusLabel: statusInfo.label,
          statusClass: statusInfo.class,
          time: o.created_at ? o.created_at.slice(5, 16) : ''
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

  // ===== Mock 数据（接口不可用时使用） =====
  loadMockData() {
    const mockData = require('../../utils/mock.js')
    const orders = mockData.workOrders || []
    
    const total = orders.length
    const pending = orders.filter(o => o.status === 0 || o.status === 1).length
    const repairing = orders.filter(o => o.status === 3 || o.status === 4).length
    const done = orders.filter(o => o.status === 5).length

    const recent = orders
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3)
      .map(o => {
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
          time: o.createdAt ? o.createdAt.slice(5, 16) : ''
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

  // ===== 跳转方法 =====
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