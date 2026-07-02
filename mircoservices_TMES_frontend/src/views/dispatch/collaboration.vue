<template>
  <div class="page-container">
    <el-card shadow="never" class="filter-card">
      <el-form :inline="true" :model="query" size="default">
        <el-form-item label="任务编号">
          <el-input v-model="query.keyword" placeholder="任务号/车牌/司机" clearable style="width: 180px" @keyup.enter="loadData" />
        </el-form-item>
        <el-form-item label="任务类型">
          <el-select v-model="query.type" placeholder="全部" clearable style="width: 150px">
            <el-option label="装车指令" value="LOADING_INSTRUCTION" />
            <el-option label="路线通知" value="ROUTE_NOTIFICATION" />
            <el-option label="车辆分配" value="VEHICLE_ASSIGNMENT" />
            <el-option label="WMS同步" value="WMS_SYNC" />
            <el-option label="司机通知" value="DRIVER_NOTIFY" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="query.status" placeholder="全部" clearable style="width: 120px">
            <el-option v-for="(v, k) in DISPATCH_TASK_STATUS_MAP" :key="k" :label="v.label" :value="k" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="query.priority" placeholder="全部" clearable style="width: 100px">
            <el-option v-for="(v, k) in PRIORITY_MAP" :key="k" :label="v.label" :value="k" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData"><el-icon><Search /></el-icon> 查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="table-card">
      <el-table :data="list" v-loading="loading" border stripe size="default" @expand-change="handleExpand">
        <el-table-column type="expand">
          <template #default="{ row }">
            <div class="sync-detail">
              <h4>系统同步记录</h4>
              <el-timeline>
                <el-timeline-item
                  v-for="(sync, idx) in row.syncRecords"
                  :key="idx"
                  :type="syncStatusType(sync.status)"
                  :timestamp="sync.syncTime"
                  placement="top"
                >
                  <div class="sync-item">
                    <el-tag :type="syncStatusType(sync.status)" size="small">{{ syncStatusLabel(sync.status) }}</el-tag>
                    <span class="sync-system">{{ systemLabel(sync.system) }}</span>
                    <span class="sync-message">{{ sync.message }}</span>
                    <el-button v-if="sync.status === 'PENDING' || sync.status === 'FAILED'" link type="primary" size="small" @click="resync(row, sync.system)">重新同步</el-button>
                  </div>
                </el-timeline-item>
              </el-timeline>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="taskNo" label="任务编号" width="110" fixed="left" />
        <el-table-column label="类型" width="120">
          <template #default="{ row }">{{ taskTypeLabel(row.type) }}</template>
        </el-table-column>
        <el-table-column prop="vehicleNo" label="车牌号" width="100" />
        <el-table-column prop="driverName" label="司机" width="80" />
        <el-table-column prop="driverPhone" label="司机电话" width="130" />
        <el-table-column prop="carrierName" label="承运商" width="120" show-overflow-tooltip />
        <el-table-column prop="loadingPlanNo" label="配载方案" width="100" />
        <el-table-column prop="routePlanNo" label="路径方案" width="100" />
        <el-table-column label="优先级" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="PRIORITY_MAP[row.priority]?.type" size="small">{{ PRIORITY_MAP[row.priority]?.label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pickupTime" label="取货时间" width="140" />
        <el-table-column prop="deliveryDeadline" label="送达截止" width="140" />
        <el-table-column label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="DISPATCH_TASK_STATUS_MAP[row.status]?.type" size="small">{{ DISPATCH_TASK_STATUS_MAP[row.status]?.label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="showDetail(row)">详情</el-button>
            <el-button v-if="row.status === 'PENDING'" link type="success" size="small" @click="syncAll(row)">全部同步</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrap">
        <el-pagination v-model:current-page="query.page" v-model:page-size="query.pageSize" :total="total" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next" @size-change="loadData" @current-change="loadData" />
      </div>
    </el-card>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="调度任务详情" width="700px">
      <template v-if="currentTask">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="任务编号">{{ currentTask.taskNo }}</el-descriptions-item>
          <el-descriptions-item label="任务类型">{{ taskTypeLabel(currentTask.type) }}</el-descriptions-item>
          <el-descriptions-item label="车牌号">{{ currentTask.vehicleNo }}</el-descriptions-item>
          <el-descriptions-item label="司机">{{ currentTask.driverName }} ({{ currentTask.driverPhone }})</el-descriptions-item>
          <el-descriptions-item label="承运商">{{ currentTask.carrierName }}</el-descriptions-item>
          <el-descriptions-item label="配载方案">{{ currentTask.loadingPlanNo }}</el-descriptions-item>
          <el-descriptions-item label="路径方案">{{ currentTask.routePlanNo }}</el-descriptions-item>
          <el-descriptions-item label="优先级">
            <el-tag :type="PRIORITY_MAP[currentTask.priority]?.type" size="small">{{ PRIORITY_MAP[currentTask.priority]?.label }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="取货时间">{{ currentTask.pickupTime }}</el-descriptions-item>
          <el-descriptions-item label="送达截止">{{ currentTask.deliveryDeadline }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="DISPATCH_TASK_STATUS_MAP[currentTask.status]?.type" size="small">{{ DISPATCH_TASK_STATUS_MAP[currentTask.status]?.label }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentTask.createTime }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">{{ currentTask.remark }}</el-descriptions-item>
        </el-descriptions>

        <el-divider content-position="left">协同系统同步状态</el-divider>
        <el-table :data="currentTask.syncRecords" border size="small">
          <el-table-column prop="system" label="目标系统" width="130">
            <template #default="{ row }">{{ systemLabel(row.system) }}</template>
          </el-table-column>
          <el-table-column label="同步状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="syncStatusType(row.status)" size="small">{{ syncStatusLabel(row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="syncTime" label="同步时间" width="180" />
          <el-table-column prop="message" label="同步信息" show-overflow-tooltip />
        </el-table>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getDispatchTaskList, syncDispatchTask } from '@/api/dispatch'
import { DISPATCH_TASK_STATUS_MAP, PRIORITY_MAP } from '@/utils/format'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const query = reactive({ page: 1, pageSize: 20, keyword: '', type: '', status: '', priority: '' })

const detailVisible = ref(false)
const currentTask = ref(null)

async function loadData() {
  loading.value = true
  try {
    const res = await getDispatchTaskList(query)
    list.value = res.data.records
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

function resetQuery() {
  Object.assign(query, { page: 1, keyword: '', type: '', status: '', priority: '' })
  loadData()
}

function showDetail(row) {
  currentTask.value = row
  detailVisible.value = true
}

function handleExpand() {}

async function resync(row, system) {
  await syncDispatchTask(row.id, system)
  ElMessage.success(`${systemLabel(system)} 同步成功`)
  loadData()
}

async function syncAll(row) {
  for (const sync of row.syncRecords) {
    if (sync.status === 'PENDING' || sync.status === 'FAILED') {
      await syncDispatchTask(row.id, sync.system)
    }
  }
  ElMessage.success('全部系统同步完成')
  row.status = 'SYNCED'
  loadData()
}

function taskTypeLabel(t) {
  return { LOADING_INSTRUCTION: '装车指令', ROUTE_NOTIFICATION: '路线通知', VEHICLE_ASSIGNMENT: '车辆分配', WMS_SYNC: 'WMS同步', DRIVER_NOTIFY: '司机通知' }[t] || t
}
function systemLabel(s) {
  return { WMS: 'WMS仓储系统', ERP: 'ERP系统', MES: 'MES生产系统', DRIVER_APP: '司机APP', CARRIER_SYSTEM: '承运商系统' }[s] || s
}
function syncStatusLabel(s) {
  return { PENDING: '待同步', SYNCED: '已同步', FAILED: '失败', ACKNOWLEDGED: '已确认' }[s] || s
}
function syncStatusType(s) {
  return { PENDING: 'info', SYNCED: 'success', FAILED: 'danger', ACKNOWLEDGED: '' }[s] || 'info'
}

onMounted(() => loadData())
</script>

<style scoped>
.filter-card { margin-bottom: 12px; }
.filter-card :deep(.el-card__body) { padding: 16px 16px 0; }
.table-card { border: none; }
.sync-detail { padding: 16px 24px; background: #fafafa; }
.sync-detail h4 { margin-bottom: 16px; color: #303133; }
.sync-item { display: flex; align-items: center; gap: 12px; }
.sync-system { font-weight: 600; color: #303133; min-width: 100px; }
.sync-message { color: #606266; }
.pagination-wrap { display: flex; justify-content: flex-end; margin-top: 16px; }
</style>
