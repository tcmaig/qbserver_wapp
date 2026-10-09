App({
  globalData: {
    // 开发环境：使用局域网 IP（替换为你的实际 IP）
    // 查看 IP 方法：终端输入 ipconfig (Windows) 或 ifconfig (Mac/Linux)
    apiBase: 'http://192.168.0.101:80/api',  // ← 替换为你的电脑局域网 IP
    userInfo: null,
    token: null
  },

  onLaunch() {
    const token = wx.getStorageSync('token')
    if (token) {
      this.globalData.token = token
    }
  }
})