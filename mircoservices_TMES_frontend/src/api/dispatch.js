/**
 * 智能调度服务 - API层
 * 开发阶段使用Mock数据，后端就绪后切换至真实接口
 */
import {
  vehicles, drivers, carriers,
  loadingPlans, routePlans, dispatchTasks, dynamicEvents, dispatchStats,
} from '@/mock/dispatch'

function mockDelay(data, delay = 300) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ code: 200, data }), delay)
  })
}

// ========== 运力资源管理 ==========

export function getVehicleList(params = {}) {
  const { page = 1, pageSize = 20, keyword, status, tempZone, ownership, region } = params
  let filtered = [...vehicles]
  if (keyword) {
    const kw = keyword.toLowerCase()
    filtered = filtered.filter(v =>
      v.vehicleNo.toLowerCase().includes(kw) ||
      v.driverName.includes(keyword) ||
      v.carrierName.includes(keyword)
    )
  }
  if (status) filtered = filtered.filter(v => v.status === status)
  if (tempZone) filtered = filtered.filter(v => v.tempZones.includes(tempZone))
  if (ownership) filtered = filtered.filter(v => v.ownership === ownership)
  if (region) filtered = filtered.filter(v => v.region === region)

  const total = filtered.length
  const start = (page - 1) * pageSize
  const records = filtered.slice(start, start + pageSize)
  return mockDelay({ records, total, page, pageSize })
}

export function getDriverList(params = {}) {
  const { page = 1, pageSize = 20, keyword, status } = params
  let filtered = [...drivers]
  if (keyword) {
    filtered = filtered.filter(d => d.name.includes(keyword) || d.phone.includes(keyword) || d.vehicleNo.includes(keyword))
  }
  if (status) filtered = filtered.filter(d => d.status === status)
  const total = filtered.length
  const start = (page - 1) * pageSize
  const records = filtered.slice(start, start + pageSize)
  return mockDelay({ records, total, page, pageSize })
}

export function getCarrierList() {
  return mockDelay(carriers)
}

// ========== AI智能配载 ==========

export function getLoadingPlanList(params = {}) {
  const { page = 1, pageSize = 20, keyword, status, tempZone } = params
  let filtered = [...loadingPlans]
  if (keyword) {
    filtered = filtered.filter(p => p.planNo.includes(keyword) || p.vehicleNo.includes(keyword) || p.driverName.includes(keyword))
  }
  if (status) filtered = filtered.filter(p => p.status === status)
  if (tempZone) filtered = filtered.filter(p => p.tempZones.includes(tempZone))
  const total = filtered.length
  const start = (page - 1) * pageSize
  const records = filtered.slice(start, start + pageSize)
  return mockDelay({ records, total, page, pageSize })
}

export function getLoadingPlanDetail(id) {
  const plan = loadingPlans.find(p => p.id === Number(id))
  return mockDelay(plan || null, 200)
}

export function generateLoadingPlan(orderIds) {
  // 模拟AI生成配载方案
  const plan = {
    id: loadingPlans.length + 1,
    planNo: `LOAD${String(loadingPlans.length + 1).padStart(4, '0')}`,
    vehicleNo: '沪A99999',
    vehicleType: '7.7米三温区车',
    driverName: 'AI推荐司机',
    totalWeight: randFloat(5, 10, 1),
    maxWeight: 10,
    weightRate: randFloat(70, 92, 1),
    totalVolume: randFloat(20, 38, 1),
    maxVolume: 38,
    volumeRate: randFloat(75, 95, 1),
    itemCount: orderIds?.length || rand(3, 8),
    tempZones: ['FROZEN', 'COLD'],
    items: [],
    partitionRequired: true,
    status: 'DRAFT',
    aiScore: randFloat(85, 97, 1),
    hasMixingWarning: false,
    estimatedCost: randFloat(1500, 3500, 0),
  }
  loadingPlans.unshift(plan)
  return mockDelay(plan, 1000)
}

export function confirmLoadingPlan(id) {
  const plan = loadingPlans.find(p => p.id === Number(id))
  if (plan) plan.status = 'CONFIRMED'
  return mockDelay({ id, status: 'CONFIRMED' }, 400)
}

