App({
  globalData: {
    apiBase: 'http://127.0.0.1:80/api',
    userInfo: null,
    token: null
  },

  onLaunch() {
    // 检查登录状态
    const token = wx.getStorageSync('token')
    if (token) {
      this.globalData.token = token
    }
  },

  "permission": {
    "scope.userLocation": {
      "desc": "你的位置信息将用于报修地址定位"
    }
  },
  "requiredPrivateInfos": [
    "getLocation"
  ]
})