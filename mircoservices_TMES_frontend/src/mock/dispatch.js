/**
 * 智能调度服务 - Mock数据
 * 模拟运力资源池、AI配载方案、路径规划方案、调度任务等数据
 */

// ========== 运力资源 ==========
const VEHICLE_TYPES = ['4.2米冷藏车', '6.8米冷藏车', '9.6米冷藏车', '13.75米冷藏半挂', '4.2米双温区车', '7.7米三温区车']
const VEHICLE_BRANDS = ['福田欧马可', '一汽解放J6', '东风天锦', '江淮骏铃', '重汽豪沃', '庆铃KV600']
const REGIONS = ['华东', '华北', '华南', '华中', '西南', '西北']

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
function randFloat(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
}
function pick(arr) {
  return arr[rand(0, arr.length - 1)]
}

// 车辆状态
const VEHICLE_STATUSES = ['IDLE', 'LOADING', 'IN_TRANSIT', 'UNLOADING', 'MAINTENANCE', 'OFFLINE']

// 生成车辆数据
function genVehicles() {
  const vehicles = []
  const plateProvinces = ['沪', '京', '粤', '苏', '浙', '皖', '川', '鄂', '陕']
  for (let i = 1; i <= 36; i++) {
    const vehicleType = pick(VEHICLE_TYPES)
    const isMultiTemp = vehicleType.includes('双温') || vehicleType.includes('三温')
    const tempZones = isMultiTemp
      ? (vehicleType.includes('三温') ? ['FROZEN', 'COLD', 'CONSTANT'] : ['FROZEN', 'COLD'])
      : [pick(['FROZEN', 'COLD', 'CONSTANT'])]
    const status = pick(VEHICLE_STATUSES)
    vehicles.push({
      id: i,
      vehicleNo: `${pick(plateProvinces)}${String.fromCharCode(65 + rand(0, 25))}${rand(1000, 9999)}`,
      vehicleType,
      brand: pick(VEHICLE_BRANDS),
      maxWeight: parseFloat(vehicleType.match(/[\d.]+/)?.[0] || '4.2') * randFloat(0.8, 1.2, 1),
      maxVolume: parseFloat(vehicleType.match(/[\d.]+/)?.[0] || '4.2') * randFloat(3, 5, 1),
      tempZones,
      hasPartition: isMultiTemp || Math.random() > 0.5,
      refrigerationStatus: status === 'MAINTENANCE' ? 'FAULT' : 'NORMAL',
      currentLocation: pick(['上海浦东仓', '上海闵行仓', '杭州仓', '南京仓', '苏州仓', '合肥仓', '在途-G15沈海高速', '在途-G50沪渝高速']),
      currentLng: randFloat(116, 122, 4),
      currentLat: randFloat(29, 32, 4),
      status,
      ownership: pick(['SELF', 'LEASED', 'CARRIER']),
      carrierName: pick(['众美达冷链', '顺丰冷运', '京东冷链', '自营车队', '中外运冷链']),
      driverName: `司机${rand(1, 99)}`,
      driverPhone: `1${rand(30, 89)}${rand(10000000, 99999999)}`,
      lastInspection: `2026-0${rand(1, 6)}-${String(rand(1, 28)).padStart(2, '0')}`,
      lastDisinfection: `2026-0${rand(1, 6)}-${String(rand(1, 28)).padStart(2, '0')}`,
      insuranceExpiry: `2027-${String(rand(1, 12)).padStart(2, '0')}-${String(rand(1, 28)).padStart(2, '0')}`,
      todayTasks: status === 'IDLE' ? 0 : rand(1, 4),
      utilizationRate: randFloat(45, 95, 1),
      region: pick(REGIONS),
    })
  }
  return vehicles
}

