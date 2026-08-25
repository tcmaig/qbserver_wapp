const { request } = require('../../utils/request.js')

Page({
  data: {
    currentTab: 'all',
    allOrders: [],
    filteredOrders: [],
    tabCounts: {
      all: 0,
      doing: 0,
      done: 0
    }
  },

  onLoad() {
    this.loadOrders()
  },

  onShow() {
    this.loadOrders()
  },

  // 加载工单列表
  loadOrders() {
    wx.showLoading({ title: '加载中...' })

    request({
      url: '/service-orders',
      method: 'GET'
    }).then(data => {
      wx.hideLoading()

      if (data.success && data.data) {
        const orders = this.formatOrders(data.data)
        this.setData({
          allOrders: orders
        })
        this.filterOrders(this.data.currentTab)
        this.updateTabCounts(orders)
      } else {
        // 使用模拟数据
        const mockOrders = this.getMockOrders()
        this.setData({
          allOrders: mockOrders
        })
        this.filterOrders(this.data.currentTab)
        this.updateTabCounts(mockOrders)
      }
    }).catch(err => {
      wx.hideLoading()
      console.error('加载工单失败', err)
      // 使用模拟数据
      const mockOrders = this.getMockOrders()
      this.setData({
        allOrders: mockOrders
      })
      this.filterOrders(this.data.currentTab)
      this.updateTabCounts(mockOrders)
    })
  },

  // 格式化接口返回的工单数据
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
      title: item.title || item.name || '未命名工单',
      status: item.status,
      statusLabel: statusMap[item.status] || '未知',
      urgency: item.urgency,
      urgencyLabel: urgencyMap[item.urgency] || '一般',
      category: item.category || item.device_type || '设备',
      brand: item.brand || '',
      location: item.location || item.address || '',
      address: item.address || '',
      progress: progressMap[item.status] || 0,
      barColor: barColorMap[item.status] || '#999',
      createdAt: item.created_at || item.createdAt || '',
      updatedAt: item.updated_at || item.updatedAt || ''
    }))
  },

  // 模拟数据（接口失败时使用）
  getMockOrders() {
    return [
      {
        id: 'WO20260814003',
        title: '3楼空调不制冷',
        status: 4,
        statusLabel: '待验收',
        urgency: 3,
        urgencyLabel: '紧急',
        category: '空调',
        brand: '格力',
        location: 'A栋3楼301',
        address: 'A栋3楼301',
        progress: 80,
        barColor: '#AB47BC',
        createdAt: '2026-08-14 09:20'
      },
      {
        id: 'WO20260814001',
        title: '洗手间水龙头漏水',
        status: 3,
        statusLabel: '维修中',
        urgency: 2,
        urgencyLabel: '一般',
        category: '管道',
        brand: '联塑',
        location: 'B栋2楼205',
        address: 'B栋2楼205',
        progress: 60,
        barColor: '#FB8C00',
        createdAt: '2026-08-14 08:05'
      },
      {
        id: 'WO20260813006',
        title: '前台电路跳闸',
        status: 1,
        statusLabel: '已派单',
        urgency: 4,
        urgencyLabel: '加急',
        category: '电力',
        brand: '正泰',
        location: 'C栋1楼前台',
        address: 'C栋1楼前台',
        progress: 25,
        barColor: '#42A5F5',
        createdAt: '2026-08-13 17:40'
      },
      {
        id: 'WO20260809007',
        title: '电梯运行异响',
        status: 5,
        statusLabel: '已完成',
        urgency: 3,
        urgencyLabel: '紧急',
        category: '电梯',
        brand: '三菱',
        location: 'B栋1楼电梯厅',
        address: 'B栋1楼电梯厅',
        progress: 100,
        barColor: '#4CAF50',
        createdAt: '2026-08-09 09:30'
      }
    ]
  },

  // 更新 Tab 角标
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

  // 切换 Tab
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ currentTab: tab })
    this.filterOrders(tab)
  },

  // 筛选工单
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

  // 跳转工单详情
  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/order-detail/index?id=${id}` })
  }
})