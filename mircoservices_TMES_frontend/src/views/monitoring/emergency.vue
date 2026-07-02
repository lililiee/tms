<template>
  <div class="page-container">
    <!-- 顶部统计 -->
    <el-row :gutter="16" class="stat-row">
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{ padding: '16px' }">
          <div class="mini-stat">
            <div class="mini-stat-icon" style="background: linear-gradient(135deg, #F56C6C, #f78989);"><el-icon :size="20"><WarningFilled /></el-icon></div>
            <div>
              <div class="mini-stat-value danger">{{ stats.inProgressEmergencies }}</div>
              <div class="mini-stat-label">处置中事件</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{ padding: '16px' }">
          <div class="mini-stat">
            <div class="mini-stat-icon" style="background: linear-gradient(135deg, #67C23A, #85ce61);"><el-icon :size="20"><CircleCheckFilled /></el-icon></div>
            <div>
              <div class="mini-stat-value success">{{ stats.resolvedEmergencies }}</div>
              <div class="mini-stat-label">已解决事件</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{ padding: '16px' }">
          <div class="mini-stat">
            <div class="mini-stat-icon" style="background: linear-gradient(135deg, #E6A23C, #ebb563);"><el-icon :size="20"><Odometer /></el-icon></div>
            <div>
              <div class="mini-stat-value">{{ stats.onTimeRate }}%</div>
              <div class="mini-stat-label">配送准时率</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{ padding: '16px' }">
          <div class="mini-stat">
            <div class="mini-stat-icon" style="background: linear-gradient(135deg, #409EFF, #66b1ff);"><el-icon :size="20"><Goods /></el-icon></div>
            <div>
              <div class="mini-stat-value">{{ stats.damageRate }}%</div>
              <div class="mini-stat-label">货损率</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 筛选栏 -->
    <el-card shadow="never" class="filter-card">
      <el-form :inline="true" :model="query" size="default">
        <el-form-item label="异常类型">
          <el-select v-model="query.type" placeholder="全部" clearable style="width: 140px">
            <el-option v-for="(v, k) in EMERGENCY_TYPE_MAP" :key="k" :label="v.label" :value="k" />
          </el-select>
        </el-form-item>
        <el-form-item label="级别">
          <el-select v-model="query.level" placeholder="全部" clearable style="width: 100px">
            <el-option label="红色" value="RED" />
            <el-option label="橙色" value="ORANGE" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="query.status" placeholder="全部" clearable style="width: 120px">
            <el-option v-for="(v, k) in EMERGENCY_STATUS_MAP" :key="k" :label="v.label" :value="k" />
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

    <!-- 异常列表 -->
    <el-card shadow="never" class="table-card">
      <el-table :data="list" v-loading="loading" border stripe size="default">
        <el-table-column prop="recordNo" label="处置编号" width="110" fixed="left" />
        <el-table-column label="异常类型" width="110">
          <template #default="{ row }">
            <el-tag :type="EMERGENCY_TYPE_MAP[row.type]?.type" size="small">{{ EMERGENCY_TYPE_MAP[row.type]?.label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="级别" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.level === 'RED' ? 'danger' : 'warning'" size="small" effect="dark">{{ row.level === 'RED' ? '红色' : '橙色' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="vehicleNo" label="车辆" width="100" />
        <el-table-column prop="driverName" label="司机" width="80" />
        <el-table-column prop="routePlanNo" label="路径方案" width="100" />
        <el-table-column prop="alertNo" label="关联预警" width="100" />
        <el-table-column prop="description" label="异常描述" min-width="240" show-overflow-tooltip />
        <el-table-column prop="triggerTime" label="触发时间" width="140" />
        <el-table-column label="货品状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="cargoStatusType(row.cargoStatus)" size="small" effect="plain">{{ cargoStatusLabel(row.cargoStatus) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="费用影响" width="100">
          <template #default="{ row }">¥{{ row.costImpact.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="EMERGENCY_STATUS_MAP[row.status]?.type" size="small">{{ EMERGENCY_STATUS_MAP[row.status]?.label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="resolveTime" label="解决时间" width="140" />
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="showDetail(row)">详情</el-button>
            <el-button v-if="row.status === 'IN_PROGRESS'" link type="success" size="small" @click="handleAction(row)">处置</el-button>
            <el-button v-if="row.status === 'IN_PROGRESS'" link type="danger" size="small" @click="handleClose(row)">关闭</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrap">
        <el-pagination v-model:current-page="query.page" v-model:page-size="query.pageSize" :total="total" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next" @size-change="loadData" @current-change="loadData" />
      </div>
    </el-card>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="异常处置详情" width="850px" top="5vh">
      <template v-if="currentRecord">
        <el-descriptions :column="3" border size="small">
          <el-descriptions-item label="处置编号">{{ currentRecord.recordNo }}</el-descriptions-item>
          <el-descriptions-item label="异常类型">
            <el-tag :type="EMERGENCY_TYPE_MAP[currentRecord.type]?.type" size="small">{{ EMERGENCY_TYPE_MAP[currentRecord.type]?.label }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="级别">
            <el-tag :type="currentRecord.level === 'RED' ? 'danger' : 'warning'" size="small" effect="dark">{{ currentRecord.level === 'RED' ? '红色预警' : '橙色预警' }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="车辆">{{ currentRecord.vehicleNo }}</el-descriptions-item>
          <el-descriptions-item label="司机">{{ currentRecord.driverName }}</el-descriptions-item>
          <el-descriptions-item label="路径方案">{{ currentRecord.routePlanNo }}</el-descriptions-item>
          <el-descriptions-item label="关联预警">{{ currentRecord.alertNo }}</el-descriptions-item>
          <el-descriptions-item label="触发时间">{{ currentRecord.triggerTime }}</el-descriptions-item>
          <el-descriptions-item label="解决时间">{{ currentRecord.resolveTime || '-' }}</el-descriptions-item>
          <el-descriptions-item label="异常描述" :span="3">{{ currentRecord.description }}</el-descriptions-item>
          <el-descriptions-item label="处置方案" :span="3">
            <el-alert :title="currentRecord.plan" type="info" :closable="false" show-icon />
          </el-descriptions-item>
          <el-descriptions-item label="货品状态">
            <el-tag :type="cargoStatusType(currentRecord.cargoStatus)" size="small">{{ cargoStatusLabel(currentRecord.cargoStatus) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="费用影响">¥{{ currentRecord.costImpact.toLocaleString() }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="EMERGENCY_STATUS_MAP[currentRecord.status]?.type" size="small">{{ EMERGENCY_STATUS_MAP[currentRecord.status]?.label }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="客户已通知">{{ currentRecord.customerNotified ? '是' : '否' }}</el-descriptions-item>
          <el-descriptions-item label="质控部门参与">{{ currentRecord.qualityDeptInvolved ? '是' : '否' }}</el-descriptions-item>
        </el-descriptions>

        <el-divider content-position="left">处置过程时间线</el-divider>
        <el-timeline>
          <el-timeline-item
            v-for="(action, idx) in currentRecord.actions"
            :key="idx"
            :type="idx === 0 ? 'danger' : idx === currentRecord.actions.length - 1 ? 'success' : 'primary'"
            :timestamp="action.time"
            placement="top"
          >
            <div class="action-item">
              <div class="action-desc">{{ action.action }}</div>
              <div class="action-meta">
                <el-tag size="small" effect="plain">{{ action.operator }}</el-tag>
                <span class="action-result">{{ action.result }}</span>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </template>
    </el-dialog>

    <!-- 处置操作弹窗 -->
    <el-dialog v-model="actionVisible" title="执行处置操作" width="600px">
      <template v-if="currentRecord">
        <el-alert :title="currentRecord.description" type="error" :closable="false" show-icon style="margin-bottom: 16px;" />
        <el-alert :title="'AI建议方案: ' + currentRecord.plan" type="info" :closable="false" show-icon style="margin-bottom: 16px;" />
        <el-form :model="actionForm">
          <el-form-item label="处置动作">
            <el-input v-model="actionForm.action" placeholder="如：已通知备用车V050前往接驳点" />
          </el-form-item>
          <el-form-item label="执行结果">
            <el-input v-model="actionForm.result" type="textarea" :rows="2" placeholder="如：V050已出发，预计15分钟到达" />
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <el-button @click="actionVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAction">提交处置</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getEmergencyList, getEmergencyDetail, executeEmergencyPlan, closeEmergency, getMonitoringStats } from '@/api/monitoring'
import { EMERGENCY_TYPE_MAP, EMERGENCY_STATUS_MAP } from '@/utils/format'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const query = reactive({ page: 1, pageSize: 20, type: '', level: '', status: '', vehicleNo: '' })
const stats = ref({ inProgressEmergencies: 0, resolvedEmergencies: 0, onTimeRate: 0, damageRate: 0 })

const detailVisible = ref(false)
const actionVisible = ref(false)
const currentRecord = ref(null)
const actionForm = reactive({ action: '', result: '' })

async function loadData() {
  loading.value = true
  try {
    const res = await getEmergencyList(query)
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

function resetQuery() {
  Object.assign(query, { page: 1, type: '', level: '', status: '', vehicleNo: '' })
  loadData()
}

function showDetail(row) {
  currentRecord.value = row
  detailVisible.value = true
}

function handleAction(row) {
  currentRecord.value = row
  actionForm.action = ''
  actionForm.result = ''
  actionVisible.value = true
}

async function confirmAction() {
  if (!actionForm.action || !actionForm.result) {
    ElMessage.warning('请填写处置动作和执行结果')
    return
  }
  await executeEmergencyPlan(currentRecord.value.id, actionForm)
  ElMessage.success('处置操作已记录')
  actionVisible.value = false
  loadData()
}

async function handleClose(row) {
  await ElMessageBox.confirm('确定要关闭此异常处置记录吗？关闭后不可再修改。', '关闭确认', { type: 'warning' })
  await closeEmergency(row.id, '异常已处置完毕')
  ElMessage.success('异常处置记录已关闭')
  loadData()
  loadStats()
}

function cargoStatusLabel(s) {
  return { NORMAL: '正常', AT_RISK: '有风险', SALVAGED: '已抢救', DESTROYED: '已销毁' }[s] || s
}
function cargoStatusType(s) {
  return { NORMAL: 'success', AT_RISK: 'warning', SALVAGED: '', DESTROYED: 'danger' }[s] || 'info'
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
.mini-stat-value.danger { color: #F56C6C; }
.mini-stat-value.success { color: #67C23A; }
.mini-stat-label { font-size: 12px; color: #909399; }
.filter-card { margin-bottom: 12px; }
.filter-card :deep(.el-card__body) { padding: 16px 16px 0; }
.table-card { border: none; }
.action-item { }
.action-desc { font-weight: 600; margin-bottom: 4px; color: #303133; }
.action-meta { display: flex; align-items: center; gap: 8px; }
.action-result { font-size: 13px; color: #606266; }
.pagination-wrap { display: flex; justify-content: flex-end; margin-top: 16px; }
</style>
