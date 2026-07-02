/**
 * 配送执行与在途监控服务 - Mock数据
 * 模拟实时车辆追踪、电子围栏、预警事件、异常处置等数据
 */

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
function randFloat(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
}
function pick(arr) {
  return arr[rand(0, arr.length - 1)]
}

// ========== 在途车辆实时追踪数据 ==========
function genTrackingVehicles() {
  const vehicles = []
  const customerNames = ['海底捞中央厨房', '盒马鲜生华东仓', '美团优选上海站', '叮咚买菜前置仓', '永辉超市物流中心', '大润发华东总仓', '学校团餐配送中心', '连锁餐厅供应链']
  const warehouses = ['上海浦东中央仓', '上海闵行冷链仓', '杭州余杭仓', '南京江宁仓']

  for (let i = 1; i <= 24; i++) {
    const status = pick(['IN_TRANSIT', 'AT_WAREHOUSE', 'AT_CUSTOMER', 'LOADING', 'UNLOADING'])
    const tempZones = pick([['FROZEN'], ['COLD'], ['FROZEN', 'COLD'], ['FROZEN', 'COLD', 'CONSTANT']])
    const currentTemp = {}
    tempZones.forEach(z => {
      if (z === 'FROZEN') currentTemp[z] = randFloat(-22, -16, 1)
      else if (z === 'COLD') currentTemp[z] = randFloat(1, 5, 1)
      else currentTemp[z] = randFloat(10, 15, 1)
    })
    const totalStops = rand(2, 6)
    const completedStops = status === 'IN_TRANSIT' ? rand(0, totalStops - 1) : totalStops
    vehicles.push({
      id: i,
      vehicleNo: `${pick(['沪', '苏', '浙', '皖'])}${String.fromCharCode(65 + rand(0, 25))}${rand(1000, 9999)}`,
      driverName: pick(['张伟', '李强', '王勇', '刘洋', '陈杰', '赵磊', '孙鹏', '周涛']),
      driverPhone: `1${rand(30, 89)}${rand(10000000, 99999999)}`,
      status,
      currentLng: randFloat(116, 122, 6),
      currentLat: randFloat(29, 32, 6),
      currentLocation: pick(['G15沈海高速K1253', 'G50沪渝高速K085', '上海市浦东新区张江路', '杭州市余杭区文一西路', '南京市江宁区将军大道', '苏州市工业园区现代大道']),
      speed: status === 'IN_TRANSIT' ? rand(40, 100) : 0,
      heading: rand(0, 359),
      fuelLevel: randFloat(20, 95, 0),
      engineStatus: 'RUNNING',
      tempZones,
      currentTemp,
      humidity: randFloat(45, 75, 0),
      doorStatus: pick(['CLOSED', 'CLOSED', 'CLOSED', 'OPEN']),
      refrigerationStatus: pick(['NORMAL', 'NORMAL', 'NORMAL', 'WARNING']),
      routePlanNo: `RTE${String(rand(1, 18)).padStart(4, '0')}`,
      totalStops,
      completedStops,
      currentStop: completedStops + 1 <= totalStops ? completedStops + 1 : totalStops,
      nextStop: completedStops < totalStops ? {
        customerName: pick(customerNames),
        address: pick(['上海市浦东新区张江高科技园区博云路2号', '上海市闵行区莘庄镇都市路5001号', '杭州市余杭区五常街道文一西路969号']),
        eta: `2026-06-30 ${String(rand(rand(15, 18), 20)).padStart(2, '0')}:${String(rand(0, 59)).padStart(2, '0')}`,
        distance: randFloat(2, 35, 1),
      } : null,
      departedFrom: pick(warehouses),
      departedTime: `2026-06-30 ${String(rand(6, 10)).padStart(2, '0')}:${String(rand(0, 59)).padStart(2, '0')}:00`,
      estimatedArrival: `2026-06-30 ${String(rand(15, 20)).padStart(2, '0')}:${String(rand(0, 59)).padStart(2, '0')}:00`,
      tempHistory: Array.from({ length: 12 }, (_, idx) => ({
        time: `${String(rand(6, 17)).padStart(2, '0')}:${String(idx * 5).padStart(2, '0')}`,
        temp: randFloat(-20, 5, 1),
      })),
      hasAlert: Math.random() > 0.75,
      alertCount: Math.random() > 0.75 ? rand(1, 3) : 0,
    })
  }
  return vehicles
}

