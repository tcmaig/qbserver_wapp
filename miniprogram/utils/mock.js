// 工单数据
const workOrders = [
  {
    id: 'WO20260814003',
    title: '3楼空调不制冷',
    storeId: 'ST001',
    location: 'A栋 3楼 301',
    urgency: 3,
    status: 4,
    createdAt: '2026-08-14 09:20',
    contactName: '张三',
    contactPhone: '138****8888',
    technician: { name: '李师傅', phone: '139****6688' }
  },
  {
    id: 'WO20260814001',
    title: '洗手间水龙头漏水',
    storeId: 'ST001',
    location: 'B栋 2楼 205',
    urgency: 2,
    status: 3,
    createdAt: '2026-08-14 08:05',
    contactName: '张三',
    contactPhone: '138****8888',
    technician: { name: '王师傅', phone: '137****5521' }
  },
  {
    id: 'WO20260813006',
    title: '前台电路跳闸',
    storeId: 'ST001',
    location: 'C栋 1楼 前台',
    urgency: 4,
    status: 1,
    createdAt: '2026-08-13 17:40',
    contactName: '李四',
    contactPhone: '136****3321'
  },
  {
    id: 'WO20260812002',
    title: '仓库门锁损坏',
    storeId: 'ST001',
    location: 'D栋 仓库 101',
    urgency: 2,
    status: 2,
    createdAt: '2026-08-12 14:15',
    contactName: '王五',
    contactPhone: '135****9908',
    technician: { name: '刘师傅', phone: '133****4477' }
  },
  {
    id: 'WO20260810005',
    title: '走廊灯闪烁',
    storeId: 'ST001',
    location: 'A栋 2楼 走廊',
    urgency: 1,
    status: 0,
    createdAt: '2026-08-10 10:00',
    contactName: '赵六',
    contactPhone: '134****1122'
  },
  {
    id: 'WO20260809007',
    title: '电梯运行异响',
    storeId: 'ST001',
    location: 'B栋 1楼 电梯厅',
    urgency: 3,
    status: 5,
    createdAt: '2026-08-09 09:30',
    contactName: '张三',
    contactPhone: '138****8888',
    technician: { name: '李师傅', phone: '139****6688' }
  }
]

module.exports = {
  workOrders: workOrders
}