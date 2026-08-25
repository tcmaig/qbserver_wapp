const { request } = require('./request.js')

// 微信登录（code 登录 + 获取手机号）
const wxLogin = (data) => {
  return request({
    url: '/wx/login',
    method: 'POST',
    data
  })
}

// 获取用户信息
const getUserInfo = () => {
  return request({
    url: '/me',
    method: 'GET'
  })
}

// 退出登录
const logout = () => {
  return request({
    url: '/logout',
    method: 'POST'
  })
}

// 获取工单列表
const getOrders = (params) => {
  return request({
    url: '/repairs',
    method: 'GET',
    data: params
  })
}

// 获取未读消息数
const getUnreadCount = () => {
  return request({
    url: '/message/unreadCount',
    method: 'GET'
  })
}

// 获取区域
const getRegions = () => {
  return request({
    url: '/regions',
    method: 'GET'
  })
}

// 获取验证码
const getCode = (data) => {
  return request({
    url: '/codes',
    method: 'POST',
    data
  })
}

// 手机号验证码登录
const userLogin = (data) => {
  return request({
    url: '/user/login',
    method: 'POST',
    data
  })
}

// 绑定手机号（验证码方式）
const bindMobile = (data) => {
  return request({
    url: '/bind',
    method: 'POST',
    data
  })
}

// ========== 新增：历史设备复用接口 ==========

// 获取历史报修设备列表
const getHistoryDevices = () => {
  return request({
    url: '/repairs/history/devices',
    method: 'GET'
  })
}

// 获取工单详情（用于完整复用设备信息）
const getOrderDetail = (id) => {
  return request({
    url: '/service-orders/' + id,
    method: 'GET'
  })
}

// 获取设备品类列表
const getStoreDevices = () => {
  return request({
    url: '/store-devices',
    method: 'GET'
  })
}

module.exports = {
  wxLogin,
  getUserInfo,
  logout,
  getOrders,
  getUnreadCount,
  getRegions,
  getCode,
  userLogin,
  bindMobile,
  getHistoryDevices,
  getOrderDetail,
  getStoreDevices
}