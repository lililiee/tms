<template>
  <div class="page-container">
    <el-card shadow="never" class="filter-card">
      <div class="flex-between">
        <el-form :inline="true" :model="query" size="default">
          <el-form-item label="方案编号">
            <el-input v-model="query.keyword" placeholder="方案号/车牌/司机" clearable style="width: 180px" @keyup.enter="loadData" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="query.status" placeholder="全部" clearable style="width: 120px">
              <el-option v-for="(v, k) in ROUTE_PLAN_STATUS_MAP" :key="k" :label="v.label" :value="k" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="loadData"><el-icon><Search /></el-icon> 查询</el-button>
            <el-button @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="showGenerateDialog = true">
          <el-icon><MagicStick /></el-icon> AI生成路径方案
        </el-button>
      </div>
    </el-card>

    <el-card shadow="never" class="table-card">
      <el-table :data="list" v-loading="loading" border stripe size="default">
        <el-table-column prop="routeNo" label="路径编号" width="120" fixed="left" />
        <el-table-column prop="vehicleNo" label="车牌号" width="110" />
        <el-table-column prop="driverName" label="司机" width="80" />
        <el-table-column prop="stopCount" label="配送点数" width="80" align="center" />
        <el-table-column label="总距离" width="90" align="center">
          <template #default="{ row }">{{ row.totalDistance }} km</template>
        </el-table-column>
        <el-table-column label="总时长" width="90" align="center">
          <template #default="{ row }">{{ Math.floor(row.totalTime / 60) }}h{{ row.totalTime % 60 }}m</template>
        </el-table-column>
        <el-table-column label="路况" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="TRAFFIC_CONDITION_MAP[row.trafficCondition]?.type" size="small">{{ TRAFFIC_CONDITION_MAP[row.trafficCondition]?.label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="天气" width="60" align="center">
          <template #default="{ row }">{{ WEATHER_MAP[row.weatherCondition] }}</template>
        </el-table-column>
        <el-table-column label="AI评分" width="80" align="center">
          <template #default="{ row }"><span class="ai-score">{{ row.aiScore }}</span></template>
        </el-table-column>
        <el-table-column label="预估费用" width="120">
          <template #default="{ row }">
            ¥{{ row.totalCost.toLocaleString() }}
            <span class="cost-detail">(油{{ row.fuelCost }}+过路{{ row.tollCost }})</span>
          </template>
        </el-table-column>
        <el-table-column label="备选方案" width="80" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.hasAlternative" type="info" size="small" effect="plain">有</el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="ROUTE_PLAN_STATUS_MAP[row.status]?.type" size="small">{{ ROUTE_PLAN_STATUS_MAP[row.status]?.label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="155" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="showDetail(row)">路线详情</el-button>
            <el-button v-if="row.status === 'DRAFT' || row.status === 'RECOMMENDED'" link type="success" size="small" @click="confirmPlan(row)">确认</el-button>
            <el-button link type="primary" size="small">下发司机APP</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrap">
        <el-pagination v-model:current-page="query.page" v-model:page-size="query.pageSize" :total="total" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next" @size-change="loadData" @current-change="loadData" />
      </div>
    </el-card>

    <!-- AI生成弹窗 -->
    <el-dialog v-model="showGenerateDialog" title="AI路径规划方案生成" width="600px">
      <el-alert title="系统将采用强化学习+遗传算法，在数秒内从海量可行解空间中搜索满足温控要求、时间窗约束、路况限行等条件的最优配送路线" type="info" :closable="false" show-icon style="margin-bottom: 20px;" />
      <el-form :model="genForm" label-width="110px">
        <el-form-item label="选择配载方案">
          <el-select v-model="genForm.loadingPlanId" filterable placeholder="选择已确认的配载方案" style="width: 100%">
            <el-option v-for="i in 8" :key="i" :label="`LOAD${String(i).padStart(4, '0')}`" :value="i" />
          </el-select>
        </el-form-item>
        <el-form-item label="优化目标">
          <el-radio-group v-model="genForm.objective">
            <el-radio value="DISTANCE">距离最短</el-radio>
            <el-radio value="TIME">时效最优</el-radio>
            <el-radio value="COMPREHENSIVE">综合成本最低</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="考虑实时路况">
          <el-switch v-model="genForm.useRealTimeTraffic" />
        </el-form-item>
        <el-form-item label="温控优先排序">
          <el-switch v-model="genForm.tempPriority" />
          <span class="form-hint">冷冻品配送节点优先安排在路线前半段</span>
        </el-form-item>
        <el-form-item label="生成备选方案">
          <el-switch v-model="genForm.generateAlternatives" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showGenerateDialog = false">取消</el-button>
        <el-button type="primary" :loading="generating" @click="generate">
          <el-icon><MagicStick /></el-icon> 开始AI计算
        </el-button>
      </template>
    </el-dialog>

    <!-- 路线详情弹窗 -->
    <el-dialog v-model="detailVisible" title="路径规划详情" width="900px" top="5vh">
      <template v-if="currentPlan">
        <el-descriptions :column="3" border size="small" style="margin-bottom: 16px;">
          <el-descriptions-item label="路径编号">{{ currentPlan.routeNo }}</el-descriptions-item>
          <el-descriptions-item label="车牌号">{{ currentPlan.vehicleNo }}</el-descriptions-item>
          <el-descriptions-item label="司机">{{ currentPlan.driverName }}</el-descriptions-item>
          <el-descriptions-item label="总距离">{{ currentPlan.totalDistance }} km</el-descriptions-item>
          <el-descriptions-item label="总时长">{{ Math.floor(currentPlan.totalTime / 60) }}h{{ currentPlan.totalTime % 60 }}m</el-descriptions-item>
          <el-descriptions-item label="AI评分"><span class="ai-score">{{ currentPlan.aiScore }}</span></el-descriptions-item>
        </el-descriptions>

        <!-- 配送节点路线图 -->
        <el-divider content-position="left">配送路线（{{ currentPlan.stops.length }}个节点）</el-divider>
        <div class="route-timeline">
          <div class="route-item" v-for="(stop, idx) in currentPlan.stops" :key="idx">
            <div class="route-marker" :class="{ completed: stop.status === 'COMPLETED', current: idx === currentPlan.stops.findIndex(s => s.status !== 'COMPLETED') }">
              <span class="route-seq">{{ stop.seq }}</span>
            </div>
            <div class="route-content">
              <div class="route-header">
                <span class="route-name">{{ stop.customerName }}</span>
                <el-tag :type="getTempZoneTag(stop.tempZone).type" size="small">{{ getTempZoneTag(stop.tempZone).label }}</el-tag>
                <el-tag v-if="stop.priority === 'HIGH'" type="danger" size="small">高优先</el-tag>
              </div>
              <div class="route-meta">
                <span>{{ stop.address }}</span>
              </div>
              <div class="route-time">
                <el-icon><Clock /></el-icon> 到达: {{ stop.arrivalTime }} | 时间窗: {{ stop.timeWindow }} | 距离: {{ stop.distance }}km | 车程: {{ stop.driveTime }}分钟
              </div>
            </div>
            <div v-if="idx < currentPlan.stops.length - 1" class="route-line"></div>
          </div>
        </div>

        <el-row :gutter="16" style="margin-top: 16px;">
          <el-col :span="8">
            <el-statistic title="预估油费" :value="currentPlan.fuelCost" prefix="¥" />
          </el-col>
          <el-col :span="8">
            <el-statistic title="预估过路费" :value="currentPlan.tollCost" prefix="¥" />
          </el-col>
          <el-col :span="8">
            <el-statistic title="总预估费用" :value="currentPlan.totalCost" prefix="¥" />
          </el-col>
        </el-row>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getRoutePlanList, generateRoutePlan, confirmRoutePlan } from '@/api/dispatch'
import { ROUTE_PLAN_STATUS_MAP, TRAFFIC_CONDITION_MAP, WEATHER_MAP, getTempZoneTag, PRIORITY_MAP } from '@/utils/format'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const query = reactive({ page: 1, pageSize: 20, keyword: '', status: '' })

const showGenerateDialog = ref(false)
const generating = ref(false)
const genForm = reactive({ loadingPlanId: '', objective: 'COMPREHENSIVE', useRealTimeTraffic: true, tempPriority: true, generateAlternatives: true })

const detailVisible = ref(false)
const currentPlan = ref(null)

async function loadData() {
  loading.value = true
  try {
    const res = await getRoutePlanList(query)
    list.value = res.data.records
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

function resetQuery() {
  Object.assign(query, { page: 1, keyword: '', status: '' })
  loadData()
}

async function generate() {
  generating.value = true
  try {
    const res = await generateRoutePlan(genForm.loadingPlanId)
    ElMessage.success('AI路径规划方案生成成功！')
    showGenerateDialog.value = false
    loadData()
    showDetail(res.data)
  } finally {
    generating.value = false
  }
}

function showDetail(row) {
  currentPlan.value = row
  detailVisible.value = true
}

async function confirmPlan(row) {
  await confirmRoutePlan(row.id)
  ElMessage.success('路径规划方案已确认')
  row.status = 'CONFIRMED'
}

onMounted(() => loadData())
</script>

<style scoped>
.filter-card { margin-bottom: 12px; }
.filter-card :deep(.el-card__body) { padding: 16px; }
.table-card { border: none; }
.ai-score { font-size: 16px; font-weight: 700; color: #409EFF; }
.cost-detail { font-size: 11px; color: #909399; display: block; }
.form-hint { margin-left: 12px; font-size: 12px; color: #909399; }
.pagination-wrap { display: flex; justify-content: flex-end; margin-top: 16px; }

.route-timeline { padding: 8px 0; }
.route-item { display: flex; align-items: flex-start; position: relative; padding-bottom: 24px; }
.route-item:last-child { padding-bottom: 0; }
.route-marker {
  width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  background: #f0f2f5; color: #909399; font-size: 14px; font-weight: 600; flex-shrink: 0; z-index: 1;
}
.route-marker.completed { background: #67C23A; color: #fff; }
.route-marker.current { background: #409EFF; color: #fff; box-shadow: 0 0 0 4px rgba(64,158,255,0.2); }
.route-content { margin-left: 16px; flex: 1; }
.route-header { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.route-name { font-weight: 600; font-size: 14px; color: #303133; }
.route-meta { font-size: 13px; color: #606266; margin-bottom: 4px; }
.route-time { font-size: 12px; color: #909399; display: flex; align-items: center; gap: 4px; }
.route-line {
  position: absolute; left: 16px; top: 32px; bottom: 0; width: 2px; background: #dcdfe6;
}
</style>
