<template>
  <div class="page-container">
    <!-- 筛选栏 -->
    <div class="filter-bar">
      <el-form :inline="true" :model="filters" size="default">
        <el-form-item label="订单号/客户">
          <el-input v-model="filters.keyword" placeholder="订单号/客户/外部单号" clearable style="width: 220px" @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="filters.status" placeholder="全部" clearable style="width: 130px">
            <el-option v-for="(v, k) in ORDER_STATUS_MAP" :key="k" :label="v.label" :value="k" />
          </el-select>
        </el-form-item>
        <el-form-item label="来源渠道">
          <el-select v-model="filters.source" placeholder="全部" clearable style="width: 130px">
            <el-option v-for="(v, k) in ORDER_SOURCE_MAP" :key="k" :label="v" :value="k" />
          </el-select>
        </el-form-item>
        <el-form-item label="温区">
          <el-select v-model="filters.tempZone" placeholder="全部" clearable style="width: 120px">
            <el-option v-for="(v, k) in TEMP_ZONE_MAP" :key="k" :label="`${v.label} ${v.temp}`" :value="k" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="filters.priority" placeholder="全部" clearable style="width: 110px">
            <el-option v-for="(v, k) in PRIORITY_MAP" :key="k" :label="v.label" :value="k" />
          </el-select>
        </el-form-item>
        <el-form-item label="配送区域">
          <el-select v-model="filters.region" placeholder="全部" clearable style="width: 110px">
            <el-option label="华东" value="华东" />
            <el-option label="华北" value="华北" />
            <el-option label="华南" value="华南" />
            <el-option label="华中" value="华中" />
            <el-option label="西南" value="西南" />
            <el-option label="西北" value="西北" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon> 查询
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon> 重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 操作栏 -->
    <div class="tms-card" style="padding: 12px 20px; margin-bottom: 16px;">
      <div class="flex-between">
        <div class="flex gap-12">
          <el-button type="primary" @click="$router.push('/order/create')">
            <el-icon><Plus /></el-icon> 新建订单
          </el-button>
          <el-button type="success" :disabled="selection.length === 0" @click="handleBatchDispatch">
            <el-icon><Share /></el-icon> 批量分拨
          </el-button>
          <el-button type="warning" :disabled="selection.length === 0" @click="handleBatchExport">
            <el-icon><Download /></el-icon> 导出
          </el-button>
        </div>
        <div class="text-info font-size-12">
          共 <span class="text-primary font-bold">{{ total }}</span> 条订单
        </div>
      </div>
    </div>

    <!-- 订单表格 -->
    <div class="tms-card" style="padding: 0;">
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
      >
        <el-table-column type="selection" width="48" align="center" />
        <el-table-column prop="orderNo" label="订单号" width="195" fixed="left">
          <template #default="{ row }">
            <span class="table-action-link" @click.stop="goDetail(row.id)">{{ row.orderNo }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="externalOrderNo" label="外部单号" width="140" show-overflow-tooltip />
        <el-table-column prop="customerName" label="客户名称" min-width="180" show-overflow-tooltip />
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
          </template>
        </el-table-column>
        <el-table-column prop="deliveryCity" label="配送城市" width="90" />
        <el-table-column prop="deliveryRegion" label="区域" width="80" />
        <el-table-column label="优先级" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="PRIORITY_MAP[row.priority]?.type" size="small" effect="plain">
              {{ PRIORITY_MAP[row.priority]?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getOrderStatusTag(row.status).type" size="small">
              {{ getOrderStatusTag(row.status).label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="itemCount" label="货品数" width="80" align="center" />
        <el-table-column label="总重量" width="100" align="right">
          <template #default="{ row }">{{ row.totalWeight }} kg</template>
        </el-table-column>
        <el-table-column label="总金额" width="110" align="right">
          <template #default="{ row }">{{ formatMoney(row.totalAmount) }}</template>
        </el-table-column>
        <el-table-column label="创建时间" width="170">
          <template #default="{ row }">{{ formatDateTime(row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <span class="table-action-link" @click.stop="goDetail(row.id)">详情</span>
            <span class="table-action-link" @click.stop="goTracking(row.orderNo)">追踪</span>
            <span v-if="row.status === 'PENDING'" class="table-action-link" @click.stop="handleSplit(row)">拆单</span>
            <span v-if="row.status !== 'COMPLETED' && row.status !== 'CANCELLED'" class="table-action-link danger" @click.stop="handleCancel(row)">取消</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrap">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSearch"
          @current-change="fetchData"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getOrderList, dispatchOrders, splitOrder, cancelOrder } from '@/api/order'
import {
  formatDateTime, formatMoney,
  getOrderStatusTag, getTempZoneTag,
  ORDER_STATUS_MAP, TEMP_ZONE_MAP, ORDER_SOURCE_MAP, PRIORITY_MAP,
} from '@/utils/format'

const router = useRouter()

const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)
const selection = ref([])

const filters = reactive({
  keyword: '',
  status: '',
  source: '',
  tempZone: '',
  priority: '',
  region: '',
})

async function fetchData() {
  loading.value = true
  try {
    const res = await getOrderList({
      page: currentPage.value,
      pageSize: pageSize.value,
      ...filters,
    })
    tableData.value = res.data.records
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  currentPage.value = 1
  fetchData()
}

function handleReset() {
  Object.keys(filters).forEach(k => filters[k] = '')
  handleSearch()
}

function handleSelectionChange(val) {
  selection.value = val
}

function handleRowClick(row) {
  // 可选：点击行跳转详情
}

function goDetail(id) {
  router.push(`/order/detail/${id}`)
}

function goTracking(orderNo) {
  router.push({ path: '/order/tracking', query: { orderNo } })
}

async function handleSplit(row) {
  const res = await splitOrder(row.id)
  if (res.data.splitResults?.length > 0) {
    ElMessageBox.alert(
      res.data.splitResults.map(s => `子单号: ${s.subOrderNo} | 温区: ${getTempZoneTag(s.tempZone).label} | 货品: ${s.itemCount}件 | 重量: ${s.weight}kg`).join('\n'),
      `拆单完成 - ${row.orderNo}`,
      { confirmButtonText: '确定', type: 'success' }
    )
  } else {
    ElMessage.info('该订单为单温区，无需拆单')
  }
  fetchData()
}

function handleCancel(row) {
  ElMessageBox.prompt('请输入取消原因', `取消订单 - ${row.orderNo}`, {
    confirmButtonText: '确认取消',
    cancelButtonText: '返回',
    inputType: 'textarea',
    inputPlaceholder: '请输入取消原因...',
    inputValidator: (val) => !!val?.trim() || '取消原因不能为空',
  }).then(async ({ value }) => {
    await cancelOrder(row.id, value)
    ElMessage.success('订单已取消')
    fetchData()
  }).catch(() => {})
}

async function handleBatchDispatch() {
  const ids = selection.value.map(o => o.id)
  const res = await dispatchOrders({ orderIds: ids })
  ElMessage.success(`成功分拨 ${res.data.successCount}/${res.data.totalCount} 个订单`)
  fetchData()
}

function handleBatchExport() {
  ElMessage.success(`正在导出 ${selection.value.length} 条订单...`)
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.pagination-wrap {
  padding: 16px 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
