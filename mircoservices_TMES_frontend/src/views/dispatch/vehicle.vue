<template>
  <div class="page-container">
    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stat-row">
      <el-col :span="6" v-for="card in statCards" :key="card.key">
        <el-card shadow="hover" class="stat-card" :body-style="{ padding: '20px' }">
          <div class="stat-card-inner">
            <div class="stat-icon" :style="{ background: card.bg }">
              <el-icon :size="24"><component :is="card.icon" /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ card.value }}</div>
              <div class="stat-label">{{ card.label }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Tab切换 -->
    <el-tabs v-model="activeTab" class="content-tabs">
      <el-tab-pane label="车辆资源池" name="vehicle">
        <!-- 筛选栏 -->
        <el-card shadow="never" class="filter-card">
          <el-form :inline="true" :model="vehicleQuery" size="default">
            <el-form-item label="车牌/司机">
              <el-input v-model="vehicleQuery.keyword" placeholder="车牌号/司机名/承运商" clearable style="width: 200px" @keyup.enter="loadVehicles" />
            </el-form-item>
            <el-form-item label="车辆状态">
              <el-select v-model="vehicleQuery.status" placeholder="全部" clearable style="width: 130px">
                <el-option v-for="(v, k) in VEHICLE_STATUS_MAP" :key="k" :label="v.label" :value="k" />
              </el-select>
            </el-form-item>
            <el-form-item label="温区">
              <el-select v-model="vehicleQuery.tempZone" placeholder="全部" clearable style="width: 120px">
                <el-option v-for="(v, k) in TEMP_ZONE_MAP" :key="k" :label="v.label" :value="k" />
              </el-select>
            </el-form-item>
            <el-form-item label="归属">
              <el-select v-model="vehicleQuery.ownership" placeholder="全部" clearable style="width: 130px">
                <el-option v-for="(v, k) in OWNERSHIP_MAP" :key="k" :label="v" :value="k" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="loadVehicles"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="resetVehicleQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 车辆表格 -->
        <el-card shadow="never" class="table-card">
          <el-table :data="vehicleList" v-loading="loading" border stripe size="default">
            <el-table-column prop="vehicleNo" label="车牌号" width="110" fixed="left" />
            <el-table-column prop="vehicleType" label="车型" width="140" />
            <el-table-column prop="brand" label="品牌" width="130" />
            <el-table-column label="载重/容积" width="140">
              <template #default="{ row }">
                <span>{{ row.maxWeight }}t / {{ row.maxVolume }}m³</span>
              </template>
            </el-table-column>
            <el-table-column label="温区" width="150">
              <template #default="{ row }">
                <el-tag v-for="z in row.tempZones" :key="z" :type="getTempZoneTag(z).type" size="small" class="mr4">{{ getTempZoneTag(z).label }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="隔板" width="60" align="center">
              <template #default="{ row }">
                <el-icon v-if="row.hasPartition" color="#67C23A"><Check /></el-icon>
                <el-icon v-else color="#C0C4CC"><Close /></el-icon>
              </template>
            </el-table-column>
            <el-table-column prop="currentLocation" label="当前位置" width="160" show-overflow-tooltip />
            <el-table-column label="状态" width="90" align="center">
              <template #default="{ row }">
                <el-tag :type="getVehicleStatusTag(row.status).type" size="small">{{ getVehicleStatusTag(row.status).label }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="制冷设备" width="90" align="center">
              <template #default="{ row }">
                <el-tag :type="row.refrigerationStatus === 'NORMAL' ? 'success' : 'danger'" size="small" effect="plain">
                  {{ row.refrigerationStatus === 'NORMAL' ? '正常' : '故障' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="归属" width="100">
              <template #default="{ row }">{{ OWNERSHIP_MAP[row.ownership] }}</template>
            </el-table-column>
            <el-table-column prop="carrierName" label="承运商" width="130" show-overflow-tooltip />
            <el-table-column prop="driverName" label="当前司机" width="90" />
            <el-table-column label="利用率" width="100">
              <template #default="{ row }">
                <el-progress :percentage="row.utilizationRate" :stroke-width="6" :color="row.utilizationRate > 80 ? '#67C23A' : '#409EFF'" />
              </template>
            </el-table-column>
            <el-table-column label="今日任务" width="80" align="center" prop="todayTasks" />
            <el-table-column label="操作" width="120" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" size="small" @click="showVehicleDetail(row)">详情</el-button>
                <el-button link type="primary" size="small">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-wrap">
            <el-pagination
              v-model:current-page="vehicleQuery.page"
              v-model:page-size="vehicleQuery.pageSize"
              :total="vehicleTotal"
              :page-sizes="[10, 20, 50]"
              layout="total, sizes, prev, pager, next"
              @size-change="loadVehicles"
              @current-change="loadVehicles"
            />
          </div>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="司机管理" name="driver">
        <el-card shadow="never" class="filter-card">
          <el-form :inline="true" :model="driverQuery" size="default">
            <el-form-item label="姓名/电话">
              <el-input v-model="driverQuery.keyword" placeholder="司机姓名/电话/车牌" clearable style="width: 200px" @keyup.enter="loadDrivers" />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="driverQuery.status" placeholder="全部" clearable style="width: 130px">
                <el-option label="可用" value="AVAILABLE" />
                <el-option label="执勤中" value="ON_DUTY" />
                <el-option label="休息中" value="RESTING" />
                <el-option label="离线" value="OFFLINE" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="loadDrivers"><el-icon><Search /></el-icon> 查询</el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card shadow="never" class="table-card">
          <el-table :data="driverList" v-loading="loading2" border stripe size="default">
            <el-table-column prop="name" label="姓名" width="80" fixed="left" />
            <el-table-column prop="phone" label="电话" width="130" />
            <el-table-column prop="licenseType" label="准驾车型" width="90" align="center" />
            <el-table-column prop="licenseExpiry" label="驾照到期" width="120" />
            <el-table-column label="状态" width="90" align="center">
              <template #default="{ row }">
                <el-tag :type="driverStatusType(row.status)" size="small">{{ driverStatusLabel(row.status) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="vehicleNo" label="绑定车辆" width="110" />
            <el-table-column prop="todayTasks" label="今日任务" width="80" align="center" />
            <el-table-column prop="monthTasks" label="月任务数" width="80" align="center" />
            <el-table-column label="评分" width="120">
              <template #default="{ row }">
                <el-rate v-model="row.score" disabled :max="5" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="总里程" width="110">
              <template #default="{ row }">{{ (row.totalMileage / 10000).toFixed(1) }}万km</template>
            </el-table-column>
            <el-table-column prop="workYears" label="驾龄" width="70" align="center">
              <template #default="{ row }">{{ row.workYears }}年</template>
            </el-table-column>
            <el-table-column label="健康" width="70" align="center">
              <template #default><el-tag type="success" size="small" effect="plain">健康</el-tag></template>
            </el-table-column>
          </el-table>
          <div class="pagination-wrap">
            <el-pagination
              v-model:current-page="driverQuery.page"
              v-model:page-size="driverQuery.pageSize"
              :total="driverTotal"
              :page-sizes="[10, 20, 50]"
              layout="total, sizes, prev, pager, next"
              @size-change="loadDrivers"
              @current-change="loadDrivers"
            />
          </div>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="承运商管理" name="carrier">
        <el-card shadow="never" class="table-card">
          <el-table :data="carrierList" border stripe size="default">
            <el-table-column prop="name" label="承运商名称" width="180" fixed="left" />
            <el-table-column prop="code" label="编码" width="100" />
            <el-table-column label="类型" width="80" align="center">
              <template #default="{ row }">
                <el-tag :type="row.type === 'SELF' ? 'success' : 'primary'" size="small">{{ row.type === 'SELF' ? '自有' : '第三方' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="contact" label="联系人" width="90" />
            <el-table-column prop="phone" label="联系电话" width="130" />
            <el-table-column prop="serviceArea" label="服务区域" width="120" />
            <el-table-column prop="vehicleCount" label="车辆数" width="80" align="center" />
            <el-table-column label="评分" width="100">
              <template #default="{ row }">
                <span style="color: #E6A23C; font-weight: 600;">{{ row.rating }}</span> / 5.0
              </template>
            </el-table-column>
            <el-table-column label="准时率" width="130">
              <template #default="{ row }">
                <el-progress :percentage="row.onTimeRate" :stroke-width="8" :color="row.onTimeRate > 95 ? '#67C23A' : '#E6A23C'" />
              </template>
            </el-table-column>
            <el-table-column prop="cooperationStart" label="合作起始" width="120" />
            <el-table-column label="状态" width="90" align="center">
              <template #default="{ row }">
                <el-tag :type="row.status === 'ACTIVE' ? 'success' : 'warning'" size="small">{{ row.status === 'ACTIVE' ? '合作中' : '试用中' }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- 车辆详情弹窗 -->
    <el-dialog v-model="detailVisible" title="车辆详情" width="700px">
      <el-descriptions v-if="currentVehicle" :column="2" border>
        <el-descriptions-item label="车牌号">{{ currentVehicle.vehicleNo }}</el-descriptions-item>
        <el-descriptions-item label="车型">{{ currentVehicle.vehicleType }}</el-descriptions-item>
        <el-descriptions-item label="品牌">{{ currentVehicle.brand }}</el-descriptions-item>
        <el-descriptions-item label="归属">{{ OWNERSHIP_MAP[currentVehicle.ownership] }}</el-descriptions-item>
        <el-descriptions-item label="核定载重">{{ currentVehicle.maxWeight }} 吨</el-descriptions-item>
        <el-descriptions-item label="有效容积">{{ currentVehicle.maxVolume }} m³</el-descriptions-item>
        <el-descriptions-item label="支持温区">
          <el-tag v-for="z in currentVehicle.tempZones" :key="z" :type="getTempZoneTag(z).type" size="small" class="mr4">{{ getTempZoneTag(z).label }} {{ getTempZoneTag(z).temp }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="隔板配置">{{ currentVehicle.hasPartition ? '配备可移动隔热隔板' : '无隔板' }}</el-descriptions-item>
        <el-descriptions-item label="制冷设备">{{ currentVehicle.refrigerationStatus === 'NORMAL' ? '运行正常' : '故障-需维修' }}</el-descriptions-item>
        <el-descriptions-item label="当前位置">{{ currentVehicle.currentLocation }}</el-descriptions-item>
        <el-descriptions-item label="承运商">{{ currentVehicle.carrierName }}</el-descriptions-item>
        <el-descriptions-item label="当前司机">{{ currentVehicle.driverName }} ({{ currentVehicle.driverPhone }})</el-descriptions-item>
        <el-descriptions-item label="最近年检">{{ currentVehicle.lastInspection }}</el-descriptions-item>
        <el-descriptions-item label="最近消毒">{{ currentVehicle.lastDisinfection }}</el-descriptions-item>
        <el-descriptions-item label="保险到期">{{ currentVehicle.insuranceExpiry }}</el-descriptions-item>
        <el-descriptions-item label="今日任务">{{ currentVehicle.todayTasks }} 单</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getVehicleList, getDriverList, getCarrierList, getDispatchStats } from '@/api/dispatch'
import { VEHICLE_STATUS_MAP, TEMP_ZONE_MAP, OWNERSHIP_MAP, getVehicleStatusTag, getTempZoneTag } from '@/utils/format'

const activeTab = ref('vehicle')
const loading = ref(false)
const loading2 = ref(false)

const statCards = ref([
  { key: 'total', label: '车辆总数', value: 0, icon: 'Van', bg: 'linear-gradient(135deg, #409EFF, #66b1ff)' },
  { key: 'available', label: '可用车辆', value: 0, icon: 'CircleCheck', bg: 'linear-gradient(135deg, #67C23A, #85ce61)' },
  { key: 'transit', label: '在途车辆', value: 0, icon: 'Position', bg: 'linear-gradient(135deg, #E6A23C, #ebb563)' },
  { key: 'utilization', label: '平均利用率', value: '0%', icon: 'TrendCharts', bg: 'linear-gradient(135deg, #F56C6C, #f78989)' },
])

const vehicleQuery = reactive({ page: 1, pageSize: 20, keyword: '', status: '', tempZone: '', ownership: '', region: '' })
const vehicleList = ref([])
const vehicleTotal = ref(0)

const driverQuery = reactive({ page: 1, pageSize: 20, keyword: '', status: '' })
const driverList = ref([])
const driverTotal = ref(0)

const carrierList = ref([])
const detailVisible = ref(false)
const currentVehicle = ref(null)

async function loadVehicles() {
  loading.value = true
  try {
    const res = await getVehicleList(vehicleQuery)
    vehicleList.value = res.data.records
    vehicleTotal.value = res.data.total
  } finally {
    loading.value = false
  }
}

async function loadDrivers() {
  loading2.value = true
  try {
    const res = await getDriverList(driverQuery)
    driverList.value = res.data.records
    driverTotal.value = res.data.total
  } finally {
    loading2.value = false
  }
}

async function loadCarriers() {
  const res = await getCarrierList()
  carrierList.value = res.data
}

async function loadStats() {
  const res = await getDispatchStats()
  const s = res.data
  statCards.value[0].value = s.totalVehicles
  statCards.value[1].value = s.availableVehicles
  statCards.value[2].value = s.inTransitVehicles
  statCards.value[3].value = s.avgUtilizationRate + '%'
}

function resetVehicleQuery() {
  Object.assign(vehicleQuery, { page: 1, keyword: '', status: '', tempZone: '', ownership: '', region: '' })
  loadVehicles()
}

function showVehicleDetail(row) {
  currentVehicle.value = row
  detailVisible.value = true
}

function driverStatusLabel(s) {
  const m = { AVAILABLE: '可用', ON_DUTY: '执勤中', RESTING: '休息中', OFFLINE: '离线' }
  return m[s] || s
}
function driverStatusType(s) {
  const m = { AVAILABLE: 'success', ON_DUTY: 'primary', RESTING: 'info', OFFLINE: 'info' }
  return m[s] || 'info'
}

onMounted(() => {
  loadStats()
  loadVehicles()
  loadDrivers()
  loadCarriers()
})
</script>

<style scoped>
.stat-row { margin-bottom: 16px; }
.stat-card-inner { display: flex; align-items: center; gap: 16px; }
.stat-icon { width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #fff; }
.stat-value { font-size: 28px; font-weight: 700; color: #303133; line-height: 1.2; }
.stat-label { font-size: 13px; color: #909399; margin-top: 4px; }
.content-tabs { background: #fff; border-radius: 8px; padding: 0 16px 16px; }
.filter-card { margin-bottom: 12px; border: none; }
.filter-card :deep(.el-card__body) { padding: 16px 16px 0; }
.table-card { border: none; }
.mr4 { margin-right: 4px; }
.pagination-wrap { display: flex; justify-content: flex-end; margin-top: 16px; }
</style>