// ========== 电子围栏 ==========
function genGeofences() {
  return [
    { id: 1, name: '上海浦东中央仓', type: 'WAREHOUSE', shape: 'CIRCLE', centerLng: 121.6089, centerLat: 31.2042, radius: 500, address: '上海市浦东新区张江高科技园区', status: 'ACTIVE', triggerCount: 156, lastTrigger: '2026-06-30 08:32:15', notifyRules: ['ENTER', 'LEAVE'] },
    { id: 2, name: '上海闵行冷链仓', type: 'WAREHOUSE', shape: 'CIRCLE', centerLng: 121.3847, centerLat: 31.1124, radius: 500, address: '上海市闵行区莘庄镇都市路', status: 'ACTIVE', triggerCount: 98, lastTrigger: '2026-06-30 07:15:22', notifyRules: ['ENTER', 'LEAVE'] },
    { id: 3, name: '杭州余杭仓', type: 'WAREHOUSE', shape: 'CIRCLE', centerLng: 119.9779, centerLat: 30.2897, radius: 500, address: '杭州市余杭区五常街道', status: 'ACTIVE', triggerCount: 72, lastTrigger: '2026-06-30 09:05:11', notifyRules: ['ENTER', 'LEAVE'] },
    { id: 4, name: '海底捞中央厨房', type: 'CUSTOMER', shape: 'CIRCLE', centerLng: 121.5589, centerLat: 31.2242, radius: 300, address: '上海市浦东新区金桥路', status: 'ACTIVE', triggerCount: 45, lastTrigger: '2026-06-30 10:22:33', notifyRules: ['ENTER'] },
    { id: 5, name: '盒马鲜生华东仓', type: 'CUSTOMER', shape: 'CIRCLE', centerLng: 121.4289, centerLat: 31.1842, radius: 300, address: '上海市浦东新区博成路', status: 'ACTIVE', triggerCount: 38, lastTrigger: '2026-06-30 09:48:07', notifyRules: ['ENTER'] },
    { id: 6, name: '美团优选上海站', type: 'CUSTOMER', shape: 'CIRCLE', centerLng: 121.4789, centerLat: 31.2542, radius: 300, address: '上海市杨浦区控江路', status: 'ACTIVE', triggerCount: 32, lastTrigger: '2026-06-30 11:05:44', notifyRules: ['ENTER'] },
    { id: 7, name: '学校团餐配送中心', type: 'CUSTOMER', shape: 'CIRCLE', centerLng: 121.5189, centerLat: 31.2642, radius: 200, address: '上海市浦东新区商城路', status: 'ACTIVE', triggerCount: 18, lastTrigger: '2026-06-30 06:30:00', notifyRules: ['ENTER', 'DWELL'] },
    { id: 8, name: 'G15沈海高速管控段', type: 'ROAD_SEGMENT', shape: 'POLYGON', centerLng: 121.3589, centerLat: 31.1542, radius: null, address: 'G15沈海高速K1250-K1260', status: 'ACTIVE', triggerCount: 12, lastTrigger: '2026-06-30 08:55:30', notifyRules: ['ENTER'] },
    { id: 9, name: '南京江宁仓', type: 'WAREHOUSE', shape: 'CIRCLE', centerLng: 118.8521, centerLat: 31.9601, radius: 500, address: '南京市江宁区秣陵街道', status: 'ACTIVE', triggerCount: 55, lastTrigger: '2026-06-30 07:45:18', notifyRules: ['ENTER', 'LEAVE'] },
    { id: 10, name: '苏州工业园区仓', type: 'WAREHOUSE', shape: 'CIRCLE', centerLng: 120.7425, centerLat: 31.2652, radius: 500, address: '苏州市工业园区现代大道', status: 'INACTIVE', triggerCount: 28, lastTrigger: '2026-06-29 16:22:10', notifyRules: ['ENTER', 'LEAVE'] },
  ]
}

