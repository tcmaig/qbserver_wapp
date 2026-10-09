Page({
  data: {
    messages: [
      {
        id: 'MSG001',
        title: '维修完成提醒',
        content: '您的工单 WO20260814003 已完成维修，请及时验收评价。',
        time: '10:30',
        unread: true,
        orderId: 'WO20260814003',
        type: 'finish',
        icon: '✅'
      },
      {
        id: 'MSG002',
        title: '工单已派单',
        content: '李师傅已接单，预计 30 分钟内到达。',
        time: '昨天 14:00',
        unread: true,
        orderId: 'WO20260812002',
        type: 'assign',
        icon: '📋'
      },
      {
        id: 'MSG003',
        title: '工单审核通过',
        content: '您的报修已审核通过，正在派单中...',
        time: '昨天 11:00',
        unread: false,
        orderId: 'WO20260813006',
        type: 'audit',
        icon: '✅'
      }
    ]
  },

  goToDetail(e) {
    const orderId = e.currentTarget.dataset.orderid
    wx.navigateTo({ url: `/pages/order-detail/index?id=${orderId}` })
  }
})