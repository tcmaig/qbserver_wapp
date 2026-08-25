const { request } = require('../../utils/request.js')

Page({
  data: {
    // ===== 步骤: 1=选品类, 2=选品牌, 3=选型号, 4=填信息 =====
    step: 1,

    // ===== 品类数据 =====
    categories: [],
    filteredCategories: [],
    keyword: '',
    selectedCategory: '',
    selectedCategoryName: '',
    categoryBrandMap: {},         // 存储品类对应的品牌数据（从接口获取后缓存）

    // ===== 品牌数据 =====
    brandData: [],
    brandList: [],
    brandKeyword: '',
    filteredBrands: [],
    selectedBrand: '',
    selectedBrandName: '',
    brandOther: '',

    // ===== 型号数据 =====
    modelData: [],
    modelList: [],
    modelKeyword: '',
    filteredModels: [],
    selectedModel: '',
    selectedModelName: '',
    modelOther: '',

    // ===== 表单数据 =====
    storeName: '壹咖·万象城店',
    title: '',
    desc: '',
    images: [],
    locationAddress: '',
    locationText: '',
    addressDetail: '',
    contactName: '',
    contactPhone: '',
    urgency: 2,
    urgencies: [
      { key: 1, label: '普通' },
      { key: 2, label: '一般' },
      { key: 3, label: '紧急' },
      { key: 4, label: '加急' }
    ],

    // ===== 图片上传 =====
    images: [],

    // ===== 地址 =====
    locationAddress: '',      // 定位地址
    locationText: '',         // 定位显示文本
    addressDetail: '',        // 手动输入详细地址

    // ===== 联系人 =====
    contactName: '',
    contactPhone: '',
  },

  // ================================================================
  // 生命周期
  // ================================================================

  onLoad() {
    this.setData({
      filteredCategories: this.data.categories,
      // 自动填充联系人（从缓存或用户信息获取）
      contactName: wx.getStorageSync('userName') || '张三',
      contactPhone: wx.getStorageSync('userPhone') || '138****8888'
    })
    this.loadCategories()          // 加载设备品类
  },
  // ================================================================
  // 第一步：选品类
  // ================================================================

  loadCategories() {
    wx.showLoading({ title: '加载中...' })

    request({
      url: '/store-devices',
      method: 'GET'
    }).then(data => {
      wx.hideLoading()

      if (data.success && data.data) {
        // 从接口返回的数据中提取设备类型列表
        // 假设接口返回格式：{ success: true, data: [ { id, name, icon, bg, brand_count }, ... ] }
        const categories = this.formatCategories(data.data)
        this.setData({
          categories: categories,
          filteredCategories: categories
        })
      } else {
        // 接口失败时使用默认数据
        this.setData({
          categories: this.getDefaultCategories(),
          filteredCategories: this.getDefaultCategories()
        })
      }
    }).catch(err => {
      wx.hideLoading()
      console.error('加载品类失败', err)
      // 接口失败时使用默认数据
      this.setData({
        categories: this.getDefaultCategories(),
        filteredCategories: this.getDefaultCategories()
      })
    })
  },

  // 格式化接口返回的品类数据
  formatCategories(data) {
    // 根据你的实际接口返回格式调整
    // 假设接口返回: [ { id, name, icon, bg_color, brand_list: [...] } ]
    const iconMap = {
      '空调': '❄️', '冰箱': '🧊', '洗衣机': '👕', '热水器': '🔥',
      '照明': '💡', '电梯': '🛗', '门禁': '🚪', '网络': '📶',
      '管道': '🔧', '电力': '⚡', '家具': '🪑', '其他': '📦'
    }
    const bgMap = {
      '空调': '#E3F2FD', '冰箱': '#E8F5E9', '洗衣机': '#F3E5F5',
      '热水器': '#FFF3E0', '照明': '#FFF8E1', '电梯': '#E0F2F1',
      '门禁': '#E8EAF6', '网络': '#E1F5FE', '管道': '#FBE9E7',
      '电力': '#FFF8E1', '家具': '#EFEBE9', '其他': '#ECEFF1'
    }

    return data.map(item => ({
      id: item.id || item.category_id,
      name: item.name || item.category_name,
      icon: item.icon || iconMap[item.name] || '📦',
      bg: item.bg_color || bgMap[item.name] || '#F5F5F5',
      // 如果接口返回了品牌列表，存下来
      brands: item.brands || item.brand_list || []
    }))
  },

  // 默认品类数据（接口失败时使用）
  getDefaultCategories() {
    return [
      { id: 'c1', name: '空调', icon: '❄️', bg: '#E3F2FD', brands: [] },
      { id: 'c2', name: '冰箱', icon: '🧊', bg: '#E8F5E9', brands: [] },
      { id: 'c3', name: '洗衣机', icon: '👕', bg: '#F3E5F5', brands: [] },
      { id: 'c4', name: '热水器', icon: '🔥', bg: '#FFF3E0', brands: [] },
      { id: 'c5', name: '照明', icon: '💡', bg: '#FFF8E1', brands: [] },
      { id: 'c6', name: '电梯', icon: '🛗', bg: '#E0F2F1', brands: [] },
      { id: 'c7', name: '门禁', icon: '🚪', bg: '#E8EAF6', brands: [] },
      { id: 'c8', name: '网络', icon: '📶', bg: '#E1F5FE', brands: [] },
      { id: 'c9', name: '管道', icon: '🔧', bg: '#FBE9E7', brands: [] },
      { id: 'c10', name: '电力', icon: '⚡', bg: '#FFF8E1', brands: [] },
      { id: 'c11', name: '家具', icon: '🪑', bg: '#EFEBE9', brands: [] },
      { id: 'c12', name: '其他', icon: '📦', bg: '#ECEFF1', brands: [] }
    ]
  },

  onSearchInput(e) {
    const keyword = e.detail.value.trim()
    this.setData({ keyword })
    this.filterCategories(keyword)
  },

  clearSearch() {
    this.setData({ keyword: '' })
    this.filterCategories('')
  },

  filterCategories(keyword) {
    if (!keyword) {
      this.setData({ filteredCategories: this.data.categories })
      return
    }
    const filtered = this.data.categories.filter(item =>
      item.name.includes(keyword)
    )
    this.setData({ filteredCategories: filtered })
  },

  // 选择品类
  selectCategory(e) {
    const id = e.currentTarget.dataset.id
    const item = this.data.categories.find(c => c.id === id)

    // 如果品类自带品牌列表，直接用；否则从接口获取
    let brandList = item.brands || []
    if (brandList.length > 0) {
      this.setData({
        selectedCategory: id,
        selectedCategoryName: item.name,
        categoryBrandMap: {
          ...this.data.categoryBrandMap,
          [id]: brandList
        }
      })
    } else {
      // 从接口获取该品类的品牌列表
      this.loadBrandsByCategory(id, item.name)
    }
  },

  // 根据品类获取品牌列表
  loadBrandsByCategory(categoryId, categoryName) {
    wx.showLoading({ title: '加载品牌...' })

    request({
      url: `/nova-suppliers/${categoryId}/devices`,
      method: 'GET'
    }).then(data => {
      wx.hideLoading()
      let brandList = ['其他']
      if (data.success && data.data) {
        // 假设接口返回品牌列表: [ { id, name }, ... ]
        brandList = data.data.map(item => item.name || item.brand_name)
        // 去重并保留"其他"
        brandList = [...new Set(brandList)]
        if (!brandList.includes('其他')) {
          brandList.push('其他')
        }
      }

      // 缓存品牌数据
      const map = this.data.categoryBrandMap
      map[categoryId] = brandList

      this.setData({
        selectedCategory: categoryId,
        selectedCategoryName: categoryName,
        categoryBrandMap: map
      })

      // 自动进入第二步
      this.goToStep2()
    }).catch(err => {
      wx.hideLoading()
      console.error('加载品牌失败', err)
      // 失败时使用默认品牌
      const defaultBrands = ['格力', '美的', '海尔', '其他']
      const map = this.data.categoryBrandMap
      map[categoryId] = defaultBrands
      this.setData({
        selectedCategory: categoryId,
        selectedCategoryName: categoryName,
        categoryBrandMap: map
      })
      this.goToStep2()
    })
  },

  goToStep2() {
    const categoryId = this.data.selectedCategory
    const brandList = this.data.categoryBrandMap[categoryId] || ['其他']
    this.setData({
      step: 2,
      brandList: brandList,
      filteredBrands: brandList,
      brandKeyword: '',
      selectedBrand: '',
      selectedBrandName: '',
      brandOther: ''
    })
  },

  // ================================================================
  // 第二步：选品牌
  // ================================================================

  onBrandSearch(e) {
    const keyword = e.detail.value.trim()
    this.setData({ brandKeyword: keyword })
    this.filterBrands(keyword)
  },

  filterBrands(keyword) {
    const list = this.data.brandList
    if (!keyword) {
      this.setData({ filteredBrands: list })
      return
    }
    const filtered = list.filter(item => item.includes(keyword))
    this.setData({ filteredBrands: filtered })
  },

  clearBrandSearch() {
    this.setData({ brandKeyword: '' })
    this.filterBrands('')
  },

  selectBrand(e) {
    const name = e.currentTarget.dataset.name
    this.setData({
      selectedBrand: name,
      selectedBrandName: name,
      brandOther: ''
    })
  },

  onBrandOtherInput(e) {
    const value = e.detail.value.trim()
    this.setData({
      brandOther: value,
      selectedBrand: '',
      selectedBrandName: ''
    })
  },

  goToStep3() {
    const brandName = this.data.selectedBrandName || this.data.brandOther
    if (!brandName) return

    // 如果品牌是"其他"，直接进入第三步，不请求接口
    if (brandName === '其他') {
      this.setData({
        step: 3,
        modelList: ['其他'],
        filteredModels: ['其他'],
        modelKeyword: '',
        selectedModel: '',
        selectedModelName: '',
        modelOther: ''
      })
      return
    }

    // 根据品牌获取型号列表
    this.loadModelsByBrand(brandName)
  },

  // 根据品牌获取型号列表
  loadModelsByBrand(brandName) {
    wx.showLoading({ title: '加载型号...' })

    request({
      url: `/store-devices/sn/${encodeURIComponent(brandName)}`,
      method: 'GET'
    }).then(data => {
      wx.hideLoading()
      let modelList = ['其他']
      if (data.success && data.data) {
        // 假设接口返回型号列表
        modelList = data.data.map(item => item.model || item.sn || item.name)
        modelList = [...new Set(modelList)]
        if (!modelList.includes('其他')) {
          modelList.push('其他')
        }
      }

      this.setData({
        step: 3,
        modelList: modelList,
        filteredModels: modelList,
        modelKeyword: '',
        selectedModel: '',
        selectedModelName: '',
        modelOther: ''
      })
    }).catch(err => {
      wx.hideLoading()
      console.error('加载型号失败', err)
      // 失败时使用默认型号
      this.setData({
        step: 3,
        modelList: ['其他'],
        filteredModels: ['其他'],
        modelKeyword: '',
        selectedModel: '',
        selectedModelName: '',
        modelOther: ''
      })
    })
  },

  // ================================================================
  // 第三步：选型号
  // ================================================================

  onModelSearch(e) {
    const keyword = e.detail.value.trim()
    this.setData({ modelKeyword: keyword })
    this.filterModels(keyword)
  },

  filterModels(keyword) {
    const list = this.data.modelList
    if (!keyword) {
      this.setData({ filteredModels: list })
      return
    }
    const filtered = list.filter(item => item.includes(keyword))
    this.setData({ filteredModels: filtered })
  },

  clearModelSearch() {
    this.setData({ modelKeyword: '' })
    this.filterModels('')
  },

  selectModel(e) {
    const name = e.currentTarget.dataset.name
    this.setData({
      selectedModel: name,
      selectedModelName: name,
      modelOther: ''
    })
  },

  onModelOtherInput(e) {
    const value = e.detail.value.trim()
    this.setData({
      modelOther: value,
      selectedModel: '',
      selectedModelName: ''
    })
  },

  goToStep4() {
    const modelName = this.data.selectedModelName || this.data.modelOther
    if (!modelName) return
    this.setData({ step: 4 })
  },

  // ================================================================
  // 步骤切换
  // ================================================================

  goToStep1() {
    this.setData({ step: 1 })
  },

  // ================================================================
  // 第四步：填信息
  // ================================================================

  onTitleInput(e) {
    this.setData({ title: e.detail.value })
  },

  onDescInput(e) {
    this.setData({ desc: e.detail.value })
  },

  selectUrgency(e) {
    this.setData({ urgency: e.currentTarget.dataset.key })
  },

  submitForm() {
    const {
      selectedCategoryName,
      selectedBrandName,
      brandOther,
      selectedModelName,
      modelOther,
      title,
      desc,
      urgency,
      images,
      locationAddress,
      addressDetail,
      contactName,
      contactPhone
    } = this.data
  
    const brand = selectedBrandName || brandOther
    const model = selectedModelName || modelOther
  
    // 验证
    if (!title.trim()) {
      wx.showToast({ title: '请输入报修标题', icon: 'none' })
      return
    }
    if (desc.trim().length < 10) {
      wx.showToast({ title: '请详细描述故障（至少10字）', icon: 'none' })
      return
    }
    if (!contactName.trim()) {
      wx.showToast({ title: '请输入联系人姓名', icon: 'none' })
      return
    }
    if (!contactPhone.trim() || contactPhone.length < 11) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }
  
    // 完整地址
    const fullAddress = locationAddress + (addressDetail ? ' ' + addressDetail : '')
  
    wx.showLoading({ title: '提交中...' })
  
    // 先上传图片（如果有）
    const uploadPromises = images.map((path, index) => {
      return new Promise((resolve, reject) => {
        wx.uploadFile({
          url: '/repair-request',  // ⚠️ 替换为上传接口
          filePath: path,
          name: 'file',
          formData: { index: index },
          success: (res) => {
            const data = JSON.parse(res.data)
            resolve(data.url || data.path || '')
          },
          fail: reject
        })
      })
    })
  
    // 如果有图片，先上传再提交
    if (images.length > 0) {
      Promise.all(uploadPromises)
        .then((imageUrls) => {
          this.doSubmit(fullAddress, imageUrls)
        })
        .catch(() => {
          wx.hideLoading()
          wx.showToast({ title: '图片上传失败，请重试', icon: 'none' })
        })
    } else {
      this.doSubmit(fullAddress, [])
    }
  },
  
  // 实际提交
  doSubmit(fullAddress, imageUrls) {
    const {
      selectedCategoryName,
      selectedBrandName,
      brandOther,
      selectedModelName,
      modelOther,
      title,
      desc,
      urgency,
      contactName,
      contactPhone
    } = this.data
  
    const brand = selectedBrandName || brandOther
    const model = selectedModelName || modelOther
  
    request({
      url: '/repair-request',
      method: 'POST',
      data: {
        category: selectedCategoryName,
        brand: brand,
        model: model,
        title: title.trim(),
        description: desc.trim(),
        urgency: urgency,
        address: fullAddress,
        contact_name: contactName.trim(),
        contact_phone: contactPhone.trim(),
        images: imageUrls
      }
    }).then(data => {
      wx.hideLoading()
      if (data.success) {
        wx.showToast({ title: '提交成功！', icon: 'success' })
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      } else {
        wx.showToast({ title: data.message || '提交失败', icon: 'none' })
      }
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({ title: '网络请求失败', icon: 'none' })
    })
  },

  // ================================================================
  // 图片上传
  // ================================================================

  chooseImage() {
    const remain = 9 - this.data.images.length
    if (remain <= 0) {
      wx.showToast({ title: '最多上传9张图片', icon: 'none' })
      return
    }

    wx.chooseImage({
      count: remain,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newImages = this.data.images.concat(res.tempFilePaths)
        this.setData({ images: newImages })
      }
    })
  },

  deleteImage(e) {
    const index = e.currentTarget.dataset.index
    const images = this.data.images
    images.splice(index, 1)
    this.setData({ images: images })
  },

  // ================================================================
  // GPS 定位
  // ================================================================

  getLocation() {
    wx.showLoading({ title: '定位中...' })

    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        wx.hideLoading()
        // 逆地理编码：将经纬度转为地址
        this.reverseGeocode(res.latitude, res.longitude)
      },
      fail: (err) => {
        wx.hideLoading()
        console.error('定位失败', err)
        wx.showModal({
          title: '定位失败',
          content: '请检查定位权限，或手动输入地址',
          showCancel: false
        })
      }
    })
  },

  reverseGeocode(lat, lng) {
    // 使用微信内置逆地理编码（需要开通）
    wx.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/',
      data: {
        location: `${lat},${lng}`,
        key: '你的腾讯地图Key',  // ⚠️ 需要替换为你的Key
        get_poi: 0
      },
      success: (res) => {
        if (res.data.status === 0) {
          const address = res.data.result.address
          this.setData({
            locationAddress: address,
            locationText: '已定位成功'
          })
          wx.showToast({ title: '定位成功', icon: 'success' })
        } else {
          wx.showToast({ title: '地址解析失败', icon: 'none' })
        }
      },
      fail: () => {
        // 如果逆地理编码失败，至少显示坐标
        this.setData({
          locationAddress: `经度:${lng.toFixed(6)}, 纬度:${lat.toFixed(6)}`,
          locationText: '已定位（坐标）'
        })
        wx.showToast({ title: '定位成功（坐标）', icon: 'success' })
      }
    })
  },

  // ================================================================
  // 地址输入
  // ================================================================

  onAddressDetailInput(e) {
    this.setData({ addressDetail: e.detail.value })
  },

  // ================================================================
  // 联系人输入
  // ================================================================

  onContactNameInput(e) {
    this.setData({ contactName: e.detail.value })
  },

  onContactPhoneInput(e) {
    this.setData({ contactPhone: e.detail.value })
  },
})