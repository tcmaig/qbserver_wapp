const app = getApp()

const request = (options) => {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token') || ''
    const baseUrl = app.globalData.apiBase || ''

    console.log('【请求】', options.method || 'GET', baseUrl + options.url)

    wx.request({
      url: baseUrl + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {}),
        ...(options.header || {})
      },
      success: (res) => {
        console.log('【响应】', options.url, res.statusCode, res.data)

        if (res.statusCode === 401) {
          wx.removeStorageSync('token')
          wx.removeStorageSync('user')
          reject({ code: 401, message: '请重新登录' })
          return
        }

        resolve(res.data)
      },
      fail: (err) => {
        console.error('【请求失败】', options.url, err)
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

module.exports = { request }