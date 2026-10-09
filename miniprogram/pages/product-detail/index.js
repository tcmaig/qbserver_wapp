Page({
  data: {
    product: {},
    cartCount: 0,
    cart: {}
  },

  onLoad(options) {
    const id = options.id
    this.loadProduct(id)
    this.loadCart()
  },

  onShow() {
    this.loadCart()
  },

  loadProduct(id) {
    // 模拟商品数据
    const products = {
      'M001': { id: 'M001', name: '空调启动电容 35μF', price: 28, originalPrice: 35, icon: '⚡', bg: 'sky-50', spec: 'CBB65A/35μF', sold: 128, inStock: true, discount: 8, detail: '高品质空调启动电容，适用于多种空调压缩机，使用寿命长，稳定性好。' },
      'M002': { id: 'M002', name: '空调制冷剂 R410A', price: 88, originalPrice: 108, icon: '❄️', bg: 'cyan-50', spec: '450g/瓶', sold: 76, inStock: true, discount: 8, detail: '环保型R410A制冷剂，适用于新型空调系统，制冷效果优异。' },
      'M003': { id: 'M003', name: '空调滤网清洗剂', price: 22, originalPrice: 0, icon: '🧴', bg: 'emerald-50', spec: '500ml/瓶', sold: 231, inStock: true, detail: '强力去污配方，深层清洁空调滤网，去除灰尘和细菌，保持空调高效运行。' },
      'M004': { id: 'M004', name: 'LED 日光灯管 1.2m', price: 16, originalPrice: 20, icon: '💡', bg: 'amber-50', spec: 'T8/18W 白光', sold: 315, inStock: true, discount: 8, detail: '高亮度LED灯管，节能环保，使用寿命长达25000小时，光线柔和无频闪。' }
    }
    this.setData({ product: products[id] || products['M001'] })
  },

  loadCart() {
    const cart = wx.getStorageSync('mallCart') || {}
    let count = 0
    for (let key in cart) {
      count += cart[key]
    }
    this.setData({ cart, cartCount: count })
  },

  addToCart() {
    const id = this.data.product.id
    const cart = this.data.cart
    cart[id] = (cart[id] || 0) + 1
    wx.setStorageSync('mallCart', cart)
    this.setData({ cart })
    this.loadCart()
    wx.showToast({ title: '已加入购物车', icon: 'success' })
  },

  buyNow() {
    wx.showToast({ title: '功能开发中', icon: 'none' })
  },

  goToCart() {
    wx.showToast({ title: '购物车开发中', icon: 'none' })
  }
})