// 司机数据
function genDrivers() {
  const names = ['张伟', '李强', '王勇', '刘洋', '陈杰', '赵磊', '孙鹏', '周涛', '吴超', '郑刚', '马俊', '朱亮', '胡峰', '林辉', '徐健']
  const drivers = []
  for (let i = 1; i <= 24; i++) {
    drivers.push({
      id: i,
      name: pick(names),
      phone: `1${rand(30, 89)}${rand(10000000, 99999999)}`,
      licenseType: pick(['B2', 'A2']),
      licenseExpiry: `2027-${String(rand(1, 12)).padStart(2, '0')}-${String(rand(1, 28)).padStart(2, '0')}`,
      status: pick(['AVAILABLE', 'ON_DUTY', 'RESTING', 'OFFLINE']),
      vehicleNo: `沪${String.fromCharCode(65 + rand(0, 25))}${rand(1000, 9999)}`,
      todayTasks: rand(0, 4),
      monthTasks: rand(15, 65),
      score: randFloat(3.5, 5.0, 1),
      totalMileage: rand(50000, 500000),
      healthStatus: 'HEALTHY',
      workYears: rand(1, 15),
    })
  }
  return drivers
}

// 承运商数据
function genCarriers() {
  return [
    { id: 1, name: '众美达冷链物流', code: 'ZMD001', type: 'CARRIER', contact: '刘经理', phone: '13900001111', serviceArea: '华东区域', vehicleCount: 28, rating: 4.8, onTimeRate: 96.5, cooperationStart: '2024-03-15', status: 'ACTIVE' },
    { id: 2, name: '顺丰冷运', code: 'SF002', type: 'CARRIER', contact: '陈经理', phone: '13900002222', serviceArea: '全国', vehicleCount: 120, rating: 4.9, onTimeRate: 98.2, cooperationStart: '2023-08-01', status: 'ACTIVE' },
    { id: 3, name: '京东冷链', code: 'JD003', type: 'CARRIER', contact: '赵经理', phone: '13900003333', serviceArea: '全国', vehicleCount: 85, rating: 4.7, onTimeRate: 97.1, cooperationStart: '2024-01-20', status: 'ACTIVE' },
    { id: 4, name: '中外运冷链', code: 'CNW004', type: 'CARRIER', contact: '孙经理', phone: '13900004444', serviceArea: '华东/华南', vehicleCount: 45, rating: 4.6, onTimeRate: 95.3, cooperationStart: '2023-11-10', status: 'ACTIVE' },
    { id: 5, name: '自营车队', code: 'OWN005', type: 'SELF', contact: '王队长', phone: '13900005555', serviceArea: '华东区域', vehicleCount: 15, rating: 4.9, onTimeRate: 99.0, cooperationStart: '2022-06-01', status: 'ACTIVE' },
    { id: 6, name: '鸿运冷链运输', code: 'HY006', type: 'CARRIER', contact: '李经理', phone: '13900006666', serviceArea: '华中/西南', vehicleCount: 22, rating: 4.3, onTimeRate: 92.8, cooperationStart: '2024-06-15', status: 'PROBATION' },
  ]
}

