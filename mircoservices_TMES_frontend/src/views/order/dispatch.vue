<template>
  <div class="page-container">
    <!-- 说明 -->
    <el-alert
      title="智能分单引擎"
      description="基于温区、配送区域、时效规则自动分单与拆单，规避混装禁忌。系统会检测多温区订单并自动拆分为独立运输任务，按「区域+温区+配送时效」组合维度分配运力。"
      type="info"
      show-icon
      :closable="false"
      class="mb-16"
    />

    <!-- 待分拨订单 -->
    <div class="tms-card mb-16">
      <div class="flex-between mb-16">
        <div class="desc-section-title" style="margin-bottom: 0;">待分拨订单（{{ pendingOrders.length }} 单）</div>
        <div class="flex gap-12">
          <el-button type="primary" :disabled="selectedIds.length === 0" :loading="dispatching" @click="handleBatchDispatch">
            <el-icon><Share /></el-icon> 批量智能分拨（{{ selectedIds.length }}）
          </el-button>
          <el-button @click="loadData">
            <el-icon><Refresh /></el-icon> 刷新
          </el-button>
        </div>
      </div>
      <el-table
        v-loading="loading"
        :data="pendingOrders"
        border
        stripe
        max-height="400"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="48" align="center" />
        <el-table-column prop="orderNo" label="订单号" width="195" />
        <el-table-column prop="customerName" label="客户" min-width="160" show-overflow-tooltip />
        <el-table-column prop="sourceName" label="来源" width="100" />
        <el-table-column label="温区" width="150">
          <template #default="{ row }">
            <el-tag
              v-for="zone in row.tempZones"
              :key="zone"
              :class="getTempZoneTag(zone).tagClass"
              size="small"
              style="margin-right: 4px;"
            >
              {{ getTempZoneTag(zone).label }}
            </el-tag>
            <el-tag v-if="row.tempZones.length > 1" type="danger" size="small" effect="dark" style="margin-left: 4px;">
              需拆单
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deliveryCity" label="城市" width="90" />
        <el-table-column prop="deliveryRegion" label="区域" width="80" />
        <el-table-column label="时间窗" width="200">
          <template #default="{ row }">
            <div class="font-size-12">
              {{ formatDateTime(row.requireTimeStart, 'MM-DD HH:mm') }} ~ {{ formatDateTime(row.requireTimeEnd, 'MM-DD HH:mm') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="itemCount" label="货品" width="60" align="center" />
        <el-table-column label="重量" width="90" align="right">
          <template #default="{ row }">{{ row.totalWeight }}kg</template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleSingleDispatch(row)">分拨</el-button>
            <el-button v-if="row.tempZones.length > 1" type="warning" link size="small" @click="handlePreviewSplit(row)">预览拆单</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分拨规则配置 -->
    <div class="tms-card mb-16">
      <div class="desc-section-title">分拨规则配置</div>
      <div class="rules-grid">
        <div class="rule-card">
          <div class="rule-icon" style="background: #409EFF;">
            <el-icon><Location /></el-icon>
          </div>
          <div class="rule-content">
            <div class="rule-title">区域分组</div>
            <div class="rule-desc">按配送区域（华东/华北/华南等）自动分组，同区域订单优先合并</div>
          </div>
        </div>
        <div class="rule-card">
          <div class="rule-icon" style="background: #67C23A;">
            <el-icon><ColdDrink /></el-icon>
          </div>
          <div class="rule-content">
            <div class="rule-title">温区隔离</div>
            <div class="rule-desc">检测多温区订单自动拆单，不同温区分配独立车辆，规避混装禁忌</div>
          </div>
        </div>
        <div class="rule-card">
          <div class="rule-icon" style="background: #E6A23C;">
            <el-icon><Timer /></el-icon>
          </div>
          <div class="rule-content">
            <div class="rule-title">时效匹配</div>
            <div class="rule-desc">按收货时间窗匹配运力，团餐客户预留30分钟弹性缓冲</div>
          </div>
        </div>
        <div class="rule-card">
          <div class="rule-icon" style="background: #F56C6C;">
            <el-icon><Warning /></el-icon>
          </div>
          <div class="rule-content">
            <div class="rule-title">禁忌校验</div>
            <div class="rule-desc">活鲜与熟食、带冰与干粉、高呼吸果蔬与乳品不可混装</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分拨结果 -->
    <div v-if="dispatchResults.length > 0" class="tms-card">
      <div class="desc-section-title">分拨结果</div>
      <div v-for="(result, idx) in dispatchResults" :key="idx" class="dispatch-result-card">
        <div class="result-header">
          <el-tag type="success" size="large">分拨批次 {{ idx + 1 }}</el-tag>
          <span class="result-info">原订单: {{ result.originalOrder }} → 拆分为 {{ result.splitResults.length }} 个子任务</span>
        </div>
        <div class="sub-tasks">
          <div v-for="sub in result.splitResults" :key="sub.subOrderNo" class="sub-task-card">
            <div class="sub-task-header">
              <span class="sub-task-no">{{ sub.subOrderNo }}</span>
              <el-tag :class="getTempZoneTag(sub.tempZone).tagClass" size="small">
                {{ getTempZoneTag(sub.tempZone).label }} {{ getTempZoneTag(sub.tempZone).temp }}
              </el-tag>
            </div>
            <div class="sub-task-info">
              <span>货品: {{ sub.itemCount }} 件</span>
              <span>重量: {{ sub.weight }} kg</span>
            </div>
            <el-tag type="success" size="small" effect="plain" style="margin-top: 8px;">
              <el-icon><Check /></el-icon> 已匹配运力
            </el-tag>
          </div>
        </div>
      </div>
    </div>

    <!-- 拆单预览对话框 -->
    <el-dialog v-model="splitDialogVisible" title="拆单预览" width="600px">
      <div v-if="previewOrder" class="split-preview">
        <el-alert type="warning" :closable="false" show-icon class="mb-16">
          <template #title>
            订单 {{ previewOrder.orderNo }} 包含 {{ previewOrder.tempZones.length }} 个温区，需拆分为 {{ previewOrder.tempZones.length }} 个独立运输任务
          </template>
        </el-alert>
        <div v-for="zone in previewOrder.tempZones" :key="zone" class="preview-zone-card">
          <div class="flex-between mb-8">
            <el-tag :class="getTempZoneTag(zone).tagClass" size="large">
              {{ getTempZoneTag(zone).label }} {{ getTempZoneTag(zone).temp }}
            </el-tag>
            <span class="text-info font-size-12">独立车辆运输</span>
          </div>
          <el-table :data="getZoneItems(previewOrder, zone)" size="small" border>
            <el-table-column prop="productName" label="货品" min-width="140" />
            <el-table-column prop="quantity" label="数量" width="80" />
            <el-table-column label="重量" width="90" align="right">
              <template #default="{ row }">{{ row.weight }}kg</template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getOrderList, dispatchOrders, splitOrder } from '@/api/order'
import { formatDateTime, getTempZoneTag } from '@/utils/format'

const loading = ref(false)
const dispatching = ref(false)
const pendingOrders = ref([])
const selectedIds = ref([])
const dispatchResults = ref([])
const splitDialogVisible = ref(false)
const previewOrder = ref(null)

const selectedCount = computed(() => selectedIds.value.length)

async function loadData() {
  loading.value = true
  try {
    // 获取待处理和已校验的订单
    const [res1, res2] = await Promise.all([
      getOrderList({ page: 1, pageSize: 100, status: 'PENDING' }),
      getOrderList({ page: 1, pageSize: 100, status: 'VALIDATED' }),
    ])
    pendingOrders.value = [...res1.data.records, ...res2.data.records]
  } finally {
    loading.value = false
  }
}

function handleSelectionChange(val) {
  selectedIds.value = val.map(o => o.id)
}

async function handleBatchDispatch() {
  dispatching.value = true
  try {
    const res = await dispatchOrders({ orderIds: selectedIds.value })
    ElMessage.success(`成功分拨 ${res.data.successCount}/${res.data.totalCount} 个订单`)
    // 对多温区订单执行拆单
    const multiTempOrders = selectedIds.value
      .map(id => pendingOrders.value.find(o => o.id === id))
      .filter(o => o && o.tempZones.length > 1)
    for (const order of multiTempOrders) {
      const splitRes = await splitOrder(order.id)
      if (splitRes.data.splitResults?.length > 0) {
        dispatchResults.value.unshift(splitRes.data)
      }
    }
    loadData()
  } finally {
    dispatching.value = false
  }
}

async function handleSingleDispatch(order) {
  await dispatchOrders({ orderIds: [order.id] })
  ElMessage.success(`订单 ${order.orderNo} 已提交分拨`)
  if (order.tempZones.length > 1) {
    const splitRes = await splitOrder(order.id)
    if (splitRes.data.splitResults?.length > 0) {
      dispatchResults.value.unshift(splitRes.data)
    }
  }
  loadData()
}

function handlePreviewSplit(order) {
  previewOrder.value = order
  splitDialogVisible.value = true
}

function getZoneItems(order, zone) {
  return order.items.filter(i => i.tempZone === zone)
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.rules-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.rule-card {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: var(--tms-bg);
  border-radius: 8px;
}
.rule-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  flex-shrink: 0;
}
.rule-content {
  flex: 1;
}
.rule-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}
.rule-desc {
  font-size: 12px;
  color: var(--tms-text-secondary);
  line-height: 1.5;
}
.dispatch-result-card {
  background: var(--tms-bg);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}
.result-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.result-info {
  font-size: 13px;
  color: var(--tms-text-regular);
}
.sub-tasks {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.sub-task-card {
  background: #fff;
  border-radius: 8px;
  padding: 12px 16px;
  min-width: 200px;
  border: 1px solid var(--tms-border-color);
}
.sub-task-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.sub-task-no {
  font-size: 13px;
  font-weight: 600;
}
.sub-task-info {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--tms-text-secondary);
}
.preview-zone-card {
  margin-bottom: 16px;
}
.mb-8 {
  margin-bottom: 8px;
}
</style>
