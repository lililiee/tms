<template>
  <div class="page-container">
    <!-- 操作栏 -->
    <el-card shadow="never" class="filter-card">
      <div class="flex-between">
        <el-form :inline="true" :model="query" size="default">
          <el-form-item label="方案编号">
            <el-input v-model="query.keyword" placeholder="方案号/车牌/司机" clearable style="width: 180px" @keyup.enter="loadData" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="query.status" placeholder="全部" clearable style="width: 120px">
              <el-option v-for="(v, k) in LOADING_PLAN_STATUS_MAP" :key="k" :label="v.label" :value="k" />
            </el-select>
          </el-form-item>
          <el-form-item label="温区">
            <el-select v-model="query.tempZone" placeholder="全部" clearable style="width: 100px">
              <el-option v-for="(v, k) in TEMP_ZONE_MAP" :key="k" :label="v.label" :value="k" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="loadData"><el-icon><Search /></el-icon> 查询</el-button>
            <el-button @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="showGenerateDialog = true">
          <el-icon><MagicStick /></el-icon> AI生成配载方案
        </el-button>
      </div>
    </el-card>

    <!-- 方案列表 -->
    <el-card shadow="never" class="table-card">
      <el-table :data="list" v-loading="loading" border stripe size="default">
        <el-table-column prop="planNo" label="方案编号" width="120" fixed="left" />
        <el-table-column prop="vehicleNo" label="车牌号" width="110" />
        <el-table-column prop="vehicleType" label="车型" width="140" />
        <el-table-column prop="driverName" label="司机" width="80" />
        <el-table-column label="载重利用率" width="160">
          <template #default="{ row }">
            <div class="rate-bar">
              <el-progress :percentage="row.weightRate" :stroke-width="10" :color="getRateColor(row.weightRate)" />
              <span class="rate-text">{{ row.totalWeight }}/{{ row.maxWeight }}t</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="容积利用率" width="160">
          <template #default="{ row }">
            <div class="rate-bar">
              <el-progress :percentage="row.volumeRate" :stroke-width="10" :color="getRateColor(row.volumeRate)" />
              <span class="rate-text">{{ row.totalVolume }}/{{ row.maxVolume }}m³</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="温区" width="130">
          <template #default="{ row }">
            <el-tag v-for="z in row.tempZones" :key="z" :type="getTempZoneTag(z).type" size="small" class="mr4">{{ getTempZoneTag(z).label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="itemCount" label="货品数" width="70" align="center" />
        <el-table-column label="隔板" width="60" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.partitionRequired" type="warning" size="small">需</el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="混装校验" width="80" align="center">
          <template #default="{ row }">
            <el-icon v-if="!row.hasMixingWarning" color="#67C23A" :size="16"><CircleCheckFilled /></el-icon>
            <el-tooltip v-else content="存在混装禁忌风险" placement="top">
              <el-icon color="#F56C6C" :size="16"><WarningFilled /></el-icon>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="AI评分" width="90" align="center">
          <template #default="{ row }">
            <span class="ai-score">{{ row.aiScore }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="estimatedCost" label="预估费用" width="100">
          <template #default="{ row }">¥{{ row.estimatedCost.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="LOADING_PLAN_STATUS_MAP[row.status]?.type" size="small">{{ LOADING_PLAN_STATUS_MAP[row.status]?.label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="showDetail(row)">详情</el-button>
            <el-button v-if="row.status === 'DRAFT' || row.status === 'RECOMMENDED'" link type="success" size="small" @click="confirmPlan(row)">确认</el-button>
            <el-button link type="primary" size="small">下发WMS</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrap">
        <el-pagination v-model:current-page="query.page" v-model:page-size="query.pageSize" :total="total" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next" @size-change="loadData" @current-change="loadData" />
      </div>
    </el-card>

    <!-- AI生成弹窗 -->
    <el-dialog v-model="showGenerateDialog" title="AI智能配载方案生成" width="600px">
      <el-alert title="系统将基于AI算法，综合考量混装禁忌、温区隔离、载重容积、配送顺序、堆叠规则等多维约束，自动生成最优配载方案" type="info" :closable="false" show-icon style="margin-bottom: 20px;" />
      <el-form :model="genForm" label-width="110px">
        <el-form-item label="选择待配载订单">
          <el-select v-model="genForm.orderIds" multiple filterable placeholder="选择需要配载的订单" style="width: 100%">
            <el-option v-for="i in 10" :key="i" :label="`TMS20260630${100000 + i}`" :value="i" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先车辆温区">
          <el-checkbox-group v-model="genForm.preferredTempZones">
            <el-checkbox value="FROZEN">冷冻区</el-checkbox>
            <el-checkbox value="COLD">冷藏区</el-checkbox>
            <el-checkbox value="CONSTANT">恒温区</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="优化目标">
          <el-radio-group v-model="genForm.objective">
            <el-radio value="LOADING_RATE">最大化装载率</el-radio>
            <el-radio value="COST">最小化运输成本</el-radio>
            <el-radio value="BALANCED">综合平衡</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="强制约束">
          <div class="constraint-tags">
            <el-tag type="danger" size="small" class="mr4">混装禁忌校验</el-tag>
            <el-tag type="warning" size="small" class="mr4">温区物理隔离</el-tag>
            <el-tag type="info" size="small" class="mr4">后送先装原则</el-tag>
            <el-tag size="small" class="mr4">载重不超限</el-tag>
            <el-tag size="small" class="mr4">堆叠高度限制</el-tag>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showGenerateDialog = false">取消</el-button>
        <el-button type="primary" :loading="generating" @click="generate">
          <el-icon><MagicStick /></el-icon> 开始AI计算
        </el-button>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="配载方案详情" width="900px" top="5vh">
      <template v-if="currentPlan">
        <el-descriptions :column="3" border size="small" style="margin-bottom: 16px;">
          <el-descriptions-item label="方案编号">{{ currentPlan.planNo }}</el-descriptions-item>
          <el-descriptions-item label="车牌号">{{ currentPlan.vehicleNo }}</el-descriptions-item>
          <el-descriptions-item label="车型">{{ currentPlan.vehicleType }}</el-descriptions-item>
          <el-descriptions-item label="载重利用率">
            <el-progress :percentage="currentPlan.weightRate" :stroke-width="8" :color="getRateColor(currentPlan.weightRate)" />
          </el-descriptions-item>
          <el-descriptions-item label="容积利用率">
            <el-progress :percentage="currentPlan.volumeRate" :stroke-width="8" :color="getRateColor(currentPlan.volumeRate)" />
          </el-descriptions-item>
          <el-descriptions-item label="AI评分"><span class="ai-score">{{ currentPlan.aiScore }}</span></el-descriptions-item>
        </el-descriptions>
        <el-divider content-position="left">货品配载明细（按装车顺序排列）</el-divider>
        <el-table :data="currentPlan.items" border size="small" max-height="400">
          <el-table-column type="index" label="装车序" width="70" align="center" />
          <el-table-column prop="orderNo" label="订单号" width="150" />
          <el-table-column prop="productName" label="货品名称" width="120" />
          <el-table-column label="温区" width="80" align="center">
            <template #default="{ row }">
              <el-tag :type="getTempZoneTag(row.tempZone).type" size="small">{{ getTempZoneTag(row.tempZone).label }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="weight" label="重量(kg)" width="90" align="center" />
          <el-table-column prop="volume" label="体积(m³)" width="90" align="center" />
          <el-table-column prop="qty" label="数量" width="70" align="center" />
          <el-table-column prop="position" label="摆放位置" width="120" />
          <el-table-column prop="stackLimit" label="堆叠上限" width="80" align="center" />
          <el-table-column prop="deliveryOrder" label="配送序" width="70" align="center" />
        </el-table>
        <el-alert v-if="currentPlan.hasMixingWarning" title="该方案存在混装禁忌风险，请人工复核" type="warning" show-icon :closable="false" style="margin-top: 16px;" />
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getLoadingPlanList, generateLoadingPlan, confirmLoadingPlan } from '@/api/dispatch'
import { LOADING_PLAN_STATUS_MAP, TEMP_ZONE_MAP, getTempZoneTag } from '@/utils/format'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const query = reactive({ page: 1, pageSize: 20, keyword: '', status: '', tempZone: '' })

const showGenerateDialog = ref(false)
const generating = ref(false)
const genForm = reactive({ orderIds: [], preferredTempZones: ['FROZEN', 'COLD'], objective: 'BALANCED' })

const detailVisible = ref(false)
const currentPlan = ref(null)

async function loadData() {
  loading.value = true
  try {
    const res = await getLoadingPlanList(query)
    list.value = res.data.records
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

function resetQuery() {
  Object.assign(query, { page: 1, keyword: '', status: '', tempZone: '' })
  loadData()
}

async function generate() {
  generating.value = true
  try {
    const res = await generateLoadingPlan(genForm.orderIds)
    ElMessage.success('AI配载方案生成成功！')
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
  await confirmLoadingPlan(row.id)
  ElMessage.success('配载方案已确认')
  row.status = 'CONFIRMED'
}

function getRateColor(rate) {
  if (rate >= 90) return '#67C23A'
  if (rate >= 70) return '#409EFF'
  return '#E6A23C'
}

onMounted(() => loadData())
</script>

<style scoped>
.filter-card { margin-bottom: 12px; }
.filter-card :deep(.el-card__body) { padding: 16px; }
.table-card { border: none; }
.rate-bar { display: flex; align-items: center; gap: 8px; }
.rate-bar .el-progress { flex: 1; }
.rate-text { font-size: 12px; color: #909399; white-space: nowrap; }
.ai-score { font-size: 16px; font-weight: 700; color: #409EFF; }
.mr4 { margin-right: 4px; }
.constraint-tags { display: flex; flex-wrap: wrap; gap: 4px; }
.pagination-wrap { display: flex; justify-content: flex-end; margin-top: 16px; }
</style>