// 围栏触发记录
function genGeofenceEvents() {
  const events = []
  const vehicleNos = ['沪A12345', '沪B67890', '苏C24680', '浙D13579', '沪E11223', '苏F44556']
  const fenceNames = ['上海浦东中央仓', '海底捞中央厨房', '盒马鲜生华东仓', '美团优选上海站', '杭州余杭仓', '学校团餐配送中心']
  const triggerTypes = ['ENTER', 'LEAVE', 'DWELL']
  for (let i = 1; i <= 30; i++) {
    const triggerType = pick(triggerTypes)
    events.push({
      id: i,
      fenceName: pick(fenceNames),
      vehicleNo: pick(vehicleNos),
      driverName: pick(['张伟', '李强', '王勇', '刘洋']),
      triggerType,
      triggerTime: `2026-06-30 ${String(rand(6, 18)).padStart(2, '0')}:${String(rand(0, 59)).padStart(2, '0')}:${String(rand(0, 59)).padStart(2, '0')}`,
      tempAtTrigger: {
        FROZEN: randFloat(-20, -16, 1),
        COLD: randFloat(1, 5, 1),
      },
      speedAtTrigger: triggerType === 'ENTER' ? rand(10, 30) : rand(5, 20),
      taskNo: `TSK${String(rand(1, 30)).padStart(4, '0')}`,
      action: triggerType === 'ENTER' ? pick(['到达仓库，准备装卸货', '到达客户点，准备卸货', '进入管控路段']) : pick(['离开仓库，开始配送', '离开客户点，前往下一站', '离开管控路段']),
      notified: pick(['SMS', 'APP', 'SMS+APP', 'FEISHU']),
    })
  }
  return events
}

// ========== AI智能异常预警 ==========
function genAlerts() {
  const alerts = []
  const alertTypes = ['TEMP_CONTROL', 'TIMEOUT', 'ROUTE_DEVIATION', 'EQUIPMENT_FAULT', 'SPEED_ABNORMAL', 'DOOR_OPEN']
  const alertLevels = ['RED', 'ORANGE', 'YELLOW']

  for (let i = 1; i <= 40; i++) {
    const level = pick(alertLevels)
    const type = pick(alertTypes)
    let description = ''
    let suggestion = ''
    let tempZone = null

    switch (type) {
      case 'TEMP_CONTROL':
        tempZone = pick(['FROZEN', 'COLD'])
        if (level === 'RED') {
          description = `冷冻区温度达-14.2℃，超过-15℃安全阈值，已持续35分钟`
          suggestion = `立即检查制冷设备运行状态；建议就近寻找制冷点或安排备用冷藏车接驳`
        } else if (level === 'ORANGE') {
          description = `冷藏区温度达6.2℃，超过4℃安全阈值，已持续18分钟`
          suggestion = `请司机排查制冷设备参数，检查车厢门是否完全关闭`
        } else {
          description = `冷藏区温度短时波动至5.1℃，持续8分钟，已自动恢复`
          suggestion = `系统已记录，请持续关注温度变化趋势`
        }
        break
      case 'TIMEOUT':
        description = level === 'RED' ? `车辆严重延误，ETA超出收货时间窗45分钟` : level === 'ORANGE' ? `车辆轻微延误，ETA超出收货时间窗18分钟` : `车辆短时停留，预计延误10分钟以内`
        suggestion = level === 'RED' ? `建议重新规划路线；通知收货方调整收货时间；评估是否需要备用车接驳` : `建议优化后续路线，减少不必要停留`
        break
      case 'ROUTE_DEVIATION':
        description = level === 'RED' ? `车辆严重偏离规划路线超过5km，持续15分钟未回归` : `车辆偏离规划路线2.3km`
        suggestion = `请联系司机确认行驶路线；系统已自动重新规划路线`
        break
      case 'EQUIPMENT_FAULT':
        description = level === 'RED' ? `车辆制冷机组通讯中断，无法获取温度数据` : `GPS定位信号弱，最近5分钟数据更新延迟`
        suggestion = `建议司机检查设备连接；安排就近检修；启用备用温度记录设备`
        break
      case 'SPEED_ABNORMAL':
        description = level === 'ORANGE' ? `车辆超速行驶，当前速度112km/h，限速80km/h` : `车辆长时间低速行驶，可能存在异常停留`
        suggestion = `已通知司机注意限速；建议确认车辆状态`
        break
      case 'DOOR_OPEN':
        description = level === 'ORANGE' ? `运输途中车厢门开启，持续3分钟` : `车辆停留期间车厢门开启`
        suggestion = `请司机确认车厢门是否关好；检查是否有装卸操作`
        break
    }

    alerts.push({
      id: i,
      alertNo: `ALT${String(i).padStart(4, '0')}`,
      level,
      type,
      vehicleNo: `${pick(['沪', '苏', '浙'])}${String.fromCharCode(65 + rand(0, 25))}${rand(1000, 9999)}`,
      driverName: pick(['张伟', '李强', '王勇', '刘洋', '陈杰']),
      routePlanNo: `RTE${String(rand(1, 18)).padStart(4, '0')}`,
      tempZone,
      description,
      suggestion,
      triggerTime: `2026-06-30 ${String(rand(7, 17)).padStart(2, '0')}:${String(rand(0, 59)).padStart(2, '0')}:${String(rand(0, 59)).padStart(2, '0')}`,
      status: pick(['PENDING', 'PROCESSING', 'RESOLVED', 'ESCALATED']),
      resolvedTime: Math.random() > 0.5 ? `2026-06-30 ${String(rand(8, 18)).padStart(2, '0')}:${String(rand(0, 59)).padStart(2, '0')}:00` : null,
      resolvedBy: Math.random() > 0.5 ? pick(['调度员-王明', '司机-张伟', '系统自动', '质量管控-李华']) : null,
      resolveNote: Math.random() > 0.5 ? pick(['已排查制冷设备，温度恢复正常', '已重新规划路线，司机已确认', '已通知收货方调整收货时间', '设备已重启，信号恢复', '已安排备用车接驳']) : null,
      notifiedChannels: pick([['SMS', 'APP'], ['APP'], ['SMS', 'APP', 'PHONE'], ['APP', 'FEISHU']]),
      escalationLevel: level === 'RED' ? 2 : level === 'ORANGE' ? 1 : 0,
    })
  }
  // 按触发时间倒序
  alerts.sort((a, b) => b.triggerTime.localeCompare(a.triggerTime))
  return alerts
}

