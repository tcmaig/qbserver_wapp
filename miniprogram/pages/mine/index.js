const { wxLogin, getUserInfo, getOrders, getUnreadCount, logout } = require('../../api/main')

Page({
  data: {
    isLogin: false,
    showModal: false,
    userInfo: {
      id: '',
      nickname: '',
      avatar: '',
      phone: '',
      level: ''
    },
    storeName: '',
    stats: { all: 0, doing: 0, done: 0, pending: 0 },
    menus: [
      { label: '消息中心', icon: '🔔', color: 'sky-500', tap: 'goToMessage', badge: 0 },
      { label: '我的设备', icon: '📋', color: 'sky-500', tap: 'goToDevices' },
      { label: '门店列表', icon: '📍', color: 'emerald-500', tap: 'goToStoreList' },
      { label: '报修记录', icon: '📄', color: 'indigo-500', tap: 'goToOrders' },
      { label: '帮助中心', icon: '📖', color: 'rose-500', tap: 'goToHelp' },
      { label: '设置', icon: '⚙️', color: 'gray-500', tap: 'goToSetting' }
    ]
  },

  onLoad() {
    this.checkLogin()
  },

  onShow() {
    this.checkLogin()
    if (this.data.isLogin) {
      this.loadStats()
      this.loadUnreadCount()
    }
  },

  // ===== 检查登录状态 =====
  checkLogin() {
    const token = wx.getStorageSync('token')
    const user = wx.getStorageSync('user')
    if (token && user) {
      this.setData({
        isLogin: true,
        userInfo: {
          id: user.id,
          nickname: user.nickname || user.name || '用户',
          avatar: user.avatar || '',
          phone: user.mobile || user.phone || '',
          level: user.level || '普通用户'
        },
        storeName: user.store_name || user.storeName || '请绑定门店'
      })
      // 刷新用户信息
      this.getUserInfo()
    } else {
      this.setData({
        isLogin: false,
        userInfo: { nickname: '点击登录', avatar: '', phone: '', level: '' },
        stats: { all: 0, doing: 0, done: 0, pending: 0 }
      })
    }
  },

  // ===== 获取用户信息 =====
  getUserInfo() {
    getUserInfo().then(data => {
      if (data.success && data.data) {
        const user = data.data
        const info = {
          id: user.id,
          nickname: user.nickname || user.name || '用户',
          avatar: user.avatar || '',
          phone: user.mobile || user.phone || '',
          level: user.level || '普通用户'
        }
        this.setData({
          userInfo: info,
          storeName: user.store_name || user.storeName || '请绑定门店'
        })
        wx.setStorageSync('user', info)
      }
    }).catch(() => {})
  },

  // ===== 加载工单统计 =====
  loadStats() {
    getOrders({ page: 1, limit: 1 }).then(data => {
      if (data.success && data.data) {
        const orders = data.data.data || []
        const all = orders.length || data.data.total || 0
        const doing = orders.filter(o => [1, 2, 3].includes(o.status)).length
        const done = orders.filter(o => [4, 5].includes(o.status)).length
        const pending = orders.filter(o => o.status === 0).length
        this.setData({ stats: { all, doing, done, pending } })
      }
    }).catch(() => {})
  },

  // ===== 加载未读消息数 =====
  loadUnreadCount() {
    getUnreadCount().then(data => {
      if (data.success && data.data) {
        const menus = this.data.menus
        menus[0].badge = data.data.count || data.data || 0
        this.setData({ menus })
      }
    }).catch(() => {})
  },

  // ===== 微信登录（弹窗中的按钮触发） =====
  getPhoneNumber(e) {
    this.setData({ showModal: false })

    if (e.detail.errMsg !== 'getPhoneNumber:ok') {
      wx.showToast({ title: '已取消授权', icon: 'none' })
      return
    }

    const { iv, encryptedData } = e.detail

    wx.login({
      success: (res) => {
        if (!res.code) {
          wx.showToast({ title: '获取登录凭证失败', icon: 'none' })
          return
        }

        wx.showLoading({ title: '登录中...' })

        // 👇 调用统一 API
        wxLogin({
          code: res.code,
          iv: iv,
          encryptedData: encryptedData
        }).then(data => {
          wx.hideLoading()

          if (data.success && data.data?.token) {
            const user = data.data.user || {}
            wx.setStorageSync('token', data.data.token)
            wx.setStorageSync('user', user)

            this.setData({
              isLogin: true,
              userInfo: {
                id: user.id,
                nickname: user.nickname || user.name || '用户',
                avatar: user.avatar || '',
                phone: user.mobile || user.phone || '',
                level: user.level || '普通用户'
              },
              storeName: user.store_name || user.storeName || '请绑定门店'
            })

            wx.showToast({ title: '登录成功', icon: 'success' })
            this.loadStats()
            this.loadUnreadCount()
          } else {
            wx.showToast({ title: data.message || '登录失败', icon: 'none' })
          }
        }).catch(err => {
          wx.hideLoading()
          wx.showToast({ title: '网络请求失败', icon: 'none' })
        })
      }
    })
  },

  // ===== 退出登录 =====
  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          logout().catch(() => {})
          wx.removeStorageSync('token')
          wx.removeStorageSync('user')
          this.setData({
            isLogin: false,
            userInfo: { nickname: '点击登录', avatar: '', phone: '', level: '' },
            stats: { all: 0, doing: 0, done: 0, pending: 0 }
          })
          wx.showToast({ title: '已退出', icon: 'none' })
        }
      }
    })
  },

  // ===== 其他方法 =====
  showLoginModal() {
    this.setData({ showModal: true })
  },

  closeModal() {
    this.setData({ showModal: false })
  },

  stopPropagation() {},

  goToUserInfo() {
    wx.navigateTo({ url: '/pages/user-info/index' })
  },

  goToMessage() {
    wx.navigateTo({ url: '/pages/message/index' })
  },

  goToStoreList() {
    wx.navigateTo({ url: '/pages/store/index' })
  },

  goToOrders() {
    wx.switchTab({ url: '/pages/orders/index' })
  },

  goToDevices() {
    wx.showToast({ title: '功能开发中', icon: 'none' })
  },

  goToHelp() {
    wx.showToast({ title: '功能开发中', icon: 'none' })
  },

  goToSetting() {
    wx.showToast({ title: '功能开发中', icon: 'none' })
  },

  bindPhone() {
    if (!this.data.isLogin) {
      this.showLoginModal()
      return
    }
    wx.showToast({ title: '功能开发中', icon: 'none' })
  }
})