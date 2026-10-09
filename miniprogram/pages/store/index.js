Page({
  data: {
    stores: [
      { id: 'ST001', name: '壹咖·万象城店', address: '杭州市西湖区文三路100号万象城3F', distance: '1.2km', phone: '0571-88001234', bound: true },
      { id: 'ST002', name: '壹咖·滨江天街店', address: '杭州市滨江区江汉路1515号天街2F', distance: '3.8km', phone: '0571-86665566', bound: false },
      { id: 'ST003', name: '壹咖·城西银泰店', address: '杭州市拱墅区丰潭路380号银泰城1F', distance: '5.6km', phone: '0571-88997788', bound: false },
      { id: 'ST004', name: '壹咖·钱江新城店', address: '杭州市上城区钱江路1366号来福士B1', distance: '7.9km', phone: '0571-88002345', bound: false }
    ]
  },

  bindStore(e) {
    const id = e.currentTarget.dataset.id
    const stores = this.data.stores.map(s => ({
      ...s,
      bound: s.id === id
    }))
    this.setData({ stores })
    wx.setStorageSync('boundStoreId', id)
    wx.showToast({ title: '绑定成功', icon: 'success' })
  },

  goToRegister() {
    wx.navigateTo({ url: '/pages/register-store/index' })
  }
})