// ========== 在途异常处置记录 ==========
function genEmergencyRecords() {
  const records = []
  const emergencyTypes = ['REFRIGERATION_FAULT', 'TRAFFIC_ACCIDENT', 'SEVERE_JAM', 'CARGO_DAMAGE_RISK', 'VEHICLE_BREAKDOWN', 'REJECT_RISK']
  for (let i = 1; i <= 20; i++) {
    const type = pick(emergencyTypes)
    const status = pick(['IN_PROGRESS', 'RESOLVED', 'ESCALATED', 'CLOSED'])
    let plan = ''
    let actions = []

    switch (type) {
      case 'REFRIGERATION_FAULT':
        plan = '车辆V001制冷机故障，车厢温度-15℃接近临界，当前距客户3km/10分钟，建议直送而非转运'
        actions = [
          { time: '08:32:15', action: '系统自动触发红色预警', operator: '系统', result: '预警已推送至司机/调度/质控' },
          { time: '08:33:02', action: '调度员确认预警，联系司机核实情况', operator: '调度员-王明', result: '司机确认制冷机压力异常' },
          { time: '08:35:30', action: '系统生成应急处置方案', operator: 'AI Agent', result: '方案：直送最近客户，减少开门频次' },
          { time: '08:36:00', action: '方案执行确认', operator: '调度员-王明', result: '司机已确认执行，预计10分钟内送达' },
        ]
        break
      case 'SEVERE_JAM':
        plan = '车辆V002严重拥堵，ETA延误40分钟，附近冷藏车V050可15分钟内接驳'
        actions = [
          { time: '09:15:22', action: '系统监测到严重拥堵，触发橙色预警', operator: '系统', result: '预警已推送' },
          { time: '09:16:00', action: '系统查询附近可用冷藏车', operator: 'AI Agent', result: '找到V050，距当前点8km' },
          { time: '09:17:30', action: '生成接驳方案并推送', operator: 'AI Agent', result: '方案：V050前往接驳点转运货物' },
          { time: '09:20:00', action: '调度确认方案并通知V050司机', operator: '调度员-李华', result: 'V050已出发前往接驳点' },
        ]
        break
      case 'TRAFFIC_ACCIDENT':
        plan = '车辆发生交通事故无法行驶，安排附近在途冷藏车接驳货物'
        actions = [
          { time: '10:05:00', action: '司机上报交通事故', operator: '司机-张伟', result: '系统触发红色预警' },
          { time: '10:06:15', action: '系统评估附近运力资源', operator: 'AI Agent', result: '匹配到2辆可用冷藏车' },
          { time: '10:08:00', action: '生成转运方案', operator: 'AI Agent', result: 'V061预计20分钟到达' },
          { time: '10:10:30', action: '方案确认执行', operator: '调度员-王明', result: 'V061已出发，货物转运中' },
        ]
        break
      default:
        plan = '系统生成应急处置方案，建议调整路线并通知相关方'
        actions = [
          { time: '08:00:00', action: '系统触发预警', operator: '系统', result: '预警已推送' },
          { time: '08:02:00', action: '调度员确认并处置', operator: '调度员-王明', result: '已处理' },
        ]
    }

    records.push({
      id: i,
      recordNo: `EMG${String(i).padStart(4, '0')}`,
      type,
      level: pick(['RED', 'ORANGE']),
      vehicleNo: `${pick(['沪', '苏', '浙'])}${String.fromCharCode(65 + rand(0, 25))}${rand(1000, 9999)}`,
      driverName: pick(['张伟', '李强', '王勇', '刘洋']),
      routePlanNo: `RTE${String(rand(1, 18)).padStart(4, '0')}`,
      alertNo: `ALT${String(rand(1, 40)).padStart(4, '0')}`,
      description: pick([
        '车辆制冷机组故障，车厢温度持续上升，接近安全临界点',
        'G15沈海高速严重拥堵，车辆无法按时抵达收货点',
        '车辆在运输途中发生交通事故，无法继续行驶',
        '车厢温度异常持续30分钟，货品存在变质风险',
        '车辆发动机故障，无法继续行驶',
        '收货方反馈货品包装破损，可能拒收',
      ]),
      triggerTime: `2026-06-30 ${String(rand(7, 15)).padStart(2, '0')}:${String(rand(0, 59)).padStart(2, '0')}:00`,
      status,
      plan,
      actions,
      resolveTime: status === 'CLOSED' || status === 'RESOLVED' ? `2026-06-30 ${String(rand(9, 18)).padStart(2, '0')}:${String(rand(0, 59)).padStart(2, '0')}:00` : null,
      cargoStatus: pick(['NORMAL', 'AT_RISK', 'SALVAGED', 'DESTROYED']),
      costImpact: randFloat(0, 5000, 0),
      customerNotified: true,
      qualityDeptInvolved: Math.random() > 0.6,
    })
  }
  return records
}

