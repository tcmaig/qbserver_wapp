const app = getApp()

// 统一请求方法
const request = (options) => {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token') || ''

    wx.request({
      url: app.globalData.apiBase + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
        ...(options.header || {})
      },
      success: (res) => {
        if (res.statusCode === 401) {
          wx.removeStorageSync('token')
          wx.removeStorageSync('user')
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

// 微信登录（code 登录 + 获取手机号）
export const wxLogin = (data) => {
  return request({
    url: '/wx/login',
    method: 'POST',
    data
  })
}

// 获取用户信息
export const getUserInfo = () => {
  return request({
    url: '/me',
    method: 'GET'
  })
}

// 退出登录
export const logout = () => {
  return request({
    url: '/logout',
    method: 'POST'
  })
}

// 获取工单列表
export const getOrders = (params) => {
  return request({
    url: '/repairs',
    method: 'GET',
    data: params
  })
}

// 获取未读消息数
export const getUnreadCount = () => {
  return request({
    url: '/message/unreadCount',
    method: 'GET'
  })
}

// 获取区域
export const getRegions = () => {
  return request({
    url: '/regions',
    method: 'GET'
  })
}

// 获取验证码
export const getCode = (data) => {
  return request({
    url: '/codes',
    method: 'POST',
    data
  })
}

// 手机号验证码登录
export const userLogin = (data) => {
  return request({
    url: '/user/login',
    method: 'POST',
    data
  })
}

// 绑定手机号（验证码方式）
export const bindMobile = (data) => {
  return request({
    url: '/bind',
    method: 'POST',
    data
  })
}

export default {
  wxLogin,
  getUserInfo,
  logout,
  getOrders,
  getUnreadCount,
  getRegions,
  getCode,
  userLogin,
  bindMobile
}