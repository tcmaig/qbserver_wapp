Page({
  data: {
    cartCount: 0,
    categories: [
      { key: 'ac', label: '空调配件' },
      { key: 'consumable', label: '清洗耗材' },
      { key: 'lamp', label: '灯具照明' },
      { key: 'pipe', label: '水暖管件' },
      { key: 'tool', label: '维修工具' }
    ],
    mainKey: 'ac',
    currentMain: {
      subs: [
        {
          key: 'ac-capacitor',
          label: '电容类',
          leaves: [
            { key: 'ac-cap-start', label: '启动电容', icon: '⚡', bg: 'sky-50' },
            { key: 'ac-cap-run', label: '运行电容', icon: '⚙️', bg: 'blue-50' }
          ]
        },
        {
          key: 'ac-refrigerant',
          label: '制冷剂',
          leaves: [{ key: 'ac-gas-r410a', label: 'R410A', icon: '❄️', bg: 'cyan-50' }]
        },
        {
          key: 'ac-filter',
          label: '滤网风叶',
          leaves: [{ key: 'ac-filter', label: '滤网', icon: '🌀', bg: 'sky-50' }]
        }
      ]
    },
    // 商品数据
    products: [
      { id: 'M001', name: '空调启动电容', price: 28, originalPrice: 35, icon: '⚡', bg: 'sky-50', spec: '35μF', sold: 128, discount: 8 },
      { id: 'M002', name: '空调制冷剂', price: 88, originalPrice: 108, icon: '❄️', bg: 'cyan-50', spec: 'R410A', sold: 76, discount: 8 },
      { id: 'M003', name: '滤网清洗剂', price: 22, icon: '🧴', bg: 'emerald-50', spec: '500ml', sold: 231 },
      { id: 'M004', name: 'LED灯管', price: 16, originalPrice: 20, icon: '💡', bg: 'amber-50', spec: '1.2m', sold: 315, discount: 8 }
    ]
  },

  selectMain(e) {
    const key = e.currentTarget.dataset.key
    this.setData({ mainKey: key })
    // 实际开发中根据 key 加载对应的 subs
  },

  openSubCategory(e) {
    const key = e.currentTarget.dataset.key
    wx.navigateTo({ url: `/pages/mall-products/index?subKey=${key}` })
  },

  openLeaf(e) {
    const key = e.currentTarget.dataset.key
    const title = e.currentTarget.dataset.title
    wx.navigateTo({ url: `/pages/mall-products/index?leafKey=${key}&title=${title}` })
  },

  goToCart() {
    wx.showToast({ title: '购物车开发中', icon: 'none' })
  },

  onShow() {
    // 更新购物车数量
    this.updateCartCount()
  },

  updateCartCount() {
    // 从本地存储获取购物车数据
    const cart = wx.getStorageSync('mallCart') || {}
    let count = 0
    for (let key in cart) {
      count += cart[key]
    }
    this.setData({ cartCount: count })
  },

  // 点击商品进入详情
  goToProductDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/product-detail/index?id=${id}` })
  },

  // 加入购物车
  addToCart(e) {
    e.stopPropagation()
    const id = e.currentTarget.dataset.id
    // ... 购物车逻辑 ...
    wx.showToast({ title: '已加入购物车', icon: 'success' })
  }
})