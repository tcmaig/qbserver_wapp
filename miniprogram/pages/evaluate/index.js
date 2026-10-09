const { request } = require('../../utils/request.js')

Page({
  data: {
    orderId: '',
    order: {
      id: '',
      title: '',
      storeName: '',
      location: '',
      summary: null,
      afterImages: []
    },
    rating: 0,
    comment: '',
    ratingLabels: ['', '⭐ 很差', '⭐⭐ 较差', '⭐⭐⭐ 一般', '⭐⭐⭐⭐ 满意', '⭐⭐⭐⭐⭐ 非常满意'],
    isSubmitting: false
  },

  onLoad(options) {
    const orderId = options.orderId
    if (orderId) {
      this.setData({ orderId })
      this.loadOrder(orderId)
    } else {
      // 测试数据
      this.loadMockData()
    }
  },

  // 加载工单数据
  loadOrder(id) {
    wx.showLoading({ title: '加载中...' })

    request({
      url: `/service-orders/${id}`,
      method: 'GET'
    }).then(data => {
      wx.hideLoading()
      if (data.success && data.data) {
        const order = this.formatOrder(data.data)
        this.setData({ order })
      } else {
        this.loadMockData()
      }
    }).catch(err => {
      wx.hideLoading()
      console.error('加载工单失败', err)
      this.loadMockData()
    })
  },

  // 格式化工单数据
  formatOrder(data) {
    return {
      id: data.id,
      title: data.title || '未命名工单',
      storeName: data.store_name || data.storeName || '未指定门店',
      location: data.location || data.address || '未指定地点',
      summary: data.summary || {
        cause: data.cause || '未记录',
        method: data.method || '未记录',
        parts: data.parts || '无',
        duration: data.duration || '未记录',
        cost: data.cost || '¥0.00'
      },
      afterImages: data.after_images || data.afterImages || []
    }
  },

  // 模拟数据
  loadMockData() {
    const mockOrder = {
      id: 'WO20260814003',
      title: '3楼空调不制冷',
      storeName: '壹咖·万象城店',
      location: 'A栋3楼301',
      summary: {
        cause: '压缩机启动电容损坏',
        method: '更换启动电容并补充制冷剂',
        parts: '启动电容 ×1、制冷剂 500g',
        duration: '2.5 小时',
        cost: '¥580.00'
      },
      afterImages: [
        '/images/demo/after1.png',
        '/images/demo/after2.png'
      ]
    }
    this.setData({ order: mockOrder })
  },

  // ===== 评分 =====
  setRating(e) {
    const index = e.currentTarget.dataset.index
    const rating = index + 1
    this.setData({ rating })
  },

  // ===== 文字评价 =====
  onCommentInput(e) {
    this.setData({ comment: e.detail.value })
  },

  // ===== 预览图片 =====
  previewImage(e) {
    const url = e.currentTarget.dataset.url
    const urls = this.data.order.afterImages
    wx.previewImage({
      current: url,
      urls: urls
    })
  },

  // ===== 跳转工单详情 =====
  goToDetail() {
    const id = this.data.orderId || this.data.order.id
    wx.navigateTo({ url: `/pages/order-detail/index?id=${id}` })
  },

  // ===== 退回重修 =====
  rejectOrder() {
    wx.showModal({
      title: '确认退回',
      content: '确定要将此工单退回重修吗？',
      confirmText: '确认退回',
      confirmColor: '#EF4444',
      success: (res) => {
        if (res.confirm) {
          this.submitEvaluate('rejected')
        }
      }
    })
  },

  // ===== 确认完成 =====
  confirmOrder() {
    if (this.data.rating === 0) {
      wx.showToast({ title: '请先完成满意度评分', icon: 'none' })
      return
    }

    wx.showModal({
      title: '确认完成',
      content: '确定要确认此工单已完成吗？',
      confirmText: '确认完成',
      confirmColor: '#07C160',
      success: (res) => {
        if (res.confirm) {
          this.submitEvaluate('completed')
        }
      }
    })
  },

  // ===== 提交评价 =====
  submitEvaluate(action) {
    if (this.data.isSubmitting) return
    this.setData({ isSubmitting: true })

    wx.showLoading({ title: '提交中...' })

    const { orderId, rating, comment } = this.data

    request({
      url: `/service-orders/${orderId}/evaluate`,
      method: 'POST',
      data: {
        action: action,           // 'completed' 或 'rejected'
        rating: rating,
        comment: comment.trim()
      }
    }).then(data => {
      wx.hideLoading()
      this.setData({ isSubmitting: false })

      if (data.success) {
        const title = action === 'completed' ? '评价成功！' : '已退回重修'
        wx.showToast({ title, icon: 'success' })
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      } else {
        wx.showToast({ title: data.message || '操作失败', icon: 'none' })
      }
    }).catch(err => {
      wx.hideLoading()
      this.setData({ isSubmitting: false })
      wx.showToast({ title: '网络请求失败', icon: 'none' })
    })
  }
})