// ========== AI配载方案 ==========
function genLoadingPlans() {
  const plans = []
  const planStatuses = ['DRAFT', 'RECOMMENDED', 'CONFIRMED', 'EXECUTING', 'COMPLETED']
  for (let i = 1; i <= 20; i++) {
    const vehicleType = pick(VEHICLE_TYPES)
    const totalWeight = randFloat(1.5, 12, 1)
    const maxWeight = parseFloat(vehicleType.match(/[\d.]+/)?.[0] || '4.2') * 1.0
    const totalVolume = randFloat(8, 45, 1)
    const maxVolume = parseFloat(vehicleType.match(/[\d.]+/)?.[0] || '4.2') * 4.5
    const itemCount = rand(3, 12)
    const items = []
    const tempZonesUsed = []
    for (let j = 0; j < itemCount; j++) {
      const tz = pick(['FROZEN', 'COLD', 'CONSTANT'])
      if (!tempZonesUsed.includes(tz)) tempZonesUsed.push(tz)
      items.push({
        orderNo: `TMS20260630${rand(100000, 999999)}`,
        productName: pick(['冷冻牛排', '即食沙拉', '常温糕点', '冷冻水饺', '鲜切水果', '预制佛跳墙', '即食三明治', '罐头食品']),
        tempZone: tz,
        weight: randFloat(0.1, 3.0, 1),
        volume: randFloat(0.5, 4.0, 1),
        qty: rand(5, 100),
        position: `第${j + 1}层-${pick(['左侧', '中部', '右侧'])}`,
        stackLimit: rand(3, 8),
        deliveryOrder: j + 1,
      })
    }
    plans.push({
      id: i,
      planNo: `LOAD${String(i).padStart(4, '0')}`,
      vehicleNo: `${pick(['沪', '苏', '浙'])}${String.fromCharCode(65 + rand(0, 25))}${rand(1000, 9999)}`,
      vehicleType,
      driverName: pick(['张伟', '李强', '王勇', '刘洋', '陈杰']),
      totalWeight,
      maxWeight,
      weightRate: parseFloat(((totalWeight / maxWeight) * 100).toFixed(1)),
      totalVolume,
      maxVolume,
      volumeRate: parseFloat(((totalVolume / maxVolume) * 100).toFixed(1)),
      itemCount,
      tempZones: tempZonesUsed,
      items,
      partitionRequired: tempZonesUsed.length > 1,
      status: pick(planStatuses),
      createTime: `2026-06-${String(rand(28, 30)).padStart(2, '0')} ${String(rand(6, 18)).padStart(2, '0')}:${String(rand(0, 59)).padStart(2, '0')}:00`,
      estimatedCost: randFloat(800, 5000, 0),
      aiScore: randFloat(75, 98, 1),
      hasMixingWarning: Math.random() > 0.8,
    })
  }
  return plans
}

// ========== AI路径规划方案 ==========
function genRoutePlans() {
  const plans = []
  const routeStatuses = ['DRAFT', 'RECOMMENDED', 'CONFIRMED', 'EXECUTING', 'COMPLETED']
  const customerNames = ['海底捞中央厨房', '盒马鲜生华东仓', '美团优选上海站', '叮咚买菜前置仓', '永辉超市物流中心', '大润发华东总仓', '学校团餐配送中心', '连锁餐厅供应链']

  for (let i = 1; i <= 18; i++) {
    const stopCount = rand(2, 6)
    const stops = []
    let totalDistance = 0
    let totalTime = 0
    for (let j = 0; j < stopCount; j++) {
      const dist = rand(5, 60)
      const time = rand(15, 90)
      totalDistance += dist
      totalTime += time
      stops.push({
        seq: j + 1,
        customerName: pick(customerNames),
        address: pick(['上海市浦东新区张江高科技园区', '上海市闵行区莘庄镇', '杭州市余杭区五常街道', '南京市江宁区秣陵街道', '苏州市工业园区现代大道', '合肥市蜀山区长江西路']),
        lng: randFloat(116, 122, 4),
        lat: randFloat(29, 32, 4),
        arrivalTime: `2026-06-30 ${String(rand(8, 18)).padStart(2, '0')}:${String(rand(0, 59)).padStart(2, '0')}`,
        departTime: `2026-06-30 ${String(rand(8, 18)).padStart(2, '0')}:${String(rand(0, 59)).padStart(2, '0')}`,
        timeWindow: `${String(rand(6, 12)).padStart(2, '0')}:00-${String(rand(14, 20)).padStart(2, '0')}:00`,
        distance: dist,
        driveTime: time,
        tempZone: pick(['FROZEN', 'COLD', 'CONSTANT']),
        priority: pick(['HIGH', 'NORMAL', 'LOW']),
        status: j === 0 ? 'COMPLETED' : 'PENDING',
      })
    }
    plans.push({
      id: i,
      routeNo: `RTE${String(i).padStart(4, '0')}`,
      vehicleNo: `${pick(['沪', '苏', '浙'])}${String.fromCharCode(65 + rand(0, 25))}${rand(1000, 9999)}`,
      driverName: pick(['张伟', '李强', '王勇', '刘洋', '陈杰']),
      stopCount,
      stops,
      totalDistance,
      totalTime,
      estimatedStartTime: `2026-06-30 ${String(rand(6, 9)).padStart(2, '0')}:00:00`,
      estimatedEndTime: `2026-06-30 ${String(rand(15, 20)).padStart(2, '0')}:${String(rand(0, 59)).padStart(2, '0')}:00`,
      status: pick(routeStatuses),
      trafficCondition: pick(['SMOOTH', 'MODERATE', 'CONGESTED']),
      weatherCondition: pick(['SUNNY', 'CLOUDY', 'RAIN', 'STORM']),
      aiScore: randFloat(72, 99, 1),
      fuelCost: randFloat(150, 800, 0),
      tollCost: randFloat(50, 300, 0),
      totalCost: randFloat(200, 1100, 0),
      createTime: `2026-06-${String(rand(28, 30)).padStart(2, '0')} ${String(rand(6, 18)).padStart(2, '0')}:${String(rand(0, 59)).padStart(2, '0')}:00`,
      hasAlternative: Math.random() > 0.4,
    })
  }
  return plans
}

