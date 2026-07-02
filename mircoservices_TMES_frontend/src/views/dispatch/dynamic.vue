<template>
  <div class="page-container">
    <!-- 概览卡片 -->
    <el-row :gutter="16" class="stat-row">
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{ padding: '16px' }">
          <div class="mini-stat">
            <div class="mini-stat-icon" style="background: linear-gradient(135deg, #F56C6C, #f78989);"><el-icon :size="20"><WarningFilled /></el-icon></div>
            <div>
              <div class="mini-stat-value">{{ stats.pendingEvents }}</div>
              <div class="mini-stat-label">待处理事件</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{ padding: '16px' }">
          <div class="mini-stat">
            <div class="mini-stat-icon" style="background: linear-gradient(135deg, #E6A23C, #ebb563);"><el-icon :size="20"><Loading /></el-icon></div>
            <div>
              <div class="mini-stat-value">{{ stats.totalEvents - stats.pendingEvents - stats.resolvedEvents }}</div>
              <div class="mini-stat-label">处理中事件</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{ padding: '16px' }">
          <div class="mini-stat">
            <div class="mini-stat-icon" style="background: linear-gradient(135deg, #67C23A, #85ce61);"><el-icon :size="20"><CircleCheckFilled /></el-icon></div>
            <div>
              <div class="mini-stat-value">{{ stats.resolvedEvents }}</div>
              <div class="mini-stat-label">已解决事件</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{ padding: '16px' }">
          <div class="mini-stat">
            <div class="mini-stat-icon" style="background: linear-gradient(135deg, #409EFF, #66b1ff);"><el-icon :size="20"><Lightning /></el-icon></div>
            <div>
              <div class="mini-stat-value">{{ autoResolvedCount }}</div>
              <div class="mini-stat-label">AI自动处置</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 事件列表 -->
    <el-card shadow="never" class="filter-card">
      <el-form :inline="true" :model="query" size="default">
        <el-form-item label="事件类型">
          <el-select v-model="query.type" placeholder="全部" clearable style="width: 130px">
            <el-option v-for="(v, k) in DYNAMIC_EVENT_TYPE_MAP" :key="k" :label="v.label" :value="k" />
          </el-select>
        </el-form-item>
        <el-form-item label="严重程度">
          <el-select v-model="query.severity" placeholder="全部" clearable style="width: 100px">
            <el-option v-for="(v, k) in SEVERITY_MAP" :key="k" :label="v.label" :value="k" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="query.status" placeholder="全部" clearable style="width: 120px">
            <el-option label="待处理" value="PENDING" />
            <el-option label="处理中" value="PROCESSING" />
            <el-option label="已解决" value="RESOLVED" />
            <el-option label="AI自动处置" value="AUTO_RESOLVED" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData"><el-icon><Search /></el-icon> 查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="table-card">
      <el-table :data="list" v-loading="loading" border stripe size="default">
        <el-table-column prop="eventNo" label="事件编号" width="110" fixed="left" />
        <el-table-column label="类型" width="120">
          <template #default="{ row }">
            <div class="event-type">
              <el-icon :size="16" :color="getEventColor(row.type)"><component :is="DYNAMIC_EVENT_TYPE_MAP[row.type]?.icon" /></el-icon>
              <span>{{ DYNAMIC_EVENT_TYPE_MAP[row.type]?.label }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="严重程度" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="SEVERITY_MAP[row.severity]?.type" size="small" effect="dark">{{ SEVERITY_MAP[row.severity]?.label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="vehicleNo" label="车辆" width="100" />
        <el-table-column prop="description" label="事件描述" min-width="260" show-overflow-tooltip />
        <el-table-column prop="triggerTime" label="触发时间" width="160" />
        <el-table-column label="AI处置建议" min-width="280" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="suggestion-text">
              <el-icon color="#409EFF"><MagicStick /></el-icon>
              {{ row.suggestion }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="自动处置" width="80" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.autoResolved" type="success" size="small" effect="plain">AI</el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="eventStatusType(row.status)" size="small">{{ eventStatusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="resolveTime" label="解决时间" width="160" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === 'PENDING' || row.status === 'PROCESSING'" link type="primary" size="small" @click="handleResolve(row)">处置</el-button>
            <el-button link type="info" size="small" @click="showDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrap">
        <el-pagination v-model:current-page="query.page" v-model:page-size="query.pageSize" :total="total" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next" @size-change="loadData" @current-change="loadData" />
      </div>
    </el-card>

    <!-- 处置弹窗 -->
    <el-dialog v-model="resolveVisible" title="动态事件处置" width="600px">
      <template v-if="currentEvent">
        <el-descriptions :column="1" border size="small" style="margin-bottom: 16px;">
          <el-descriptions-item label="事件编号">{{ currentEvent.eventNo }}</el-descriptions-item>
          <el-descriptions-item label="事件类型">{{ DYNAMIC_EVENT_TYPE_MAP[currentEvent.type]?.label }}</el-descriptions-item>
          <el-descriptions-item label="车辆">{{ currentEvent.vehicleNo }}</el-descriptions-item>
          <el-descriptions-item label="描述">{{ currentEvent.description }}</el-descriptions-item>
          <el-descriptions-item label="AI处置建议">
            <el-alert :title="currentEvent.suggestion" type="info" :closable="false" show-icon />
          </el-descriptions-item>
        </el-descriptions>
        <el-form>
          <el-form-item label="处置方案">
            <el-input v-model="resolveForm.resolution" type="textarea" :rows="3" placeholder="请输入处置方案及结果" />
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <el-button @click="resolveVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmResolve">确认处置</el-button>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="事件详情" width="600px">
      <template v-if="currentEvent">
        <el-descriptions :column="1" border size="small">
          <el-descriptions-item label="事件编号">{{ currentEvent.eventNo }}</el-descriptions-item>
          <el-descriptions-item label="事件类型">{{ DYNAMIC_EVENT_TYPE_MAP[currentEvent.type]?.label }}</el-descriptions-item>
          <el-descriptions-item label="严重程度">
            <el-tag :type="SEVERITY_MAP[currentEvent.severity]?.type" size="small" effect="dark">{{ SEVERITY_MAP[currentEvent.severity]?.label }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="车辆">{{ currentEvent.vehicleNo }}</el-descriptions-item>
          <el-descriptions-item label="描述">{{ currentEvent.description }}</el-descriptions-item>
          <el-descriptions-item label="触发时间">{{ currentEvent.triggerTime }}</el-descriptions-item>
          <el-descriptions-item label="AI处置建议">{{ currentEvent.suggestion }}</el-descriptions-item>
          <el-descriptions-item label="自动处置">{{ currentEvent.autoResolved ? '是' : '否' }}</el-descriptions-item>
          <el-descriptions-item label="状态">{{ eventStatusLabel(currentEvent.status) }}</el-descriptions-item>
          <el-descriptions-item label="解决时间">{{ currentEvent.resolveTime || '-' }}</el-descriptions-item>
        </el-descriptions>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getDynamicEvents, resolveDynamicEvent, getDispatchStats } from '@/api/dispatch'
import { DYNAMIC_EVENT_TYPE_MAP, SEVERITY_MAP } from '@/utils/format'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const query = reactive({ page: 1, pageSize: 20, type: '', severity: '', status: '' })
const stats = ref({ totalEvents: 0, pendingEvents: 0, resolvedEvents: 0 })
const autoResolvedCount = ref(0)

const resolveVisible = ref(false)
const detailVisible = ref(false)
const currentEvent = ref(null)
const resolveForm = reactive({ resolution: '' })

async function loadData() {
  loading.value = true
  try {
    const res = await getDynamicEvents(query)
    list.value = res.data.records
    total.value = res.data.total
    autoResolvedCount.value = res.data.records.filter(r => r.autoResolved).length
  } finally {
    loading.value = false
  }
}

async function loadStats() {
  const res = await getDispatchStats()
  stats.value = {
    totalEvents: res.data.dynamicEvents,
    pendingEvents: res.data.pendingEvents,
    resolvedEvents: res.data.resolvedEvents,
  }
}

function resetQuery() {
  Object.assign(query, { page: 1, type: '', severity: '', status: '' })
  loadData()
}

function handleResolve(row) {
  currentEvent.value = row
  resolveForm.resolution = row.suggestion
  resolveVisible.value = true
}

async function confirmResolve() {
  if (!resolveForm.resolution) {
    ElMessage.warning('请输入处置方案')
    return
  }
  await resolveDynamicEvent(currentEvent.value.id, resolveForm.resolution)
  ElMessage.success('事件已处置')
  resolveVisible.value = false
  loadData()
}

function showDetail(row) {
  currentEvent.value = row
  detailVisible.value = true
}

function eventStatusLabel(s) {
  return { PENDING: '待处理', PROCESSING: '处理中', RESOLVED: '已解决', AUTO_RESOLVED: 'AI自动' }[s] || s
}
function eventStatusType(s) {
  return { PENDING: 'danger', PROCESSING: 'warning', RESOLVED: 'success', AUTO_RESOLVED: 'info' }[s] || 'info'
}
function getEventColor(type) {
  return { TRAFFIC_JAM: '#E6A23C', ROAD_CLOSED: '#F56C6C', VEHICLE_FAULT: '#F56C6C', NEW_ORDER: '#67C23A', TIME_WINDOW_CHANGE: '#409EFF', TEMP_ALERT: '#F56C6C', ROUTE_DEVIATION: '#E6A23C' }[type] || '#909399'
}

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
.filter-card { margin-bottom: 12px; }
.filter-card :deep(.el-card__body) { padding: 16px 16px 0; }
.table-card { border: none; }
.event-type { display: flex; align-items: center; gap: 6px; }
.suggestion-text { display: flex; align-items: flex-start; gap: 6px; color: #409EFF; font-size: 13px; }
.pagination-wrap { display: flex; justify-content: flex-end; margin-top: 16px; }
</style>
