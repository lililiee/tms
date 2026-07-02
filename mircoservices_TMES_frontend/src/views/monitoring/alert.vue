<template>
  <div class="page-container">
    <!-- 顶部统计 + 图表 -->
    <el-row :gutter="16" class="stat-row">
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{ padding: '16px' }">
          <div class="mini-stat">
            <div class="mini-stat-icon" style="background: linear-gradient(135deg, #F56C6C, #f78989);"><el-icon :size="20"><WarningFilled /></el-icon></div>
            <div>
              <div class="mini-stat-value danger">{{ stats.todayAlerts }}</div>
              <div class="mini-stat-label">今日预警总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{ padding: '16px' }">
          <div class="mini-stat">
            <div class="mini-stat-icon" style="background: linear-gradient(135deg, #E6A23C, #ebb563);"><el-icon :size="20"><Bell /></el-icon></div>
            <div>
              <div class="mini-stat-value warning">{{ stats.pendingAlerts }}</div>
              <div class="mini-stat-label">待处理预警</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{ padding: '16px' }">
          <div class="mini-stat">
            <div class="mini-stat-icon" style="background: linear-gradient(135deg, #67C23A, #85ce61);"><el-icon :size="20"><CircleCheckFilled /></el-icon></div>
            <div>
              <div class="mini-stat-value success">{{ stats.resolvedAlerts }}</div>
              <div class="mini-stat-label">已解决预警</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{ padding: '16px' }">
          <div class="mini-stat">
            <div class="mini-stat-icon" style="background: linear-gradient(135deg, #409EFF, #66b1ff);"><el-icon :size="20"><DataAnalysis /></el-icon></div>
            <div>
              <div class="mini-stat-value">{{ stats.tempComplianceRate }}%</div>
              <div class="mini-stat-label">温控合规率</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区 -->
    <el-row :gutter="16" class="chart-row">
      <el-col :span="12">
        <el-card shadow="never">
          <template #header><span class="card-title"><el-icon><PieChart /></el-icon> 预警级别分布</span></template>
          <div ref="levelChartRef" style="height: 240px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never">
          <template #header><span class="card-title"><el-icon><TrendCharts /></el-icon> 近7天预警趋势</span></template>
          <div ref="trendChartRef" style="height: 240px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 筛选栏 -->
    <el-card shadow="never" class="filter-card">
      <el-form :inline="true" :model="query" size="default">
        <el-form-item label="预警级别">
          <el-select v-model="query.level" placeholder="全部" clearable style="width: 130px">
            <el-option v-for="(v, k) in ALERT_LEVEL_MAP" :key="k" :label="v.label" :value="k" />
          </el-select>
        </el-form-item>
        <el-form-item label="预警类型">
          <el-select v-model="query.type" placeholder="全部" clearable style="width: 130px">
            <el-option v-for="(v, k) in ALERT_TYPE_MAP" :key="k" :label="v.label" :value="k" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="query.status" placeholder="全部" clearable style="width: 120px">
            <el-option v-for="(v, k) in ALERT_STATUS_MAP" :key="k" :label="v.label" :value="k" />
          </el-select>
        </el-form-item>
        <el-form-item label="车牌">
          <el-input v-model="query.vehicleNo" placeholder="车牌号" clearable style="width: 120px" @keyup.enter="loadData" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData"><el-icon><Search /></el-icon> 查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 预警列表 -->
    <el-card shadow="never" class="table-card">
      <el-table :data="list" v-loading="loading" border stripe size="default">
        <el-table-column prop="alertNo" label="预警编号" width="110" fixed="left" />
        <el-table-column label="级别" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="ALERT_LEVEL_MAP[row.level]?.type" size="small" effect="dark">{{ ALERT_LEVEL_MAP[row.level]?.label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="110">
          <template #default="{ row }">
            <div class="alert-type">
              <el-icon :size="14" :color="ALERT_LEVEL_MAP[row.level]?.color"><component :is="ALERT_TYPE_MAP[row.type]?.icon" /></el-icon>
              <span>{{ ALERT_TYPE_MAP[row.type]?.label }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="vehicleNo" label="车辆" width="100" />
        <el-table-column prop="driverName" label="司机" width="80" />
        <el-table-column prop="description" label="预警描述" min-width="280" show-overflow-tooltip />
        <el-table-column label="AI处置建议" min-width="280" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="suggestion-text">
              <el-icon color="#409EFF"><MagicStick /></el-icon>
              {{ row.suggestion }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="triggerTime" label="触发时间" width="160" />
        <el-table-column label="通知渠道" width="110">
          <template #default="{ row }">
            <el-tag v-for="ch in row.notifiedChannels" :key="ch" size="small" effect="plain" class="mr4">{{ channelLabel(ch) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="ALERT_STATUS_MAP[row.status]?.type" size="small">{{ ALERT_STATUS_MAP[row.status]?.label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="resolvedTime" label="解决时间" width="160" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="showDetail(row)">详情</el-button>
            <el-button v-if="row.status === 'PENDING'" link type="success" size="small" @click="handleResolve(row)">处置</el-button>
            <el-button v-if="row.status === 'PENDING' || row.status === 'PROCESSING'" link type="danger" size="small" @click="handleEscalate(row)">升级</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrap">
        <el-pagination v-model:current-page="query.page" v-model:page-size="query.pageSize" :total="total" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next" @size-change="loadData" @current-change="loadData" />
      </div>
    </el-card>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="预警详情" width="700px">
      <template v-if="currentAlert">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="预警编号">{{ currentAlert.alertNo }}</el-descriptions-item>
          <el-descriptions-item label="级别">
            <el-tag :type="ALERT_LEVEL_MAP[currentAlert.level]?.type" size="small" effect="dark">{{ ALERT_LEVEL_MAP[currentAlert.level]?.label }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="类型">{{ ALERT_TYPE_MAP[currentAlert.type]?.label }}</el-descriptions-item>
          <el-descriptions-item label="车辆">{{ currentAlert.vehicleNo }}</el-descriptions-item>
          <el-descriptions-item label="司机">{{ currentAlert.driverName }}</el-descriptions-item>
          <el-descriptions-item label="路径方案">{{ currentAlert.routePlanNo }}</el-descriptions-item>
          <el-descriptions-item label="触发时间" :span="2">{{ currentAlert.triggerTime }}</el-descriptions-item>
          <el-descriptions-item label="预警描述" :span="2">{{ currentAlert.description }}</el-descriptions-item>
          <el-descriptions-item label="AI处置建议" :span="2">
            <el-alert :title="currentAlert.suggestion" type="warning" :closable="false" show-icon />
          </el-descriptions-item>
          <el-descriptions-item label="通知渠道" :span="2">
            <el-tag v-for="ch in currentAlert.notifiedChannels" :key="ch" size="small" class="mr4">{{ channelLabel(ch) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="升级层级">{{ currentAlert.escalationLevel }} 级</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="ALERT_STATUS_MAP[currentAlert.status]?.type" size="small">{{ ALERT_STATUS_MAP[currentAlert.status]?.label }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item v-if="currentAlert.resolvedBy" label="处置人">{{ currentAlert.resolvedBy }}</el-descriptions-item>
          <el-descriptions-item v-if="currentAlert.resolvedTime" label="解决时间">{{ currentAlert.resolvedTime }}</el-descriptions-item>
          <el-descriptions-item v-if="currentAlert.resolveNote" label="处置结果" :span="2">{{ currentAlert.resolveNote }}</el-descriptions-item>
        </el-descriptions>
      </template>
    </el-dialog>

    <!-- 处置弹窗 -->
    <el-dialog v-model="resolveVisible" title="预警处置" width="600px">
      <template v-if="currentAlert">
        <el-alert :title="currentAlert.description" :type="currentAlert.level === 'RED' ? 'error' : 'warning'" :closable="false" show-icon style="margin-bottom: 16px;" />
        <el-alert :title="'AI建议: ' + currentAlert.suggestion" type="info" :closable="false" show-icon style="margin-bottom: 16px;" />
        <el-form>
          <el-form-item label="处置结果">
            <el-input v-model="resolveForm.note" type="textarea" :rows="3" placeholder="请输入处置措施及结果" />
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <el-button @click="resolveVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmResolve">确认处置</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAlertList, getAlertDetail, resolveAlert, escalateAlert, getMonitoringStats } from '@/api/monitoring'
import { ALERT_LEVEL_MAP, ALERT_TYPE_MAP, ALERT_STATUS_MAP } from '@/utils/format'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const query = reactive({ page: 1, pageSize: 20, level: '', type: '', status: '', vehicleNo: '' })
const stats = ref({ todayAlerts: 0, pendingAlerts: 0, resolvedAlerts: 0, tempComplianceRate: 0 })

const detailVisible = ref(false)
const resolveVisible = ref(false)
const currentAlert = ref(null)
const resolveForm = reactive({ note: '' })

const levelChartRef = ref(null)
const trendChartRef = ref(null)
let levelChart = null
let trendChart = null

async function loadData() {
  loading.value = true
  try {
    const res = await getAlertList(query)
    list.value = res.data.records
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

async function loadStats() {
  const res = await getMonitoringStats()
  stats.value = res.data
  nextTick(() => renderCharts(res.data))
}

function renderCharts(s) {
  // 预警级别分布
  if (levelChartRef.value) {
    if (levelChart) levelChart.dispose()
    levelChart = echarts.init(levelChartRef.value)
    levelChart.setOption({
      tooltip: { trigger: 'item' },
      legend: { bottom: 0 },
      series: [{
        type: 'pie', radius: ['40%', '70%'], center: ['50%', '45%'],
        data: [
          { value: s.alertLevelDist.RED, name: '红色预警', itemStyle: { color: '#F56C6C' } },
          { value: s.alertLevelDist.ORANGE, name: '橙色预警', itemStyle: { color: '#E6A23C' } },
          { value: s.alertLevelDist.YELLOW, name: '黄色预警', itemStyle: { color: '#909399' } },
        ],
        label: { formatter: '{b}: {c} ({d}%)' },
      }],
    })
  }

  // 近7天趋势
  if (trendChartRef.value) {
    if (trendChart) trendChart.dispose()
    trendChart = echarts.init(trendChartRef.value)
    trendChart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['新增预警', '已解决'], bottom: 0 },
      grid: { left: '3%', right: '4%', top: '5%', containLabel: true },
      xAxis: { type: 'category', data: s.alertTrend7d.map(d => d.date) },
      yAxis: { type: 'value' },
      series: [
        { name: '新增预警', type: 'bar', data: s.alertTrend7d.map(d => d.total), itemStyle: { color: '#F56C6C' } },
        { name: '已解决', type: 'bar', data: s.alertTrend7d.map(d => d.resolved), itemStyle: { color: '#67C23A' } },
      ],
    })
  }
}

function resetQuery() {
  Object.assign(query, { page: 1, level: '', type: '', status: '', vehicleNo: '' })
  loadData()
}

function showDetail(row) {
  currentAlert.value = row
  detailVisible.value = true
}

function handleResolve(row) {
  currentAlert.value = row
  resolveForm.note = row.suggestion
  resolveVisible.value = true
}

async function confirmResolve() {
  if (!resolveForm.note) {
    ElMessage.warning('请输入处置结果')
    return
  }
  await resolveAlert(currentAlert.value.id, resolveForm.note)
  ElMessage.success('预警已处置')
  resolveVisible.value = false
  loadData()
  loadStats()
}

async function handleEscalate(row) {
  await ElMessageBox.confirm(`确定要将此预警升级至更高级别负责人吗？`, '预警升级', { type: 'warning' })
  await escalateAlert(row.id)
  ElMessage.success('预警已升级')
  loadData()
}

function channelLabel(ch) {
  return { SMS: '短信', APP: 'APP', PHONE: '电话', FEISHU: '飞书' }[ch] || ch
}

onMounted(() => {
  loadStats()
  loadData()
})

onUnmounted(() => {
  if (levelChart) levelChart.dispose()
  if (trendChart) trendChart.dispose()
})
</script>

<style scoped>
.stat-row { margin-bottom: 16px; }
.chart-row { margin-bottom: 16px; }
.mini-stat { display: flex; align-items: center; gap: 12px; }
.mini-stat-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
.mini-stat-value { font-size: 24px; font-weight: 700; color: #303133; }
.mini-stat-value.danger { color: #F56C6C; }
.mini-stat-value.warning { color: #E6A23C; }
.mini-stat-value.success { color: #67C23A; }
.mini-stat-label { font-size: 12px; color: #909399; }
.card-title { font-weight: 600; display: flex; align-items: center; gap: 6px; }
.filter-card { margin-bottom: 12px; }
.filter-card :deep(.el-card__body) { padding: 16px 16px 0; }
.table-card { border: none; }
.alert-type { display: flex; align-items: center; gap: 6px; }
.suggestion-text { display: flex; align-items: flex-start; gap: 6px; color: #409EFF; font-size: 13px; }
.mr4 { margin-right: 4px; }
.pagination-wrap { display: flex; justify-content: flex-end; margin-top: 16px; }
</style>