// ========== 调度任务协同 ==========
function genDispatchTasks() {
  const tasks = []
  const taskTypes = ['LOADING_INSTRUCTION', 'ROUTE_NOTIFICATION', 'VEHICLE_ASSIGNMENT', 'WMS_SYNC', 'DRIVER_NOTIFY']
  const syncStatuses = ['PENDING', 'SYNCED', 'FAILED', 'ACKNOWLEDGED']
  const systems = ['WMS', 'ERP', 'MES', 'DRIVER_APP', 'CARRIER_SYSTEM']

  for (let i = 1; i <= 30; i++) {
    const syncRecords = []
    const syncCount = rand(2, 4)
    for (let j = 0; j < syncCount; j++) {
      syncRecords.push({
        system: pick(systems),
        status: pick(syncStatuses),
        syncTime: `2026-06-30 ${String(rand(6, 18)).padStart(2, '0')}:${String(rand(0, 59)).padStart(2, '0')}:${String(rand(0, 59)).padStart(2, '0')}`,
        message: pick(['同步成功', '系统已确认', '等待确认', '同步失败-接口超时', '已下发至终端']),
      })
    }
    tasks.push({
      id: i,
      taskNo: `TSK${String(i).padStart(4, '0')}`,
      type: pick(taskTypes),
      vehicleNo: `${pick(['沪', '苏', '浙'])}${String.fromCharCode(65 + rand(0, 25))}${rand(1000, 9999)}`,
      driverName: pick(['张伟', '李强', '王勇', '刘洋', '陈杰']),
      driverPhone: `1${rand(30, 89)}${rand(10000000, 99999999)}`,
      carrierName: pick(['众美达冷链', '顺丰冷运', '京东冷链', '自营车队']),
      loadingPlanNo: `LOAD${String(rand(1, 20)).padStart(4, '0')}`,
      routePlanNo: `RTE${String(rand(1, 18)).padStart(4, '0')}`,
      status: pick(['PENDING', 'SYNCING', 'SYNCED', 'EXECUTING', 'COMPLETED']),
      priority: pick(['HIGH', 'NORMAL', 'LOW']),
      createTime: `2026-06-${String(rand(28, 30)).padStart(2, '0')} ${String(rand(6, 18)).padStart(2, '0')}:${String(rand(0, 59)).padStart(2, '0')}:00`,
      syncRecords,
      pickupTime: `2026-06-30 ${String(rand(7, 12)).padStart(2, '0')}:30:00`,
      deliveryDeadline: `2026-06-30 ${String(rand(14, 20)).padStart(2, '0')}:00:00`,
      remark: pick(['常规配送任务', '紧急加单', '团餐专线', '高价值货品专送', '多温区混装任务']),
    })
  }
  return tasks
}

