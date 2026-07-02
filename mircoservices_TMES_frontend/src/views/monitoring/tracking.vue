<template>
  <div class="page-container">
    <!-- 顶部统计 -->
    <el-row :gutter="16" class="stat-row">
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{ padding: '16px' }">
          <div class="mini-stat">
            <div class="mini-stat-icon" style="background: linear-gradient(135deg, #409EFF, #66b1ff);"><el-icon :size="20"><Van /></el-icon></div>
            <div>
              <div class="mini-stat-value">{{ stats.totalInTransit }}</div>
              <div class="mini-stat-label">在途车辆总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{ padding: '16px' }">
          <div class="mini-stat">
            <div class="mini-stat-icon" style="background: linear-gradient(135deg, #67C23A, #85ce61);"><el-icon :size="20"><CircleCheckFilled /></el-icon></div>
            <div>
              <div class="mini-stat-value">{{ stats.normalCount }}</div>
              <div class="mini-stat-label">正常车辆</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{ padding: '16px' }">
          <div class="mini-stat">
            <div class="mini-stat-icon" style="background: linear-gradient(135deg, #E6A23C, #ebb563);"><el-icon :size="20"><Warning /></el-icon></div>
            <div>
              <div class="mini-stat-value">{{ stats.warningCount }}</div>
              <div class="mini-stat-label">预警车辆</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{ padding: '16px' }">
          <div class="mini-stat">
            <div class="mini-stat-icon" style="background: linear-gradient(135deg, #F56C6C, #f78989);"><el-icon :size="20"><WarningFilled /></el-icon></div>
            <div>
              <div class="mini-stat-value">{{ stats.alertCount }}</div>
              <div class="mini-stat-label">异常车辆</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 左右布局：地图 + 列表 -->
    <el-row :gutter="16">
      <!-- 左侧地图 -->
      <el-col :span="14">
        <el-card shadow="never" class="map-card">
          <template #header>
            <div class="flex-between">
              <span class="card-title"><el-icon><MapLocation /></el-icon> 实时车辆分布图</span>
              <el-radio-group v-model="mapView" size="small">
                <el-radio-button value="all">全部</el-radio-button>
                <el-radio-button value="alert">仅异常</el-radio-button>
                <el-radio-button value="frozen">冷冻车</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="map-container">
            <div class="map-placeholder">
              <div class="map-grid">
                <div
                  v-for="v in filteredMapVehicles"
                  :key="v.id"
                  class="map-vehicle-pin"
                  :class="{ alert: v.hasAlert, selected: selectedVehicle?.id === v.id }"
                  :style="{ left: `${((v.currentLng - 116) / 6) * 100}%`, top: `${((32 - v.currentLat) / 3) * 100}%` }"
                  @click="selectVehicle(v)"
                >
                  <el-icon :size="16"><van /></el-icon>
                  <span class="pin-label">{{ v.vehicleNo }}</span>
                </div>
              </div>
              <div class="map-overlay">
                <div class="map-legend">
                  <span class="legend-item"><span class="legend-dot normal"></span>正常</span>
                  <span class="legend-item"><span class="legend-dot alert"></span>异常</span>
                  <span class="legend-item"><span class="legend-dot selected"></span>选中</span>
                </div>
                <div class="map-info">
                  <el-icon><Location /></el-icon> 华东区域 | {{ filteredMapVehicles.length }} 辆在途车辆
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧车辆列表 -->
      <el-col :span="10">
        <el-card shadow="never" class="list-card">
          <template #header>
            <div class="flex-between">
              <span class="card-title"><el-icon><List /></el-icon> 在途车辆列表</span>
              <el-input v-model="query.keyword" placeholder="车牌/司机" clearable size="small" style="width: 140px" @keyup.enter="loadData" @clear="loadData" />
            </div>
          </template>
          <div class="vehicle-list" v-loading="loading">
            <div
              v-for="v in list"
              :key="v.id"
              class="vehicle-item"
              :class="{ active: selectedVehicle?.id === v.id, alert: v.hasAlert }"
              @click="selectVehicle(v)"
            >
              <div class="vehicle-header">
                <span class="vehicle-no">{{ v.vehicleNo }}</span>
                <el-tag :type="TRACKING_STATUS_MAP[v.status]?.type" size="small">{{ TRACKING_STATUS_MAP[v.status]?.label }}</el-tag>
                <el-badge v-if="v.hasAlert" :value="v.alertCount" type="danger" />
              </div>
              <div class="vehicle-info">
                <span><el-icon><User /></el-icon> {{ v.driverName }}</span>
                <span><el-icon><Odometer /></el-icon> {{ v.speed }}km/h</span>
                <span><el-icon><Position /></el-icon> {{ v.currentLocation }}</span>
              </div>
              <div class="vehicle-temp">
                <template v-for="(temp, zone) in v.currentTemp" :key="zone">
                  <span class="temp-badge" :style="{ color: getTempZoneTag(zone).color }">
                    {{ getTempZoneTag(zone).label }}: {{ temp }}°C
                  </span>
                </template>
                <el-tag v-if="v.refrigerationStatus === 'WARNING'" type="danger" size="small" effect="plain">制冷异常</el-tag>
              </div>
              <div class="vehicle-progress">
                <span class="progress-label">配送进度 {{ v.completedStops }}/{{ v.totalStops }}</span>
                <el-progress :percentage="Math.round((v.completedStops / v.totalStops) * 100)" :stroke-width="6" :show-text="false" />
              </div>
              <div v-if="v.nextStop" class="vehicle-next">
                <el-icon><Clock /></el-icon> 下一站: {{ v.nextStop.customerName }} | ETA: {{ v.nextStop.eta }} | 距离: {{ v.nextStop.distance }}km
              </div>
            </div>
          </div>
          <div class="pagination-wrap">
            <el-pagination v-model:current-page="query.page" v-model:page-size="query.pageSize" :total="total" :page-sizes="[10, 20]" layout="total, prev, pager, next" small @current-change="loadData" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 车辆详情弹窗 -->
    <el-dialog v-model="detailVisible" title="车辆实时追踪详情" width="800px" top="5vh">
      <template v-if="selectedVehicle">
        <el-descriptions :column="3" border size="small">
          <el-descriptions-item label="车牌号">{{ selectedVehicle.vehicleNo }}</el-descriptions-item>
          <el-descriptions-item label="司机">{{ selectedVehicle.driverName }}</el-descriptions-item>
          <el-descriptions-item label="电话">{{ selectedVehicle.driverPhone }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="TRACKING_STATUS_MAP[selectedVehicle.status]?.type" size="small">{{ TRACKING_STATUS_MAP[selectedVehicle.status]?.label }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="速度">{{ selectedVehicle.speed }} km/h</el-descriptions-item>
          <el-descriptions-item label="油量">{{ selectedVehicle.fuelLevel }}%</el-descriptions-item>
          <el-descriptions-item label="当前位置">{{ selectedVehicle.currentLocation }}</el-descriptions-item>
          <el-descriptions-item label="路径方案">{{ selectedVehicle.routePlanNo }}</el-descriptions-item>
          <el-descriptions-item label="出发时间">{{ selectedVehicle.departedTime }}</el-descriptions-item>
          <el-descriptions-item label="预计到达">{{ selectedVehicle.estimatedArrival }}</el-descriptions-item>
          <el-descriptions-item label="配送进度">{{ selectedVehicle.completedStops }}/{{ selectedVehicle.totalStops }} 站</el-descriptions-item>
          <el-descriptions-item label="车门状态">
            <el-tag :type="selectedVehicle.doorStatus === 'CLOSED' ? 'success' : 'warning'" size="small">{{ selectedVehicle.doorStatus === 'CLOSED' ? '已关闭' : '已开启' }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <el-divider content-position="left">实时温湿度监控</el-divider>
        <el-row :gutter="16">
          <el-col :span="8" v-for="(temp, zone) in selectedVehicle.currentTemp" :key="zone">
            <el-card shadow="hover" :body-style="{ padding: '16px' }">
              <div class="temp-monitor-card">
                <div class="temp-zone-label" :style="{ color: getTempZoneTag(zone).color }">{{ getTempZoneTag(zone).label }}</div>
                <div class="temp-value" :style="{ color: getTempZoneTag(zone).color }">{{ temp }}°C</div>
                <div class="temp-standard">标准: {{ getTempZoneTag(zone).temp }}</div>
                <el-tag :type="checkTempNormal(zone, temp) ? 'success' : 'danger'" size="small" effect="plain">
                  {{ checkTempNormal(zone, temp) ? '正常' : '异常' }}
                </el-tag>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <el-divider content-position="left">温度变化趋势（近1小时）</el-divider>
        <div ref="tempChartRef" style="height: 220px;"></div>

        <el-divider content-position="left">下一站信息</el-divider>
        <template v-if="selectedVehicle.nextStop">
          <el-descriptions :column="2" border size="small">
            <el-descriptions-item label="客户">{{ selectedVehicle.nextStop.customerName }}</el-descriptions-item>
            <el-descriptions-item label="地址">{{ selectedVehicle.nextStop.address }}</el-descriptions-item>
            <el-descriptions-item label="预计到达">{{ selectedVehicle.nextStop.eta }}</el-descriptions-item>
            <el-descriptions-item label="距离">{{ selectedVehicle.nextStop.distance }} km</el-descriptions-item>
          </el-descriptions>
        </template>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue'
import * as echarts from 'echarts'
import { getTrackingVehicleList, getMonitoringStats } from '@/api/monitoring'
import { TRACKING_STATUS_MAP, TEMP_ZONE_MAP, getTempZoneTag } from '@/utils/format'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const query = reactive({ page: 1, pageSize: 20, keyword: '', status: '', hasAlert: '' })
const stats = ref({ totalInTransit: 0, normalCount: 0, warningCount: 0, alertCount: 0 })
const mapView = ref('all')
const selectedVehicle = ref(null)
const detailVisible = ref(false)
const tempChartRef = ref(null)
let tempChart = null

const filteredMapVehicles = computed(() => {
  if (mapView.value === 'alert') return list.value.filter(v => v.hasAlert)
  if (mapView.value === 'frozen') return list.value.filter(v => v.tempZones.includes('FROZEN'))
  return list.value
})

async function loadData() {
  loading.value = true
  try {
    const res = await getTrackingVehicleList(query)
    list.value = res.data.records
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

async function loadStats() {
  const res = await getMonitoringStats()
  stats.value = res.data
}

function selectVehicle(v) {
  selectedVehicle.value = v
  detailVisible.value = true
  nextTick(() => renderTempChart(v))
}

function renderTempChart(v) {
  if (!tempChartRef.value) return
  if (tempChart) tempChart.dispose()
  tempChart = echarts.init(tempChartRef.value)
  const zones = Object.keys(v.currentTemp)
  const series = zones.map(zone => ({
    name: getTempZoneTag(zone).label,
    type: 'line',
    smooth: true,
    data: v.tempHistory.map(h => h.temp + (zone === 'FROZEN' ? -5 : zone === 'COLD' ? 10 : 20)),
    itemStyle: { color: getTempZoneTag(zone).color },
  }))
  tempChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: zones.map(z => getTempZoneTag(z).label), bottom: 0 },
    grid: { left: '3%', right: '4%', top: '5%', containLabel: true },
    xAxis: { type: 'category', data: v.tempHistory.map(h => h.time) },
    yAxis: { type: 'value', name: '温度(°C)' },
    series,
  })
}

function checkTempNormal(zone, temp) {
  if (zone === 'FROZEN') return temp <= -16
  if (zone === 'COLD') return temp >= 0 && temp <= 5
  if (zone === 'CONSTANT') return temp >= 10 && temp <= 15
  return true
}

watch(detailVisible, (val) => {
  if (!val && tempChart) {
    tempChart.dispose()
    tempChart = null
  }
})

onMounted(() => {
  loadStats()
  loadData()
})
</script>

<style scoped>
.stat-row { margin-bottom: 16px; }
.mini-stat { display: flex; align-items: center; gap: 12px; }
.mini-stat-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
.mini-stat-value { font-size: 24px; font-weight: 700; color: #303133; }
.mini-stat-label { font-size: 12px; color: #909399; }

.card-title { font-weight: 600; display: flex; align-items: center; gap: 6px; }

.map-card { height: 560px; display: flex; flex-direction: column; }
.map-card :deep(.el-card__body) { flex: 1; overflow: hidden; padding: 0; }
.map-container { height: 100%; }
.map-placeholder {
  width: 100%; height: 100%; background: linear-gradient(135deg, #e8f4f8 0%, #d1ecf4 50%, #e8f4f8 100%);
  position: relative; overflow: hidden;
}
.map-grid {
  width: 100%; height: 100%; position: relative;
  background-image:
    linear-gradient(rgba(64,158,255,0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(64,158,255,0.1) 1px, transparent 1px);
  background-size: 40px 40px;
}
.map-vehicle-pin {
  position: absolute; width: 28px; height: 28px; border-radius: 50% 50% 50% 0;
  background: #409EFF; color: #fff; display: flex; align-items: center; justify-content: center;
  transform: rotate(-45deg); cursor: pointer; transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2); z-index: 2;
}
.map-vehicle-pin.alert { background: #F56C6C; }
.map-vehicle-pin.selected { background: #E6A23C; transform: rotate(-45deg) scale(1.3); z-index: 3; }
.map-vehicle-pin .el-icon { transform: rotate(45deg); }
.pin-label {
  position: absolute; top: 32px; left: 50%; transform: translateX(-50%) rotate(45deg);
  white-space: nowrap; font-size: 10px; background: rgba(0,0,0,0.7); color: #fff;
  padding: 1px 6px; border-radius: 3px; pointer-events: none;
}
.map-overlay { position: absolute; bottom: 12px; left: 12px; right: 12px; display: flex; justify-content: space-between; align-items: center; }
.map-legend { display: flex; gap: 16px; background: rgba(255,255,255,0.9); padding: 6px 12px; border-radius: 6px; }
.legend-item { display: flex; align-items: center; gap: 4px; font-size: 12px; }
.legend-dot { width: 10px; height: 10px; border-radius: 50%; }
.legend-dot.normal { background: #409EFF; }
.legend-dot.alert { background: #F56C6C; }
.legend-dot.selected { background: #E6A23C; }
.map-info { background: rgba(255,255,255,0.9); padding: 6px 12px; border-radius: 6px; font-size: 12px; display: flex; align-items: center; gap: 4px; }

.list-card { height: 560px; display: flex; flex-direction: column; }
.list-card :deep(.el-card__body) { flex: 1; overflow: hidden; display: flex; flex-direction: column; }
.vehicle-list { flex: 1; overflow-y: auto; }
.vehicle-item {
  padding: 12px; border: 1px solid #ebeef5; border-radius: 8px; margin-bottom: 8px;
  cursor: pointer; transition: all 0.2s;
}
.vehicle-item:hover { border-color: #409EFF; box-shadow: 0 2px 8px rgba(64,158,255,0.15); }
.vehicle-item.active { border-color: #E6A23C; background: #fdf6ec; }
.vehicle-item.alert { border-left: 3px solid #F56C6C; }
.vehicle-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.vehicle-no { font-weight: 600; font-size: 14px; color: #303133; }
.vehicle-info { display: flex; gap: 12px; font-size: 12px; color: #606266; margin-bottom: 4px; flex-wrap: wrap; }
.vehicle-info span { display: flex; align-items: center; gap: 2px; }
.vehicle-temp { display: flex; gap: 8px; align-items: center; margin-bottom: 6px; flex-wrap: wrap; }
.temp-badge { font-size: 12px; font-weight: 600; }
.vehicle-progress { margin-bottom: 4px; }
.progress-label { font-size: 11px; color: #909399; margin-bottom: 2px; display: block; }
.vehicle-next { font-size: 12px; color: #409EFF; display: flex; align-items: center; gap: 4px; }
.pagination-wrap { padding: 8px 0; }

.temp-monitor-card { text-align: center; }
.temp-zone-label { font-size: 13px; font-weight: 600; margin-bottom: 4px; }
.temp-value { font-size: 28px; font-weight: 700; }
.temp-standard { font-size: 12px; color: #909399; margin: 4px 0 8px; }
</style>
