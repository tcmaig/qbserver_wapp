const { getOrders } = require('../../api/main.js')

Page({
  data: {
    currentTab: 'all',
    allOrders: [],
    filteredOrders: [],
    tabCounts: { all: 0, doing: 0, done: 0 }
  },

  onLoad() {
    this.loadOrders()
  },

  onShow() {
    this.loadOrders()
  },

  loadOrders() {
    wx.showLoading({ title: '加载中...' })

    getOrders({ page: 1, limit: 20 }).then(data => {
      wx.hideLoading()

      if (data.success && data.data) {
        const orders = this.formatOrders(data.data.data || [])
        this.setData({ allOrders: orders })
        this.filterOrders(this.data.currentTab)
        this.updateTabCounts(orders)
      } else {
        this.loadMockData()
      }
    }).catch(err => {
      wx.hideLoading()
      console.error('加载工单失败', err)
      this.loadMockData()
    })
  },

  formatOrders(data) {
    const statusMap = {
      0: '待审核', 1: '已派单', 2: '已接单',
      3: '维修中', 4: '待验收', 5: '已完成',
      6: '已驳回', 7: '已关闭'
    }
    const urgencyMap = {
      1: '普通', 2: '一般', 3: '紧急', 4: '加急'
    }
    const progressMap = {
      0: 10, 1: 25, 2: 40, 3: 60, 4: 80, 5: 100
    }
    const barColorMap = {
      0: '#FFA726', 1: '#42A5F5', 2: '#42A5F5',
      3: '#FB8C00', 4: '#AB47BC', 5: '#4CAF50'
    }

    return data.map(item => ({
      id: item.id,
      title: item.title || '未命名工单',
      status: item.status,
      statusLabel: statusMap[item.status] || '未知',
      urgency: item.urgency || 2,
      urgencyLabel: urgencyMap[item.urgency] || '一般',
      category: item.category || item.device_type || '设备',
      brand: item.brand || '',
      model: item.model || '',
      location: item.address || item.location || '',
      progress: progressMap[item.status] || 0,
      barColor: barColorMap[item.status] || '#999',
      createdAt: item.created_at || item.createdAt || ''
    }))
  },

  loadMockData() {
    const mockOrders = [
      {
        id: 1,
        title: '3楼空调不制冷',
        status: 4,
        statusLabel: '待验收',
        urgency: 3,
        urgencyLabel: '紧急',
        category: '空调',
        brand: '格力',
        location: 'A栋3楼301',
        progress: 80,
        barColor: '#AB47BC',
        createdAt: '2026-08-14 09:20'
      },
      {
        id: 2,
        title: '洗手间水龙头漏水',
        status: 3,
        statusLabel: '维修中',
        urgency: 2,
        urgencyLabel: '一般',
        category: '管道',
        brand: '联塑',
        location: 'B栋2楼205',
        progress: 60,
        barColor: '#FB8C00',
        createdAt: '2026-08-14 08:05'
      }
    ]
    this.setData({ allOrders: mockOrders })
    this.filterOrders(this.data.currentTab)
    this.updateTabCounts(mockOrders)
  },

  updateTabCounts(orders) {
    const doing = orders.filter(o => o.status >= 0 && o.status <= 4).length
    const done = orders.filter(o => o.status === 5).length
    this.setData({
      tabCounts: {
        all: orders.length,
        doing: doing,
        done: done
      }
    })
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ currentTab: tab })
    this.filterOrders(tab)
  },

  filterOrders(tab) {
    const orders = this.data.allOrders
    let filtered = []
    if (tab === 'all') {
      filtered = orders
    } else if (tab === 'doing') {
      filtered = orders.filter(o => o.status >= 0 && o.status <= 4)
    } else if (tab === 'done') {
      filtered = orders.filter(o => o.status === 5)
    }
    this.setData({ filteredOrders: filtered })
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/order-detail/index?id=${id}` })
  }
})