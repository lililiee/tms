/**
 * OMS 订单管理服务 - Mock数据
 * 模拟预制菜TMS系统的多渠道订单数据
 */

// 货品类别
const CATEGORIES = {
  FROZEN: ['冷冻牛排', '冷冻水饺', '冷冻虾仁', '预制佛跳墙', '冷冻面点', '帝王蟹', '冷冻汤圆', '预制酸菜鱼'],
  COLD: ['即食沙拉', '鲜切水果', '即食三明治', '即食寿司', '冷鲜肉', '鲜奶布丁', '即食虾仁', '轻食套餐'],
  CONSTANT: ['常温糕点', '即食粥品', '罐头食品', '常温速食', '调味料包', '干货礼盒', '即热便当', '即食汤品'],
}

// 客户名称
const CUSTOMERS = [
  '海底捞中央厨房', '盒马鲜生华东仓', '美团优选上海站', '叮咚买菜前置仓',
  '永辉超市物流中心', '大润发华东总仓', '学校团餐配送中心', '连锁餐厅供应链',
  '京东生鲜华东仓', '每日优鲜前置仓', '西贝莜面村中央厨房', '真功夫供应链',
  '嘉荣超市配送中心', '天虹商场物流中心', '钱大妈生鲜仓', '锅圈食汇总仓',
]

// 收货地址
const ADDRESSES = [
  { address: '上海市浦东新区张江高科技园区博云路2号', city: '上海', region: '华东', lng: 121.6089, lat: 31.2042 },
  { address: '上海市闵行区莘庄镇都市路5001号', city: '上海', region: '华东', lng: 121.3847, lat: 31.1124 },
  { address: '杭州市余杭区五常街道文一西路969号', city: '杭州', region: '华东', lng: 119.9779, lat: 30.2897 },
  { address: '南京市江宁区秣陵街道将军大道66号', city: '南京', region: '华东', lng: 118.8521, lat: 31.9601 },
  { address: '苏州市工业园区现代大道188号', city: '苏州', region: '华东', lng: 120.7425, lat: 31.2652 },
  { address: '合肥市蜀山区长江西路299号', city: '合肥', region: '华东', lng: 117.2591, lat: 31.8612 },
  { address: '北京市朝阳区建国路88号', city: '北京', region: '华北', lng: 116.4791, lat: 39.9087 },
  { address: '广州市天河区珠江新城花城大道85号', city: '广州', region: '华南', lng: 113.3236, lat: 23.1189 },
  { address: '深圳市南山区科技园南区高新南一道9号', city: '深圳', region: '华南', lng: 113.9406, lat: 22.5368 },
  { address: '成都市武侯区天府大道北段1700号', city: '成都', region: '西南', lng: 104.0657, lat: 30.5723 },
  { address: '武汉市江夏区光谷大道77号', city: '武汉', region: '华中', lng: 114.4292, lat: 30.4936 },
  { address: '西安市雁塔区锦业路12号', city: '西安', region: '西北', lng: 108.9402, lat: 34.2207 },
]

// 订单来源
const SOURCES = ['ERP', 'WMS', 'ECOMMERCE', 'B2B', 'EDI']

