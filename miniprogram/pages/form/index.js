const {
  submitRepairRequest,
  getDeviceCategories,
  getDeviceBrands,
  getDeviceModels,
  getHistoryDevices
} = require('../../api/main.js')

Page({
  data: {
    // ===== 步骤 =====
    step: 1,
    // ===== 历史设备复用 =====
    showHistoryTip: false,
    historyDevices: [],
    isReusing: false,

    // ===== 设备目录数据 =====
    categories: [],
    filteredCategories: [],
    keyword: '',
    selectedCategory: '',
    selectedCategoryName: '',
    selectedCategoryId: '',

    // ===== 品牌数据 =====
    brandList: [],
    brandKeyword: '',
    filteredBrands: [],
    selectedBrand: '',
    selectedBrandName: '',
    selectedBrandId: '',
    brandOther: '',

    // ===== 型号数据 =====
    modelList: [],
    modelKeyword: '',
    filteredModels: [],
    selectedModel: '',
    selectedModelName: '',
    selectedModelId: '',
    modelOther: '',

    // ===== 表单数据 =====
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
    ]
  },

  onLoad() {
    // 填充联系人信息
    const user = wx.getStorageSync('user') || {}
    this.setData({
      contactName: user.nickname || user.name || '',
      contactPhone: user.mobile || user.phone || ''
    })
    this.loadCategories()
    this.checkHistoryDevices()
  },

  // ===== 历史设备复用 =====
  async checkHistoryDevices() {
    const token = wx.getStorageSync('token')
    if (!token) return

    try {
      const data = await getHistoryDevices()
      if (data.success && data.data && data.data.length > 0) {
        const devices = data.data.map(item => ({
          id: item.id,
          category: item.category || item.device_type || '设备',
          brand: item.brand || '',
          model: item.model || '',
          time: item.created_at || item.time || '',
          orderId: item.order_id || item.id
        }))
        this.setData({
          historyDevices: devices,
          showHistoryTip: true
        })
      }
    } catch (err) {
      console.error('获取历史设备失败', err)
    }
  },

  reuseDevice(e) {
    const index = e.currentTarget.dataset.index
    const device = this.data.historyDevices[index]

    this.setData({
      showHistoryTip: false,
      selectedCategoryName: device.category,
      selectedBrandName: device.brand,
      selectedModelName: device.model,
      step: 4
    })

    wx.showToast({ title: '已复用设备信息', icon: 'success' })
  },

  skipHistory() {
    this.setData({ showHistoryTip: false })
  },

  closeHistoryTip() {
    this.setData({ showHistoryTip: false })
  },

  // ===== 加载品类 =====
  async loadCategories() {
    wx.showLoading({ title: '加载中...' })

    try {
      const data = await getDeviceCategories()
      wx.hideLoading()

      if (data.success && data.data && data.data.length > 0) {
        const categories = data.data.map(item => ({
          id: item.id,
          name: item.name,
          icon: item.icon || '📦',
          bg: item.bg_color || '#F5F5F5'
        }))
        this.setData({
          categories: categories,
          filteredCategories: categories
        })
      } else {
        // 后端无数据时使用默认数据
        this.setData({
          categories: this.getDefaultCategories(),
          filteredCategories: this.getDefaultCategories()
        })
      }
    } catch (err) {
      wx.hideLoading()
      console.error('加载品类失败', err)
      // 接口报错时使用默认数据
      this.setData({
        categories: this.getDefaultCategories(),
        filteredCategories: this.getDefaultCategories()
      })
    }
  },

  getDefaultCategories() {
    return [
      { id: 'c1', name: '空调', icon: '❄️', bg: '#E3F2FD' },
      { id: 'c2', name: '冰箱', icon: '🧊', bg: '#E8F5E9' },
      { id: 'c3', name: '洗衣机', icon: '👕', bg: '#F3E5F5' },
      { id: 'c4', name: '热水器', icon: '🔥', bg: '#FFF3E0' },
      { id: 'c5', name: '照明', icon: '💡', bg: '#FFF8E1' },
      { id: 'c6', name: '电梯', icon: '🛗', bg: '#E0F2F1' },
      { id: 'c7', name: '门禁', icon: '🚪', bg: '#E8EAF6' },
      { id: 'c8', name: '网络', icon: '📶', bg: '#E1F5FE' },
      { id: 'c9', name: '管道', icon: '🔧', bg: '#FBE9E7' },
      { id: 'c10', name: '电力', icon: '⚡', bg: '#FFF8E1' },
      { id: 'c11', name: '家具', icon: '🪑', bg: '#EFEBE9' },
      { id: 'c12', name: '其他', icon: '📦', bg: '#ECEFF1' }
    ]
  },

  // ===== 品类搜索 =====
  onSearchInput(e) {
    const keyword = e.detail.value.trim()
    this.setData({ keyword })
    this.filterCategories(keyword)
  },

  filterCategories(keyword) {
    const list = this.data.categories
    if (!keyword) {
      this.setData({ filteredCategories: list })
      return
    }
    const filtered = list.filter(item => item.name.includes(keyword))
    this.setData({ filteredCategories: filtered })
  },

  clearSearch() {
    this.setData({ keyword: '' })
    this.filterCategories('')
  },

  selectCategory(e) {
    const id = e.currentTarget.dataset.id
    const item = this.data.categories.find(c => c.id === id)
    this.setData({
      selectedCategory: id,
      selectedCategoryName: item.name,
      selectedCategoryId: id
    })
    this.loadBrands(id)
  },

  // ===== 加载品牌 =====
  async loadBrands(categoryId) {
    wx.showLoading({ title: '加载品牌...' })

    try {
      const data = await getDeviceBrands(categoryId)
      wx.hideLoading()

      let brandList = ['其他']
      if (data.success && data.data) {
        brandList = data.data.map(item => item.name)
        if (!brandList.includes('其他')) {
          brandList.push('其他')
        }
      }

      this.setData({
        step: 2,
        brandList: brandList,
        filteredBrands: brandList,
        brandKeyword: '',
        selectedBrand: '',
        selectedBrandName: '',
        selectedBrandId: '',
        brandOther: ''
      })
    } catch (err) {
      wx.hideLoading()
      console.error('加载品牌失败', err)
      // 使用默认品牌
      const defaultBrands = ['格力', '美的', '海尔', '其他']
      this.setData({
        step: 2,
        brandList: defaultBrands,
        filteredBrands: defaultBrands,
        brandKeyword: '',
        selectedBrand: '',
        selectedBrandName: '',
        selectedBrandId: '',
        brandOther: ''
      })
    }
  },

  // ===== 品牌操作 =====
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
    // 如果不是"其他"，加载型号
    if (name !== '其他') {
      this.loadModels(name)
    } else {
      this.goToStep3()
    }
  },

  onBrandOtherInput(e) {
    const value = e.detail.value.trim()
    this.setData({
      brandOther: value,
      selectedBrand: '',
      selectedBrandName: ''
    })
    if (value) {
      // 自定义品牌直接进入第三步
      this.setData({
        step: 3,
        modelList: ['其他'],
        filteredModels: ['其他']
      })
    }
  },

  // ===== 加载型号 =====
  async loadModels(brandName) {
    wx.showLoading({ title: '加载型号...' })

    try {
      // 需要先获取品牌ID，然后查询型号
      // 简化：使用本地映射
      const modelMap = {
        '格力': ['KFR-35GW', 'KFR-50LW', 'KFR-72LW', '其他'],
        '美的': ['KFR-35GW', 'KFR-51LW', 'KFR-72LW', '其他'],
        '海尔': ['KFR-35GW', 'KFR-50LW', 'KFR-72LW', '其他']
      }
      const modelList = modelMap[brandName] || ['其他']

      wx.hideLoading()
      this.setData({
        step: 3,
        modelList: modelList,
        filteredModels: modelList,
        modelKeyword: '',
        selectedModel: '',
        selectedModelName: '',
        modelOther: ''
      })
    } catch (err) {
      wx.hideLoading()
      console.error('加载型号失败', err)
      this.setData({
        step: 3,
        modelList: ['其他'],
        filteredModels: ['其他']
      })
    }
  },

  // ===== 型号操作 =====
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
    this.goToStep4()
  },

  onModelOtherInput(e) {
    const value = e.detail.value.trim()
    this.setData({
      modelOther: value,
      selectedModel: '',
      selectedModelName: ''
    })
    if (value) {
      this.goToStep4()
    }
  },

  // ===== 步骤切换 =====
  goToStep1() {
    this.setData({ step: 1 })
  },

  goToStep2() {
    // 如果已有品牌数据，直接进入
    if (this.data.selectedBrandName) {
      this.setData({ step: 2 })
    }
  },

  goToStep3() {
    if (this.data.selectedBrandName || this.data.brandOther) {
      this.setData({ step: 3 })
    }
  },

  goToStep4() {
    if (this.data.selectedModelName || this.data.modelOther) {
      this.setData({ step: 4 })
    }
  },

  // ===== 表单输入 =====
  onTitleInput(e) {
    this.setData({ title: e.detail.value })
  },

  onDescInput(e) {
    this.setData({ desc: e.detail.value })
  },

  selectUrgency(e) {
    this.setData({ urgency: e.currentTarget.dataset.key })
  },

  // ===== 图片上传 =====
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

  // ===== 定位 =====
  getLocation() {
    wx.showLoading({ title: '定位中...' })
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        wx.hideLoading()
        // 逆地理编码（需要腾讯地图Key）
        wx.request({
          url: 'https://apis.map.qq.com/ws/geocoder/v1/',
          data: {
            location: `${res.latitude},${res.longitude}`,
            key: '你的腾讯地图Key',
            get_poi: 0
          },
          success: (res) => {
            if (res.data.status === 0) {
              this.setData({
                locationAddress: res.data.result.address,
                locationText: '已定位成功'
              })
              wx.showToast({ title: '定位成功', icon: 'success' })
            }
          },
          fail: () => {
            this.setData({
              locationAddress: `经度:${res.longitude.toFixed(6)}, 纬度:${res.latitude.toFixed(6)}`,
              locationText: '已定位（坐标）'
            })
            wx.showToast({ title: '定位成功', icon: 'success' })
          }
        })
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({ title: '定位失败，请手动输入', icon: 'none' })
      }
    })
  },

  onAddressDetailInput(e) {
    this.setData({ addressDetail: e.detail.value })
  },

  onContactNameInput(e) {
    this.setData({ contactName: e.detail.value })
  },

  onContactPhoneInput(e) {
    this.setData({ contactPhone: e.detail.value })
  },

  // ===== 提交报修 =====
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

    const fullAddress = locationAddress + (addressDetail ? ' ' + addressDetail : '')

    wx.showLoading({ title: '提交中...' })

    // 上传图片
    const uploadPromises = images.map((path) => {
      return new Promise((resolve, reject) => {
        wx.uploadFile({
          url: 'https://你的域名/api/upload',
          filePath: path,
          name: 'file',
          success: (res) => {
            try {
              const data = JSON.parse(res.data)
              resolve(data.url || data.path || '')
            } catch {
              resolve('')
            }
          },
          fail: reject
        })
      })
    })

    const doSubmit = (imageUrls) => {
      const postData = {
        reporter_name: contactName.trim(),
        reporter_phone: contactPhone.trim(),
        device_type_name: selectedCategoryName || '其他',
        device_brand_name: brand || '其他',
        device_model_name: model || '其他',
        fault_description: desc.trim(),
        address: fullAddress || '未填写'
      }
    
      // 如果有图片
      if (imageUrls && imageUrls.length > 0) {
        postData.images = imageUrls
      }
    
      // 如果有坐标
      if (this.data.latitude) {
        postData.location_lat = this.data.latitude
        postData.location_lng = this.data.longitude
      }
    
      console.log('【提交数据】', postData)
    
      submitRepairRequest(postData).then(data => {
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
        console.error('提交失败', err)
        wx.showToast({ title: '提交失败，请重试', icon: 'none' })
      })
    }

    if (images.length > 0) {
      Promise.all(uploadPromises)
        .then((imageUrls) => {
          doSubmit(imageUrls.filter(url => url))
        })
        .catch(() => {
          wx.hideLoading()
          wx.showToast({ title: '图片上传失败，请重试', icon: 'none' })
        })
    } else {
      doSubmit([])
    }
  }
})