// ========== AI路径规划 ==========

export function getRoutePlanList(params = {}) {
  const { page = 1, pageSize = 20, keyword, status } = params
  let filtered = [...routePlans]
  if (keyword) {
    filtered = filtered.filter(p => p.routeNo.includes(keyword) || p.vehicleNo.includes(keyword) || p.driverName.includes(keyword))
  }
  if (status) filtered = filtered.filter(p => p.status === status)
  const total = filtered.length
  const start = (page - 1) * pageSize
  const records = filtered.slice(start, start + pageSize)
  return mockDelay({ records, total, page, pageSize })
}

export function getRoutePlanDetail(id) {
  const plan = routePlans.find(p => p.id === Number(id))
  return mockDelay(plan || null, 200)
}

export function generateRoutePlan(loadingPlanId) {
  const plan = {
    id: routePlans.length + 1,
    routeNo: `RTE${String(routePlans.length + 1).padStart(4, '0')}`,
    vehicleNo: '沪A99999',
    driverName: 'AI推荐司机',
    stopCount: rand(2, 5),
    stops: [],
    totalDistance: randFloat(15, 120, 1),
    totalTime: rand(45, 240),
    status: 'DRAFT',
    aiScore: randFloat(80, 96, 1),
    fuelCost: randFloat(150, 600, 0),
    tollCost: randFloat(50, 200, 0),
    hasAlternative: true,
  }
  routePlans.unshift(plan)
  return mockDelay(plan, 1200)
}

export function confirmRoutePlan(id) {
  const plan = routePlans.find(p => p.id === Number(id))
  if (plan) plan.status = 'CONFIRMED'
  return mockDelay({ id, status: 'CONFIRMED' }, 400)
}

// ========== 实时动态调度 ==========

export function getDynamicEvents(params = {}) {
  const { page = 1, pageSize = 20, type, severity, status } = params
  let filtered = [...dynamicEvents]
  if (type) filtered = filtered.filter(e => e.type === type)
  if (severity) filtered = filtered.filter(e => e.severity === severity)
  if (status) filtered = filtered.filter(e => e.status === status)
  const total = filtered.length
  const start = (page - 1) * pageSize
  const records = filtered.slice(start, start + pageSize)
  return mockDelay({ records, total, page, pageSize })
}

export function resolveDynamicEvent(id, resolution) {
  const event = dynamicEvents.find(e => e.id === Number(id))
  if (event) {
    event.status = 'RESOLVED'
    event.resolveTime = new Date().toISOString().replace('T', ' ').slice(0, 19)
  }
  return mockDelay({ id, status: 'RESOLVED', resolution }, 500)
}

// ========== 调度任务协同 ==========

export function getDispatchTaskList(params = {}) {
  const { page = 1, pageSize = 20, keyword, status, type, priority } = params
  let filtered = [...dispatchTasks]
  if (keyword) {
    filtered = filtered.filter(t => t.taskNo.includes(keyword) || t.vehicleNo.includes(keyword) || t.driverName.includes(keyword))
  }
  if (status) filtered = filtered.filter(t => t.status === status)
  if (type) filtered = filtered.filter(t => t.type === type)
  if (priority) filtered = filtered.filter(t => t.priority === priority)
  const total = filtered.length
  const start = (page - 1) * pageSize
  const records = filtered.slice(start, start + pageSize)
  return mockDelay({ records, total, page, pageSize })
}

export function syncDispatchTask(id, system) {
  const task = dispatchTasks.find(t => t.id === Number(id))
  if (task) {
    const record = task.syncRecords.find(r => r.system === system)
    if (record) {
      record.status = 'SYNCED'
      record.syncTime = new Date().toISOString().replace('T', ' ').slice(0, 19)
      record.message = '同步成功'
    }
  }
  return mockDelay({ id, system, status: 'SYNCED' }, 600)
}

// ========== 调度概览统计 ==========

export function getDispatchStats() {
  return mockDelay(dispatchStats, 400)
}

function randFloat(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
}