// 监控概览统计
function genMonitoringStats() {
  return {
    totalInTransit: 24,
    normalCount: 18,
    warningCount: 4,
    alertCount: 2,
    todayAlerts: 40,
    pendingAlerts: 12,
    resolvedAlerts: 22,
    inProgressEmergencies: 3,
    resolvedEmergencies: 17,
    geofenceCount: 10,
    todayGeofenceTriggers: 30,
    // 预警级别分布
    alertLevelDist: { RED: 5, ORANGE: 12, YELLOW: 23 },
    // 预警类型分布
    alertTypeDist: {
      TEMP_CONTROL: 15, TIMEOUT: 8, ROUTE_DEVIATION: 5, EQUIPMENT_FAULT: 4, SPEED_ABNORMAL: 5, DOOR_OPEN: 3,
    },
    // 近7天预警趋势
    alertTrend7d: [
      { date: '6/24', total: 28, resolved: 25 },
      { date: '6/25', total: 35, resolved: 32 },
      { date: '6/26', total: 22, resolved: 20 },
      { date: '6/27', total: 40, resolved: 36 },
      { date: '6/28', total: 45, resolved: 42 },
      { date: '6/29', total: 38, resolved: 35 },
      { date: '6/30', total: 40, resolved: 22 },
    ],
    // 温控合规率
    tempComplianceRate: 98.5,
    // 准时率
    onTimeRate: 96.2,
    // 货损率
    damageRate: 0.18,
  }
}

export const trackingVehicles = genTrackingVehicles()
export const geofences = genGeofences()
export const geofenceEvents = genGeofenceEvents()
export const alerts = genAlerts()
export const emergencyRecords = genEmergencyRecords()
export const monitoringStats = genMonitoringStats()
