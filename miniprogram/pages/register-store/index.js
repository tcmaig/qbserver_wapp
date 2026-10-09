Page({
  data: {
    districts: ['西湖区', '滨江区', '拱墅区', '上城区', '下城区', '江干区', '萧山区', '余杭区', '临平区', '钱塘区'],
    district: '',
    storeName: '',
    detail: ''
  },

  onDistrictChange(e) {
    const district = this.data.districts[e.detail.value]
    this.setData({
      district,
      storeName: `壹咖·${district}店`
    })
  },

  onNameInput(e) {
    this.setData({ storeName: e.detail.value })
  },

  onDetailInput(e) {
    this.setData({ detail: e.detail.value })
  },

  submitRegister() {
    const { district, storeName, detail } = this.data
    if (!district) { wx.showToast({ title: '请选择所在区域', icon: 'none' }); return }
    if (!storeName.trim()) { wx.showToast({ title: '请输入门店名称', icon: 'none' }); return }
    if (!detail.trim()) { wx.showToast({ title: '请输入详细地址', icon: 'none' }); return }

    wx.showToast({ title: '登记成功！', icon: 'success' })
    setTimeout(() => {
      wx.navigateBack()
    }, 1000)
  }
})