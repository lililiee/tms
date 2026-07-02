import dayjs from 'dayjs'

/**
 * 格式化日期时间
 */
export function formatDateTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return '-'
  return dayjs(date).format(format)
}

/**
 * 格式化日期
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
  if (!date) return '-'
  return dayjs(date).format(format)
}

/**
 * 格式化金额
 */
export function formatMoney(num) {
  if (num === null || num === undefined) return '-'
  return `¥${Number(num).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/**
 * 格式化重量
 */
export function formatWeight(num) {
  if (num === null || num === undefined) return '-'
  return `${Number(num).toFixed(2)} kg`
}

/**
 * 格式化体积
 */
export function formatVolume(num) {
  if (num === null || num === undefined) return '-'
  return `${Number(num).toFixed(3)} m³`
}

/**
 * 订单状态映射
 */
export const ORDER_STATUS_MAP = {
  PENDING: { label: '待处理', type: 'info' },
  VALIDATED: { label: '已校验', type: '' },
  SPLITTING: { label: '分单中', type: 'warning' },
  DISPATCHED: { label: '已分拨', type: 'success' },
  PROCESSING: { label: '处理中', type: 'warning' },
  IN_TRANSIT: { label: '运输中', type: 'primary' },
  DELIVERED: { label: '已送达', type: 'success' },
  COMPLETED: { label: '已完成', type: 'success' },
  EXCEPTION: { label: '异常', type: 'danger' },
  CANCELLED: { label: '已取消', type: 'info' },
}

export function getOrderStatusTag(status) {
  return ORDER_STATUS_MAP[status] || { label: status, type: 'info' }
}

/**
 * 温区映射
 */
export const TEMP_ZONE_MAP = {
  FROZEN: { label: '冷冻', temp: '≤-18℃', tagClass: 'temp-tag-frozen', color: '#409EFF' },
  COLD: { label: '冷藏', temp: '0~4℃', tagClass: 'temp-tag-cold', color: '#67C23A' },
  CONSTANT: { label: '恒温', temp: '10~15℃', tagClass: 'temp-tag-constant', color: '#E6A23C' },
}

export function getTempZoneTag(zone) {
  return TEMP_ZONE_MAP[zone] || { label: zone, temp: '-', tagClass: '', color: '#909399' }
}

/**
 * 订单来源渠道映射
 */
export const ORDER_SOURCE_MAP = {
  ERP: 'ERP系统',
  WMS: 'WMS系统',
  ECOMMERCE: '电商平台',
  B2B: 'B端客户',
  EDI: 'EDI接入',
  MANUAL: '手工录入',
}

/**
 * 优先级映射
 */
export const PRIORITY_MAP = {
  HIGH: { label: '高优先', type: 'danger' },
  NORMAL: { label: '普通', type: 'info' },
  LOW: { label: '低优先', type: '' },
}

/**
 * 车辆状态映射
 */
export const VEHICLE_STATUS_MAP = {
  IDLE: { label: '空闲', type: 'success' },
  LOADING: { label: '装车中', type: 'warning' },
  IN_TRANSIT: { label: '在途', type: 'primary' },
  UNLOADING: { label: '卸货中', type: 'warning' },
  MAINTENANCE: { label: '维修中', type: 'danger' },
  OFFLINE: { label: '离线', type: 'info' },
}

export function getVehicleStatusTag(status) {
  return VEHICLE_STATUS_MAP[status] || { label: status, type: 'info' }
}

/**
 * 配载方案状态映射
 */
export const LOADING_PLAN_STATUS_MAP = {
  DRAFT: { label: '草稿', type: 'info' },
  RECOMMENDED: { label: 'AI推荐', type: 'warning' },
  CONFIRMED: { label: '已确认', type: 'success' },
  EXECUTING: { label: '执行中', type: 'primary' },
  COMPLETED: { label: '已完成', type: 'success' },
}

/**
 * 路径规划状态映射
 */
export const ROUTE_PLAN_STATUS_MAP = {
  DRAFT: { label: '草稿', type: 'info' },
  RECOMMENDED: { label: 'AI推荐', type: 'warning' },
  CONFIRMED: { label: '已确认', type: 'success' },
  EXECUTING: { label: '执行中', type: 'primary' },
  COMPLETED: { label: '已完成', type: 'success' },
}

/**
 * 调度任务状态映射
 */
export const DISPATCH_TASK_STATUS_MAP = {
  PENDING: { label: '待同步', type: 'info' },
  SYNCING: { label: '同步中', type: 'warning' },
  SYNCED: { label: '已同步', type: '' },
  EXECUTING: { label: '执行中', type: 'primary' },
  COMPLETED: { label: '已完成', type: 'success' },
}

/**
 * 动态事件类型映射
 */
export const DYNAMIC_EVENT_TYPE_MAP = {
  TRAFFIC_JAM: { label: '交通拥堵', icon: 'Warning' },
  ROAD_CLOSED: { label: '道路封闭', icon: 'CircleClose' },
  VEHICLE_FAULT: { label: '车辆故障', icon: 'WarningFilled' },
  NEW_ORDER: { label: '新增订单', icon: 'Plus' },
  TIME_WINDOW_CHANGE: { label: '时间窗变更', icon: 'Timer' },
  TEMP_ALERT: { label: '温控异常', icon: 'WarningFilled' },
  ROUTE_DEVIATION: { label: '路线偏离', icon: 'Position' },
}

/**
 * 严重程度映射
 */
export const SEVERITY_MAP = {
  HIGH: { label: '高', type: 'danger' },
  MEDIUM: { label: '中', type: 'warning' },
  LOW: { label: '低', type: 'info' },
}

/**
 * 预警级别映射
 */
export const ALERT_LEVEL_MAP = {
  RED: { label: '红色预警', type: 'danger', color: '#F56C6C', bgClass: 'alert-red' },
  ORANGE: { label: '橙色预警', type: 'warning', color: '#E6A23C', bgClass: 'alert-orange' },
  YELLOW: { label: '黄色预警', type: 'info', color: '#909399', bgClass: 'alert-yellow' },
}

export function getAlertLevelTag(level) {
  return ALERT_LEVEL_MAP[level] || { label: level, type: 'info', color: '#909399' }
}

/**
 * 预警类型映射
 */
export const ALERT_TYPE_MAP = {
  TEMP_CONTROL: { label: '温控异常', icon: 'WarningFilled' },
  TIMEOUT: { label: '时效异常', icon: 'Timer' },
  ROUTE_DEVIATION: { label: '路线偏离', icon: 'Position' },
  EQUIPMENT_FAULT: { label: '设备故障', icon: 'CircleClose' },
  SPEED_ABNORMAL: { label: '速度异常', icon: 'Odometer' },
  DOOR_OPEN: { label: '车门异常', icon: 'Unlock' },
}

/**
 * 预警状态映射
 */
export const ALERT_STATUS_MAP = {
  PENDING: { label: '待处理', type: 'danger' },
  PROCESSING: { label: '处理中', type: 'warning' },
  RESOLVED: { label: '已解决', type: 'success' },
  ESCALATED: { label: '已升级', type: 'danger' },
}

/**
 * 异常处置类型映射
 */
export const EMERGENCY_TYPE_MAP = {
  REFRIGERATION_FAULT: { label: '制冷故障', type: 'danger' },
  TRAFFIC_ACCIDENT: { label: '交通事故', type: 'danger' },
  SEVERE_JAM: { label: '严重拥堵', type: 'warning' },
  CARGO_DAMAGE_RISK: { label: '货损风险', type: 'danger' },
  VEHICLE_BREAKDOWN: { label: '车辆抛锚', type: 'warning' },
  REJECT_RISK: { label: '拒收风险', type: 'warning' },
}

/**
 * 异常处置状态映射
 */
export const EMERGENCY_STATUS_MAP = {
  IN_PROGRESS: { label: '处置中', type: 'warning' },
  RESOLVED: { label: '已解决', type: 'success' },
  ESCALATED: { label: '已升级', type: 'danger' },
  CLOSED: { label: '已关闭', type: 'info' },
}

/**
 * 电子围栏类型映射
 */
export const GEOFENCE_TYPE_MAP = {
  WAREHOUSE: { label: '仓库', icon: 'House' },
  CUSTOMER: { label: '客户网点', icon: 'OfficeBuilding' },
  ROAD_SEGMENT: { label: '路段管控', icon: 'Guide' },
}

/**
 * 围栏触发类型映射
 */
export const GEOFENCE_TRIGGER_MAP = {
  ENTER: { label: '进入', type: 'success' },
  LEAVE: { label: '离开', type: 'info' },
  DWELL: { label: '停留', type: 'warning' },
}

/**
 * 追踪车辆状态映射
 */
export const TRACKING_STATUS_MAP = {
  IN_TRANSIT: { label: '在途运输', type: 'primary' },
  AT_WAREHOUSE: { label: '在仓库', type: '' },
  AT_CUSTOMER: { label: '在客户点', type: 'success' },
  LOADING: { label: '装车中', type: 'warning' },
  UNLOADING: { label: '卸货中', type: 'warning' },
}

/**
 * 车辆归属映射
 */
export const OWNERSHIP_MAP = {
  SELF: '自有车辆',
  LEASED: '租赁车辆',
  CARRIER: '承运商车辆',
}

/**
 * 路况映射
 */
export const TRAFFIC_CONDITION_MAP = {
  SMOOTH: { label: '畅通', type: 'success' },
  MODERATE: { label: '一般', type: 'warning' },
  CONGESTED: { label: '拥堵', type: 'danger' },
}

/**
 * 天气映射
 */
export const WEATHER_MAP = {
  SUNNY: '晴',
  CLOUDY: '多云',
  RAIN: '雨',
  STORM: '暴雨',
}

/**
 * 混装禁忌检查
 */
export const MIXING_TABOO = {
  // 活鲜与熟食不可共箱
  FRESH_COOKED: '活鲜与熟食不可共箱',
  // 带冰鲜品与干粉类不可同舱
  ICED_DRY: '带冰鲜品与干粉类不可同舱',
  // 高呼吸强度果蔬与低温乳品不可相邻
  VEG_DAIRY: '高呼吸强度果蔬与低温乳品不可相邻',
}

/**
 * 混装禁忌校验
 */
export function checkMixingTaboo(items) {
  const warnings = []
  const hasFresh = items.some(i => i.category === 'FRESH')
  const hasCooked = items.some(i => i.category === 'COOKED')
  const hasIced = items.some(i => i.category === 'ICED')
  const hasDry = items.some(i => i.category === 'DRY')
  const hasVeg = items.some(i => i.category === 'VEGETABLE')
  const hasDairy = items.some(i => i.category === 'DAIRY')

  if (hasFresh && hasCooked) warnings.push(MIXING_TABOO.FRESH_COOKED)
  if (hasIced && hasDry) warnings.push(MIXING_TABOO.ICED_DRY)
  if (hasVeg && hasDairy) warnings.push(MIXING_TABOO.VEG_DAIRY)
  return warnings
}
