const { getOrderDetail } = require('../../api/main.js')

Page({
  data: {
    order: {
      id: '',
      status: 0,
      statusLabel: '',
      urgency: 1,
      urgencyLabel: '',
      title: '',
      description: '',
      category: '',
      brand: '',
      model: '',
      address: '',
      contactName: '',
      contactPhone: '',
      createdAt: '',
      progress: 0,
      barColor: '',
      timeline: [],
      logs: []
    }
  },

  onLoad(options) {
    const id = options.id
    if (id) {
      this.loadOrderDetail(id)
    } else {
      this.loadMockData()
    }
  },

  loadOrderDetail(id) {
    wx.showLoading({ title: '加载中...' })

    getOrderDetail(id).then(data => {
      wx.hideLoading()

      if (data.success && data.data) {
        const order = this.formatOrder(data.data)
        this.setData({ order })
      } else {
        this.loadMockData()
      }
    }).catch(err => {
      wx.hideLoading()
      console.error('加载工单详情失败', err)
      this.loadMockData()
    })
  },

  formatOrder(data) {
    const statusMap = {
      0: '待审核', 1: '已派单', 2: '已接单',
      3: '维修中', 4: '待验收', 5: '已完成'
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

    // 构建时间轴
    const stages = ['已提交', '已审核', '已派单', '维修中', '待验收', '已完成']
    const doneCount = data.status === 5 ? 6 : data.status + 1
    const timeline = stages.map((label, index) => {
      const done = index < doneCount
      return {
        label: label,
        done: done,
        time: done ? data.updated_at || data.created_at : '',
        operator: done && index > 0 ? data.technician || '系统' : '',
        last: index === stages.length - 1
      }
    })

    return {
      id: data.id,
      status: data.status,
      statusLabel: statusMap[data.status] || '未知',
      urgency: data.urgency || 2,
      urgencyLabel: urgencyMap[data.urgency] || '一般',
      title: data.title || '未命名工单',
      description: data.description || '暂无描述',
      category: data.category || data.device_type || '未指定',
      brand: data.brand || '未指定',
      model: data.model || '未指定',
      address: data.address || data.location || '未指定',
      contactName: data.contact_name || data.contactName || '未填写',
      contactPhone: data.contact_phone || data.contactPhone || '',
      createdAt: data.created_at || data.createdAt || '',
      progress: progressMap[data.status] || 0,
      barColor: barColorMap[data.status] || '#999',
      timeline: timeline,
      logs: data.logs || []
    }
  },

  loadMockData() {
    this.setData({
      order: {
        id: 1,
        status: 4,
        statusLabel: '待验收',
        urgency: 3,
        urgencyLabel: '紧急',
        title: '3楼空调不制冷',
        description: '办公室空调开机后不出冷风，出风口有异响',
        category: '空调',
        brand: '格力',
        model: 'KFR-35GW',
        address: '杭州市西湖区A栋3楼301',
        contactName: '张三',
        contactPhone: '138****8888',
        createdAt: '2026-08-14 09:20',
        progress: 80,
        barColor: '#AB47BC',
        timeline: [
          { label: '已提交', done: true, time: '08/14 09:20', operator: '张三', last: false },
          { label: '已审核', done: true, time: '08/14 09:30', operator: '王管理', last: false },
          { label: '已派单', done: true, time: '08/14 09:45', operator: '李师傅', last: false },
          { label: '维修中', done: true, time: '08/14 10:30', operator: '李师傅', last: false },
          { label: '待验收', done: true, time: '08/14 12:00', operator: '', last: false },
          { label: '已完成', done: false, time: '', operator: '', last: true }
        ],
        logs: [
          { operator: '张三', action: '提交报修', time: '08-14 09:20' },
          { operator: '王管理', action: '审核通过，已派单', time: '08-14 09:45' },
          { operator: '李师傅', action: '已接单，前往维修', time: '08-14 10:00' }
        ]
      }
    })
  },

  goToEvaluate() {
    const id = this.data.order.id
    wx.navigateTo({ url: `/pages/evaluate/index?orderId=${id}` })
  },

  callContact(e) {
    const phone = e.currentTarget.dataset.phone
    if (phone && phone !== '未填写') {
      wx.makePhoneCall({ phoneNumber: phone })
    } else {
      wx.showToast({ title: '暂无联系电话', icon: 'none' })
    }
  }
})