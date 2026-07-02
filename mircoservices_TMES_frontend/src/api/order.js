/**
 * OMS 订单管理服务 - API层
 * 开发阶段使用Mock数据，后端就绪后切换至真实接口
 */
import { orders, genTimeline, channels } from '@/mock/order'

// 模拟网络延迟
function mockDelay(data, delay = 300) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ code: 200, data }), delay)
  })
}

/**
 * 获取订单列表（分页+筛选）
 */
export function getOrderList(params = {}) {
  const { page = 1, pageSize = 20, keyword, status, source, tempZone, priority, region } = params

  let filtered = [...orders]

  if (keyword) {
    const kw = keyword.toLowerCase()
    filtered = filtered.filter(o =>
      o.orderNo.toLowerCase().includes(kw) ||
      o.customerName.toLowerCase().includes(kw) ||
      o.externalOrderNo.toLowerCase().includes(kw)
    )
  }
  if (status) filtered = filtered.filter(o => o.status === status)
  if (source) filtered = filtered.filter(o => o.source === source)
  if (tempZone) filtered = filtered.filter(o => o.tempZones.includes(tempZone))
  if (priority) filtered = filtered.filter(o => o.priority === priority)
  if (region) filtered = filtered.filter(o => o.deliveryRegion === region)

  filtered.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))

  const total = filtered.length
  const start = (page - 1) * pageSize
  const records = filtered.slice(start, start + pageSize)

  return mockDelay({ records, total, page, pageSize })
}

/**
 * 获取订单详情
 */
export function getOrderDetail(id) {
  const order = orders.find(o => o.id === Number(id))
  if (!order) return mockDelay(null, 200)
  const timeline = genTimeline(order)
  return mockDelay({ ...order, timeline })
}

/**
 * 创建订单
 */
export function createOrder(data) {
  const newOrder = {
    id: orders.length + 1,
    orderNo: `TMS${Date.now()}`,
    externalOrderNo: data.externalOrderNo || `EXT${Math.floor(Math.random() * 900000 + 100000)}`,
    source: data.source || 'MANUAL',
    sourceName: '手工录入',
    status: 'PENDING',
    priority: data.priority || 'NORMAL',
    createTime: new Date().toISOString(),
    ...data,
  }
  orders.unshift(newOrder)
  return mockDelay(newOrder, 500)
}

/**
 * 批量分拨
 */
export function dispatchOrders(data) {
  const { orderIds } = data
  let successCount = 0
  orderIds.forEach(id => {
    const order = orders.find(o => o.id === Number(id))
    if (order && (order.status === 'PENDING' || order.status === 'VALIDATED')) {
      order.status = 'SPLITTING'
      successCount++
    }
  })
  return mockDelay({ successCount, totalCount: orderIds.length }, 800)
}

/**
 * 拆单
 */
export function splitOrder(id) {
  const order = orders.find(o => o.id === Number(id))
  if (!order) return mockDelay(null, 200)
  // 模拟拆单逻辑
  const splitResults = []
  if (order.tempZones.length > 1) {
    order.tempZones.forEach((zone, idx) => {
      splitResults.push({
        subOrderNo: `${order.orderNo}-${idx + 1}`,
        tempZone: zone,
        itemCount: order.items.filter(i => i.tempZone === zone).length,
        weight: order.items.filter(i => i.tempZone === zone).reduce((s, i) => s + i.weight, 0),
      })
    })
    order.status = 'DISPATCHED'
  }
  return mockDelay({ originalOrder: order.orderNo, splitResults }, 600)
}

/**
 * 获取渠道接入列表
 */
export function getChannels() {
  return mockDelay(channels)
}

/**
 * 获取统计概览
 */
export function getOrderStats() {
  const today = orders.filter(o => {
    const d = new Date(o.createTime)
    const now = new Date()
    return d.toDateString() === now.toDateString()
  })

  const stats = {
    total: orders.length,
    todayCount: today.length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    processing: orders.filter(o => ['VALIDATED', 'SPLITTING', 'DISPATCHED', 'PROCESSING'].includes(o.status)).length,
    inTransit: orders.filter(o => o.status === 'IN_TRANSIT').length,
    completed: orders.filter(o => o.status === 'COMPLETED').length,
    exception: orders.filter(o => o.status === 'EXCEPTION').length,
    // 温区分布
    tempZoneDist: {
      FROZEN: orders.filter(o => o.tempZones.includes('FROZEN')).length,
      COLD: orders.filter(o => o.tempZones.includes('COLD')).length,
      CONSTANT: orders.filter(o => o.tempZones.includes('CONSTANT')).length,
    },
    // 渠道分布
    sourceDist: {
      ERP: orders.filter(o => o.source === 'ERP').length,
      WMS: orders.filter(o => o.source === 'WMS').length,
      ECOMMERCE: orders.filter(o => o.source === 'ECOMMERCE').length,
      B2B: orders.filter(o => o.source === 'B2B').length,
      EDI: orders.filter(o => o.source === 'EDI').length,
    },
    // 区域分布
    regionDist: {},
    // 近7天趋势
    trend7d: [],
    // 优先级分布
    priorityDist: {
      HIGH: orders.filter(o => o.priority === 'HIGH').length,
      NORMAL: orders.filter(o => o.priority === 'NORMAL').length,
      LOW: orders.filter(o => o.priority === 'LOW').length,
    },
  }

  // 区域统计
  orders.forEach(o => {
    stats.regionDist[o.deliveryRegion] = (stats.regionDist[o.deliveryRegion] || 0) + 1
  })

  // 近7天趋势
  for (let i = 6; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000)
    const dateStr = date.toISOString().slice(0, 10)
    const dayOrders = orders.filter(o => o.createTime.slice(0, 10) === dateStr)
    stats.trend7d.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      total: dayOrders.length,
      completed: dayOrders.filter(o => o.status === 'COMPLETED').length,
      exception: dayOrders.filter(o => o.status === 'EXCEPTION').length,
    })
  }

  return mockDelay(stats, 400)
}

/**
 * 更新订单状态
 */
export function updateOrderStatus(id, status) {
  const order = orders.find(o => o.id === Number(id))
  if (order) order.status = status
  return mockDelay({ id, status }, 300)
}

/**
 * 取消订单
 */
export function cancelOrder(id, reason) {
  const order = orders.find(o => o.id === Number(id))
  if (order) {
    order.status = 'CANCELLED'
    order.remark = `取消原因: ${reason}`
  }
  return mockDelay({ id, status: 'CANCELLED' }, 300)
}
