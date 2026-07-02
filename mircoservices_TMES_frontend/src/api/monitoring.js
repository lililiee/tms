/**
 * 配送执行与在途监控服务 - API层
 * 开发阶段使用Mock数据，后端就绪后切换至真实接口
 */
import {
  trackingVehicles, geofences, geofenceEvents,
  alerts, emergencyRecords, monitoringStats,
} from '@/mock/monitoring'

function mockDelay(data, delay = 300) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ code: 200, data }), delay)
  })
}

// ========== 车辆与货物追踪 ==========

export function getTrackingVehicleList(params = {}) {
  const { page = 1, pageSize = 50, keyword, status, tempZone, hasAlert } = params
  let filtered = [...trackingVehicles]
  if (keyword) {
    const kw = keyword.toLowerCase()
    filtered = filtered.filter(v =>
      v.vehicleNo.toLowerCase().includes(kw) ||
      v.driverName.includes(keyword) ||
      v.routePlanNo.includes(keyword)
    )
  }
  if (status) filtered = filtered.filter(v => v.status === status)
  if (tempZone) filtered = filtered.filter(v => v.tempZones.includes(tempZone))
  if (hasAlert !== undefined && hasAlert !== '') {
    const alertBool = hasAlert === true || hasAlert === 'true'
    filtered = filtered.filter(v => v.hasAlert === alertBool)
  }
  const total = filtered.length
  const start = (page - 1) * pageSize
  const records = filtered.slice(start, start + pageSize)
  return mockDelay({ records, total, page, pageSize })
}

export function getTrackingVehicleDetail(id) {
  const vehicle = trackingVehicles.find(v => v.id === Number(id))
  return mockDelay(vehicle || null, 200)
}

// ========== 电子围栏 ==========

export function getGeofenceList(params = {}) {
  const { keyword, type, status } = params
  let filtered = [...geofences]
  if (keyword) {
    filtered = filtered.filter(g => g.name.includes(keyword) || g.address.includes(keyword))
  }
  if (type) filtered = filtered.filter(g => g.type === type)
  if (status) filtered = filtered.filter(g => g.status === status)
  return mockDelay(filtered)
}

export function getGeofenceEvents(params = {}) {
  const { page = 1, pageSize = 20, fenceName, triggerType, vehicleNo } = params
  let filtered = [...geofenceEvents]
  if (fenceName) filtered = filtered.filter(e => e.fenceName.includes(fenceName))
  if (triggerType) filtered = filtered.filter(e => e.triggerType === triggerType)
  if (vehicleNo) filtered = filtered.filter(e => e.vehicleNo.includes(vehicleNo))
  const total = filtered.length
  const start = (page - 1) * pageSize
  const records = filtered.slice(start, start + pageSize)
  return mockDelay({ records, total, page, pageSize })
}

export function toggleGeofenceStatus(id) {
  const fence = geofences.find(g => g.id === Number(id))
  if (fence) fence.status = fence.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
  return mockDelay({ id, status: fence?.status }, 300)
}

// ========== AI智能异常预警 ==========

export function getAlertList(params = {}) {
  const { page = 1, pageSize = 20, level, type, status, vehicleNo } = params
  let filtered = [...alerts]
  if (level) filtered = filtered.filter(a => a.level === level)
  if (type) filtered = filtered.filter(a => a.type === type)
  if (status) filtered = filtered.filter(a => a.status === status)
  if (vehicleNo) filtered = filtered.filter(a => a.vehicleNo.includes(vehicleNo))
  const total = filtered.length
  const start = (page - 1) * pageSize
  const records = filtered.slice(start, start + pageSize)
  return mockDelay({ records, total, page, pageSize })
}

export function getAlertDetail(id) {
  const alert = alerts.find(a => a.id === Number(id))
  return mockDelay(alert || null, 200)
}

export function resolveAlert(id, note) {
  const alert = alerts.find(a => a.id === Number(id))
  if (alert) {
    alert.status = 'RESOLVED'
    alert.resolvedTime = new Date().toISOString().replace('T', ' ').slice(0, 19)
    alert.resolvedBy = '调度员-当前用户'
    alert.resolveNote = note
  }
  return mockDelay({ id, status: 'RESOLVED' }, 500)
}

export function escalateAlert(id) {
  const alert = alerts.find(a => a.id === Number(id))
  if (alert) {
    alert.status = 'ESCALATED'
    alert.escalationLevel += 1
  }
  return mockDelay({ id, status: 'ESCALATED' }, 400)
}

// ========== 在途异常处置 ==========

export function getEmergencyList(params = {}) {
  const { page = 1, pageSize = 20, type, level, status, vehicleNo } = params
  let filtered = [...emergencyRecords]
  if (type) filtered = filtered.filter(e => e.type === type)
  if (level) filtered = filtered.filter(e => e.level === level)
  if (status) filtered = filtered.filter(e => e.status === status)
  if (vehicleNo) filtered = filtered.filter(e => e.vehicleNo.includes(vehicleNo))
  const total = filtered.length
  const start = (page - 1) * pageSize
  const records = filtered.slice(start, start + pageSize)
  return mockDelay({ records, total, page, pageSize })
}

export function getEmergencyDetail(id) {
  const record = emergencyRecords.find(e => e.id === Number(id))
  return mockDelay(record || null, 200)
}

export function executeEmergencyPlan(id, action) {
  const record = emergencyRecords.find(e => e.id === Number(id))
  if (record) {
    record.actions.push({
      time: new Date().toISOString().replace('T', ' ').slice(11, 19),
      action: action.action,
      operator: '调度员-当前用户',
      result: action.result,
    })
  }
  return mockDelay({ id, status: 'IN_PROGRESS' }, 500)
}

export function closeEmergency(id, note) {
  const record = emergencyRecords.find(e => e.id === Number(id))
  if (record) {
    record.status = 'CLOSED'
    record.resolveTime = new Date().toISOString().replace('T', ' ').slice(0, 19)
  }
  return mockDelay({ id, status: 'CLOSED' }, 500)
}

// ========== 监控概览统计 ==========

export function getMonitoringStats() {
  return mockDelay(monitoringStats, 400)
}
