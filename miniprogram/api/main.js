const { request } = require('./request.js')

// 无需登录的请求（不自动带 token）
const publicRequest = (options) => {
  return new Promise((resolve, reject) => {
    const app = getApp()
    wx.request({
      url: app.globalData.apiBase + options.url,
      method: options.method || 'POST',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// ===== 微信登录 =====
const wxLogin = (data) => {
  return request({
    url: '/wx/login',
    method: 'POST',
    data
  })
}

// ===== 用户相关 =====
const getUserInfo = () => {
  return request({
    url: '/me',
    method: 'GET'
  })
}

const logout = () => {
  return request({
    url: '/logout',
    method: 'POST'
  })
}

// ===== 报修申请（无需登录，不传 token） =====
const submitRepairRequest = (data) => {
  return publicRequest({
    url: '/repair-requests',
    method: 'POST',
    data
  })
}

const getRepairProgress = (id, mobile) => {
  return request({
    url: `/repair-requests/${id}/progress`,
    method: 'GET',
    data: { mobile }
  })
}

const cancelRepairRequest = (id, mobile) => {
  return request({
    url: `/repair-requests/${id}/cancel`,
    method: 'POST',
    data: { mobile }
  })
}

// ===== 商城 =====
const getCategories = () => {
  return request({
    url: '/product/categories',
    method: 'GET'
  })
}

const getProducts = (params) => {
  return request({
    url: '/products',
    method: 'GET',
    data: params
  })
}

const getProductDetail = (id) => {
  return request({
    url: `/products/${id}`,
    method: 'GET'
  })
}

// 购物车
const getCart = () => {
  return request({
    url: '/carts',
    method: 'GET'
  })
}

const addToCart = (data) => {
  return request({
    url: '/carts',
    method: 'POST',
    data
  })
}

const updateCart = (data) => {
  return request({
    url: '/carts',
    method: 'PUT',
    data
  })
}

const deleteCartItem = (id) => {
  return request({
    url: `/carts/${id}`,
    method: 'DELETE'
  })
}

// ===== 工单 =====
const getOrders = (params) => {
  return request({
    url: '/service/orders',
    method: 'GET',
    data: params
  })
}

const getOrderDetail = (id) => {
  return request({
    url: `/service/orders/${id}`,
    method: 'GET'
  })
}

// ===== 设备目录（需要登录） =====
const getDeviceCategories = () => {
  return request({
    url: '/product/deviceCategories',
    method: 'GET'
  })
}

const getDeviceBrands = (params) => {
  return request({
    url: '/device-brands',
    method: 'GET',
    data: params
  })
}

const getDeviceModels = (params) => {
  return request({
    url: '/device-models',
    method: 'GET',
    data: params
  })
}

// ===== 历史设备复用 =====
const getHistoryDevices = (phone) => {
  return publicRequest({
    url: '/repair-requests/history-devices?reporter_phone=' + phone,
    method: 'GET'
  })
}

// ===== 消息 =====
const getUnreadCount = () => {
  return request({
    url: '/message/unreadCount',
    method: 'GET'
  })
}

// ===== 其他 =====
const getRegions = () => {
  return request({
    url: '/regions',
    method: 'GET'
  })
}

const getCode = (data) => {
  return request({
    url: '/codes',
    method: 'POST',
    data
  })
}

const userLogin = (data) => {
  return request({
    url: '/user/login',
    method: 'POST',
    data
  })
}

const bindMobile = (data) => {
  return request({
    url: '/bind',
    method: 'POST',
    data
  })
}

module.exports = {
  wxLogin,
  getUserInfo,
  logout,
  submitRepairRequest,
  getRepairProgress,
  cancelRepairRequest,
  getCategories,
  getProducts,
  getProductDetail,
  getCart,
  addToCart,
  updateCart,
  deleteCartItem,
  getOrders,
  getOrderDetail,
  getDeviceCategories,
  getDeviceBrands,
  getDeviceModels,
  getHistoryDevices,
  getUnreadCount,
  getRegions,
  getCode,
  userLogin,
  bindMobile
}