// 订单状态
const STATUSES = ['PENDING', 'VALIDATED', 'SPLITTING', 'DISPATCHED', 'PROCESSING', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED', 'EXCEPTION']

// 优先级
const PRIORITIES = ['HIGH', 'NORMAL', 'LOW']

// 生成随机订单号
function genOrderNo() {
  const prefix = 'TMS'
  const date = '20260630'
  const random = Math.floor(Math.random() * 900000 + 100000)
  return `${prefix}${date}${random}`
}

// 生成随机数
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function randFloat(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
}

function pick(arr) {
  return arr[rand(0, arr.length - 1)]
}

// 生成单个订单货品明细
function genOrderItems() {
  const count = rand(2, 6)
  const items = []
  const usedCategories = []

  for (let i = 0; i < count; i++) {
    const tempZone = pick(['FROZEN', 'COLD', 'CONSTANT'])
    const categoryKey = tempZone
    const productName = pick(CATEGORIES[categoryKey])
    const qty = rand(10, 200)
    const weight = randFloat(0.2, 5.0)
    const volume = randFloat(0.001, 0.05, 3)
    const price = randFloat(15, 380)

    items.push({
      id: `ITEM${Date.now()}${i}`,
      productName,
      productCode: `SKU${rand(10000, 99999)}`,
      category: tempZone,
      tempZone,
      packageType: pick(['纸箱', '泡沫箱', '真空袋', '塑料筐', '保温箱']),
      quantity: qty,
      unit: pick(['箱', '份', '盒', '袋']),
      weight: parseFloat((qty * weight).toFixed(2)),
      volume: parseFloat((qty * volume).toFixed(3)),
      unitWeight: weight,
      unitVolume: volume,
      unitPrice: price,
      totalPrice: parseFloat((qty * price).toFixed(2)),
      stackLimit: rand(3, 8),
      productionBatch: `BATCH${rand(202601, 202612)}${rand(100, 999)}`,
      specialReq: Math.random() > 0.7 ? pick(['优先配送', '单独隔离', '轻拿轻放', '不可倒置']) : '',
    })
  }
  return items
}

// 生成单个订单
function genOrder(index) {
  const customer = pick(CUSTOMERS)
  const addr = pick(ADDRESSES)
  const source = pick(SOURCES)
  const status = pick(STATUSES)
  const priority = pick(PRIORITIES)
  const items = genOrderItems()

  const totalWeight = items.reduce((s, i) => s + i.weight, 0)
  const totalVolume = items.reduce((s, i) => s + i.volume, 0)
  const totalAmount = items.reduce((s, i) => s + i.totalPrice, 0)
  const tempZones = [...new Set(items.map(i => i.tempZone))]

  const createTime = new Date(Date.now() - rand(1, 72) * 3600000)
  const requireStart = new Date(createTime.getTime() + rand(2, 6) * 3600000)
  const requireEnd = new Date(requireStart.getTime() + rand(1, 4) * 3600000)

  return {
    id: index + 1,
    orderNo: genOrderNo(),
    externalOrderNo: `EXT${rand(100000, 999999)}`,
    source,
    sourceName: { ERP: 'ERP系统', WMS: 'WMS系统', ECOMMERCE: '电商平台', B2B: 'B端客户', EDI: 'EDI接入' }[source],
    customerName: customer,
    customerCode: `CUS${rand(1000, 9999)}`,
    contactPerson: pick(['张经理', '李主管', '王主任', '刘总', '陈老师', '赵采购']),
    contactPhone: `1${rand(30, 89)}${rand(10000000, 99999999)}`,
    deliveryAddress: addr.address,
    deliveryCity: addr.city,
    deliveryRegion: addr.region,
    lng: addr.lng,
    lat: addr.lat,
    status,
    priority,
    items,
    totalWeight: parseFloat(totalWeight.toFixed(2)),
    totalVolume: parseFloat(totalVolume.toFixed(3)),
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    itemCount: items.length,
    tempZones,
    createTime: createTime.toISOString(),
    requireTimeStart: requireStart.toISOString(),
    requireTimeEnd: requireEnd.toISOString(),
    remark: Math.random() > 0.8 ? pick(['请按时送达', '需要卸货协助', '收货需验温', '学校团餐需提前联系', '高价值货品请加强保护']) : '',
    carrierName: status !== 'PENDING' && status !== 'VALIDATED' ? pick(['顺丰冷运', '京东冷链', '中通冷链', '自营车队', '万象物流']) : '',
    vehicleNo: status !== 'PENDING' && status !== 'VALIDATED' && status !== 'SPLITTING' ? `沪A${rand(10000, 99999)}` : '',
    driverName: status === 'IN_TRANSIT' || status === 'DELIVERED' ? pick(['王师傅', '李师傅', '张师傅', '刘师傅']) : '',
  }
}

// 生成100条订单
const orders = []
for (let i = 0; i < 100; i++) {
  orders.push(genOrder(i))
}

// 订单追踪时间线
function genTimeline(order) {
  const timeline = []
  const baseTime = new Date(order.createTime)

  timeline.push({
    status: 'CREATED',
    title: '订单创建',
    desc: `订单由${order.sourceName}自动接入`,
    time: baseTime.toISOString(),
    operator: '系统',
  })

  if (['VALIDATED', 'SPLITTING', 'DISPATCHED', 'PROCESSING', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED'].includes(order.status)) {
    timeline.push({
      status: 'VALIDATED',
      title: '数据校验通过',
      desc: `温区[${order.tempZones.join('、')}]、时效、规格字段校验通过`,
      time: new Date(baseTime.getTime() + 5 * 60000).toISOString(),
      operator: '系统',
    })
  }

  if (['SPLITTING', 'DISPATCHED', 'PROCESSING', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED'].includes(order.status)) {
    timeline.push({
      status: 'SPLITTING',
      title: '自动分单',
      desc: order.tempZones.length > 1 ? `检测到多温区(${order.tempZones.length}个)，触发自动拆单` : '单温区订单，直接分配',
      time: new Date(baseTime.getTime() + 10 * 60000).toISOString(),
      operator: '规则引擎',
    })
  }

  if (['DISPATCHED', 'PROCESSING', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED'].includes(order.status)) {
    timeline.push({
      status: 'DISPATCHED',
      title: '运力匹配完成',
      desc: `已匹配承运商${order.carrierName}，车辆${order.vehicleNo}`,
      time: new Date(baseTime.getTime() + 15 * 60000).toISOString(),
      operator: '调度系统',
    })
  }

  if (['PROCESSING', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED'].includes(order.status)) {
    timeline.push({
      status: 'PROCESSING',
      title: '装车指令下发',
      desc: '装车指令已下发至WMS，拣货中',
      time: new Date(baseTime.getTime() + 20 * 60000).toISOString(),
      operator: '系统',
    })
  }

  if (['IN_TRANSIT', 'DELIVERED', 'COMPLETED'].includes(order.status)) {
    timeline.push({
      status: 'IN_TRANSIT',
      title: '车辆出发',
      desc: `${order.driverName}驾驶${order.vehicleNo}已出发`,
      time: new Date(baseTime.getTime() + 40 * 60000).toISOString(),
      operator: order.driverName,
    })
  }

  if (['DELIVERED', 'COMPLETED'].includes(order.status)) {
    timeline.push({
      status: 'DELIVERED',
      title: '货物送达',
      desc: '收货方已签收',
      time: new Date(baseTime.getTime() + 120 * 60000).toISOString(),
      operator: order.driverName,
    })
  }

  if (order.status === 'COMPLETED') {
    timeline.push({
      status: 'COMPLETED',
      title: '订单完成',
      desc: '回单已归档，运费已核算',
      time: new Date(baseTime.getTime() + 180 * 60000).toISOString(),
      operator: '系统',
    })
  }

  if (order.status === 'EXCEPTION') {
    timeline.push({
      status: 'EXCEPTION',
      title: '异常上报',
      desc: pick(['温度异常超阈值', '车辆偏离路线', '送达超时', '签收异常-数量短缺']),
      time: new Date(baseTime.getTime() + 90 * 60000).toISOString(),
      operator: '系统',
    })
  }

  return timeline
}

// 渠道接入配置
const channels = [
  { id: 1, name: 'ERP系统', code: 'ERP', type: 'API', status: 'ACTIVE', total: 35, syncFreq: '实时', lastSync: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: 2, name: 'WMS系统', code: 'WMS', type: 'API', status: 'ACTIVE', total: 28, syncFreq: '实时', lastSync: new Date(Date.now() - 3 * 60000).toISOString() },
  { id: 3, name: '天猫超市', code: 'ECOMMERCE', type: 'API', status: 'ACTIVE', total: 18, syncFreq: '每5分钟', lastSync: new Date(Date.now() - 2 * 60000).toISOString() },
  { id: 4, name: '京东到家', code: 'ECOMMERCE', type: 'API', status: 'ACTIVE', total: 12, syncFreq: '每5分钟', lastSync: new Date(Date.now() - 4 * 60000).toISOString() },
  { id: 5, name: 'B端客户EDI', code: 'EDI', type: 'EDI', status: 'ACTIVE', total: 5, syncFreq: '每小时', lastSync: new Date(Date.now() - 30 * 60000).toISOString() },
  { id: 6, name: '直营门店', code: 'B2B', type: 'API', status: 'INACTIVE', total: 2, syncFreq: '手动', lastSync: new Date(Date.now() - 3 * 3600000).toISOString() },
]

export { orders, genTimeline, channels }
