const app = getApp()

const request = (options) => {
  return new Promise((resolve, reject) => {
    // 👇 关键：从 storage 获取 token
    const token = wx.getStorageSync('token') || ''

    wx.request({
      url: app.globalData.apiBase + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        // 👇 关键：Bearer 格式
        'Authorization': 'Bearer ' + token,
        ...(options.header || {})
      },
      success: (res) => {
        // 401 处理
        if (res.statusCode === 401) {
          wx.removeStorageSync('token')
          wx.removeStorageSync('user')
          // 跳转到登录页
          wx.reLaunch({
            url: '/pages/login/index'
          })
          reject({ code: 401, message: '请重新登录' })
          return
        }
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

module.exports = { request }