// ========== 动态调度事件 ==========
function genDynamicEvents() {
  const events = []
  const eventTypes = ['TRAFFIC_JAM', 'ROAD_CLOSED', 'VEHICLE_FAULT', 'NEW_ORDER', 'TIME_WINDOW_CHANGE', 'TEMP_ALERT', 'ROUTE_DEVIATION']
  for (let i = 1; i <= 15; i++) {
    events.push({
      id: i,
      eventNo: `DYN${String(i).padStart(4, '0')}`,
      type: pick(eventTypes),
      vehicleNo: `${pick(['沪', '苏', '浙'])}${String.fromCharCode(65 + rand(0, 25))}${rand(1000, 9999)}`,
      description: pick([
        'G15沈海高速K1253段严重拥堵，预计延误40分钟',
        '前方道路施工封闭，需要绕行',
        '车辆制冷机组压力异常，需要排查',
        '新增紧急订单需要插入当前路线',
        '客户收货时间窗变更，需调整配送顺序',
        '车厢温度偏离阈值，触发预警',
        '车辆偏离规划路线超过2km',
        'G50沪渝高速发生交通事故，通行缓慢',
      ]),
      severity: pick(['HIGH', 'MEDIUM', 'LOW']),
      triggerTime: `2026-06-30 ${String(rand(8, 16)).padStart(2, '0')}:${String(rand(0, 59)).padStart(2, '0')}:${String(rand(0, 59)).padStart(2, '0')}`,
      status: pick(['PENDING', 'PROCESSING', 'RESOLVED', 'AUTO_RESOLVED']),
      suggestion: pick([
        '建议绕行G1503郊环高速，预计增加8km但节省25分钟',
        '建议调度备用车辆V050接驳，15分钟内可到达',
        '建议调整配送顺序，将节点3提前至节点1',
        '建议司机检查制冷设备运行参数，必要时前往就近检修点',
        '建议直送当前最近客户，减少开门频次',
        '已自动重新规划路线，新路线已推送至司机APP',
      ]),
      autoResolved: Math.random() > 0.6,
      resolveTime: Math.random() > 0.5 ? `2026-06-30 ${String(rand(9, 17)).padStart(2, '0')}:${String(rand(0, 59)).padStart(2, '0')}:00` : null,
    })
  }
  return events
}

// 调度概览统计
function genDispatchStats() {
  return {
    totalVehicles: 36,
    availableVehicles: 12,
    inTransitVehicles: 18,
    loadingVehicles: 4,
    maintenanceVehicles: 2,
    avgUtilizationRate: 78.5,
    todayTasks: 48,
    completedTasks: 22,
    pendingTasks: 12,
    inProgressTasks: 14,
    aiLoadingPlans: 20,
    confirmedPlans: 8,
    aiRoutePlans: 18,
    confirmedRoutes: 7,
    dynamicEvents: 15,
    resolvedEvents: 9,
    pendingEvents: 6,
    // 车辆状态分布
    vehicleStatusDist: {
      IDLE: 12, LOADING: 4, IN_TRANSIT: 18, UNLOADING: 0, MAINTENANCE: 2, OFFLINE: 0,
    },
    // 温区能力分布
    tempZoneCapacity: {
      FROZEN: 15, COLD: 12, CONSTANT: 9,
    },
    // 近7天调度任务趋势
    taskTrend7d: [
      { date: '6/24', tasks: 35, completed: 30 },
      { date: '6/25', tasks: 42, completed: 38 },
      { date: '6/26', tasks: 38, completed: 35 },
      { date: '6/27', tasks: 45, completed: 41 },
      { date: '6/28', tasks: 50, completed: 44 },
      { date: '6/29', tasks: 48, completed: 42 },
      { date: '6/30', tasks: 48, completed: 22 },
    ],
  }
}

export const vehicles = genVehicles()
export const drivers = genDrivers()
export const carriers = genCarriers()
export const loadingPlans = genLoadingPlans()
export const routePlans = genRoutePlans()
export const dispatchTasks = genDispatchTasks()
export const dynamicEvents = genDynamicEvents()
export const dispatchStats = genDispatchStats()
