const { getCategories, getProducts, addToCart } = require('../../api/main.js')

Page({
  data: {
    allCategories: [],
    categoryMap: {},
    // 分类数据
    categories: [],
    mainKey: 0,
    mainCategory: null,
    subCategories: [],
    currentProducts: [],
    // 商品列表
    products: [],
    cartCount: 0,
    // 分页
    page: 1,
    hasMore: true,
    loading: false,
  },

  onLoad() {
    this.loadCategories()
    this.loadProducts()
  },

  onShow() {
    this.updateCartCount()
  },

  // ===== 加载分类 =====
  async loadCategories() {
    try {
      const res = await getCategories()
      if (res.success && res.data) {
        // 保存完整分类数据
        const allCategories = res.data
        // 一级分类：parent_id === -1
        const categories = allCategories.filter(item => item.parent_id === -1)
        
        // 构建分类映射（用于快速查找子分类）
        const categoryMap = {}
        allCategories.forEach(item => {
          categoryMap[item.id] = item
        })

        this.setData({
          allCategories: allCategories,
          categoryMap: categoryMap,
          categories: categories,
          mainKey: categories.length > 0 ? categories[0].id : 0,
          mainCategory: categories.length > 0 ? categories[0] : null
        })

        // 加载第一个分类的子分类
        if (categories.length > 0) {
          this.loadSubCategories(categories[0].id)
          this.loadProducts(categories[0].id)
        }
      }
    } catch (err) {
      console.error('加载分类失败', err)
    }
  },

  // ===== 加载子分类 =====
  loadSubCategories(categoryId) {
    // 从 allCategories 中查找
    const all = this.data.allCategories || []
    const main = all.find(item => item.id === categoryId)
    
    if (main && main.children) {
      this.setData({
        subCategories: main.children || []
      })
    } else {
      // 如果没有 children，从完整数据中找 parent_id = categoryId 的
      const children = all.filter(item => item.parent_id === categoryId)
      this.setData({
        subCategories: children
      })
    }
  },

  // ===== 加载商品 =====
  async loadProducts(categoryId) {
    if (this.data.loading) return
    this.setData({ loading: true })

    const params = {
      page: this.data.page,
      limit: 20
    }
    if (categoryId) {
      params.category_id = categoryId
    }

    try {
      const res = await getProducts(params)
      if (res.success && res.data) {
        const products = res.data.data || []
        const formatted = products.map(this.formatProduct)
        this.setData({
          products: formatted,
          hasMore: products.length >= 20,
          loading: false
        })
      }
    } catch (err) {
      console.error('加载商品失败', err)
      this.setData({ loading: false })
    }
  },

  // ===== 格式化商品数据 =====
  formatProduct(item) {
    // 处理价格（price 为 0 时显示"询价"）
    const price = item.price && item.price > 0 ? item.price : null
    // 提取规格显示
    let specText = ''
    if (item.specs && item.specs.length > 0) {
      const spec = item.specs[0]
      if (spec.value && spec.value.length > 0) {
        specText = spec.value.join(' / ')
      }
    }
    // 提取缩略图
    const thumbnail = item.thumbnail || (item.images && item.images[0]) || ''
    // 处理折扣（如果有原价）
    let discount = null
    if (item.orig_price && item.price && item.price < item.orig_price) {
      discount = Math.round((item.price / item.orig_price) * 10)
    }

    return {
      id: item.id,
      name: item.name,
      price: price,
      origPrice: item.orig_price,
      discount: discount,
      spec: specText || item.unit || '',
      sold: item.sold_nums || 0,
      stock: item.stock || 0,
      thumbnail: thumbnail,
      images: item.images || [],
      categoryId: item.category_id,
      desc: item.desc || '',
      buyableLimit: item.buyable_limit || 99999
    }
  },

  // ===== 切换主分类 =====
  selectMain(e) {
    const key = e.currentTarget.dataset.key
    const category = this.data.categories.find(c => c.id === key)
    if (category) {
      this.setData({
        mainKey: key,
        mainCategory: category
      })
      this.loadSubCategories(key)
      this.setData({ page: 1, products: [] })
      this.loadProducts(key)
    }
  },

  // ===== 点击子分类 =====
  openSubCategory(e) {
    const id = e.currentTarget.dataset.id
    const title = e.currentTarget.dataset.title
    // 跳转到分类商品页
    wx.navigateTo({
      url: `/pages/mall-products/index?categoryId=${id}&title=${title}`
    })
  },

  // 点击商品进入详情
  goToProductDetail(e) {
    const id = e.currentTarget.dataset.id
    console.log('点击商品ID:', id)  // 加日志看看有没有触发
    if (id) {
      wx.navigateTo({
        url: `/pages/product-detail/index?id=${id}`
      })
    } else {
      wx.showToast({ title: '商品ID不存在', icon: 'none' })
    }
  },

  // ===== 加入购物车 =====
  async addToCart(e) {
    e.stopPropagation()
    const id = e.currentTarget.dataset.id
    const product = this.data.products.find(p => p.id === id)
    if (!product) return

    try {
      const res = await addToCart({
        product_id: id,
        quantity: 1,
        spec_value_id: null  // 无规格商品
      })
      if (res.success) {
        wx.showToast({ title: '已加入购物车', icon: 'success' })
        this.updateCartCount()
      } else {
        wx.showToast({ title: res.message || '加入失败', icon: 'none' })
      }
    } catch (err) {
      console.error('加入购物车失败', err)
      wx.showToast({ title: '加入失败', icon: 'none' })
    }
  },

  // ===== 更新购物车数量 =====
  updateCartCount() {
    const cart = wx.getStorageSync('mallCart') || {}
    let count = 0
    for (let key in cart) {
      count += cart[key]
    }
    this.setData({ cartCount: count })
  },

  // ===== 跳转购物车 =====
  goToCart() {
    wx.navigateTo({
      url: '/pages/cart/index'
    })
  }
})