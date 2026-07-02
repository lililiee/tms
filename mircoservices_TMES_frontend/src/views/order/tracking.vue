<template>
  <div class="page-container">
    <!-- 搜索栏 -->
    <div class="filter-bar">
      <el-form :inline="true" :model="searchForm" size="default">
        <el-form-item label="订单号">
          <el-input v-model="searchForm.orderNo" placeholder="输入订单号查询" clearable style="width: 220px" @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部状态" clearable style="width: 140px">
            <el-option v-for="(v, k) in ORDER_STATUS_MAP" :key="k" :label="v.label" :value="k" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon> 查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 订单流程可视化 -->
    <div class="tms-card mb-16" v-if="currentOrder">
      <div class="flex-between mb-20">
        <div class="flex gap-12" style="align-items: center;">
          <h3 class="font-size-18 font-bold">{{ currentOrder.orderNo }}</h3>
          <el-tag :type="getOrderStatusTag(currentOrder.status).type">{{ getOrderStatusTag(currentOrder.status).label }}</el-tag>
          <span class="text-info">{{ currentOrder.customerName }}</span>
        </div>
        <div class="text-info font-size-12">
          创建: {{ formatDateTime(currentOrder.createTime) }}
        </div>
      </div>

      <!-- 流程步骤条 -->
      <el-steps :active="currentStep" align-center finish-status="success">
        <el-step title="订单接入" description="多渠道归集" :icon="Connection" />
        <el-step title="数据校验" description="标准化转换" :icon="CircleCheck" />
        <el-step title="自动分单" description="拆单/分拨" :icon="Share" />
        <el-step title="调度匹配" description="运力分配" :icon="Van" />
        <el-step title="在途运输" description="实时监控" :icon="Position" />
        <el-step title="签收完成" description="回单归档" :icon="Finished" />
      </el-steps>

      <!-- 上下游协同状态 -->
      <div class="mt-20">
        <div class="desc-section-title">上下游系统协同状态</div>
        <div class="collab-grid">
          <div class="collab-card" v-for="sys in collaborationSystems" :key="sys.name">
            <div class="collab-header">
              <el-icon :size="20" :color="sys.synced ? '#67C23A' : '#909399'">
                <component :is="sys.icon" />
              </el-icon>
              <span class="collab-name">{{ sys.name }}</span>
            </div>
            <div class="collab-status">
              <el-tag :type="sys.synced ? 'success' : 'info'" size="small" effect="plain">
                {{ sys.synced ? '已同步' : '待同步' }}
              </el-tag>
              <span class="collab-time font-size-12 text-info">{{ sys.syncTime || '-' }}</span>
            </div>
            <div class="collab-detail font-size-12 text-info">{{ sys.detail }}</div>
          </div>
        </div>
      </div>

      <!-- 详细时间线 -->
      <div class="mt-20">
        <div class="desc-section-title">全链路追踪</div>
        <el-timeline class="order-timeline">
          <el-timeline-item
            v-for="(item, idx) in currentOrder.timeline || []"
            :key="idx"
            :timestamp="formatDateTime(item.time)"
            placement="top"
            :type="getTimelineType(item.status)"
          >
            <div class="font-bold">{{ item.title }}</div>
            <div class="font-size-13 text-info mt-8">{{ item.desc }}</div>
            <div class="font-size-12 text-info">操作人: {{ item.operator }}</div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>

    <!-- 查询结果列表 -->
    <div class="tms-card" v-else>
      <div class="desc-section-title">订单追踪列表</div>
      <el-table v-loading="loading" :data="tableData" border stripe>
        <el-table-column prop="orderNo" label="订单号" width="195">
          <template #default="{ row }">
            <span class="table-action-link" @click="viewOrder(row)">{{ row.orderNo }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="customerName" label="客户" min-width="160" show-overflow-tooltip />
        <el-table-column prop="sourceName" label="来源" width="100" />
        <el-table-column label="温区" width="150">
          <template #default="{ row }">
            <el-tag v-for="zone in row.tempZones" :key="zone" :class="getTempZoneTag(zone).tagClass" size="small" style="margin-right: 4px;">
              {{ getTempZoneTag(zone).label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="当前状态" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getOrderStatusTag(row.status).type" size="small">{{ getOrderStatusTag(row.status).label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="170">
          <template #default="{ row }">{{ formatDateTime(row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="viewOrder(row)">追踪</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrap">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          layout="total, prev, pager, next"
          @current-change="fetchData"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  Connection, CircleCheck, Share, Van, Position, Finished,
} from '@element-plus/icons-vue'
import { getOrderList, getOrderDetail } from '@/api/order'
import { formatDateTime, getOrderStatusTag, getTempZoneTag, ORDER_STATUS_MAP } from '@/utils/format'

const route = useRoute()
const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)
const currentOrder = ref(null)

const searchForm = reactive({
  orderNo: '',
  status: '',
})

const collaborationSystems = computed(() => {
  if (!currentOrder.value) return []
  const status = currentOrder.value.status
  return [
    {
      name: 'ERP系统',
      icon: 'OfficeBuilding',
      synced: true,
      syncTime: formatDateTime(currentOrder.value.createTime),
      detail: '销售订单数据已同步',
    },
    {
      name: 'WMS系统',
      icon: 'Box',
      synced: ['DISPATCHED', 'PROCESSING', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED'].includes(status),
      syncTime: ['DISPATCHED', 'PROCESSING', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED'].includes(status) ? formatDateTime(currentOrder.value.createTime, 'YYYY-MM-DD HH:mm') : null,
      detail: ['DISPATCHED', 'PROCESSING', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED'].includes(status) ? '装车指令已下发' : '待下发装车指令',
    },
    {
      name: 'MES系统',
      icon: 'Setting',
      synced: true,
      syncTime: formatDateTime(currentOrder.value.createTime),
      detail: '生产批次信息已同步',
    },
    {
      name: '财务系统',
      icon: 'Money',
      synced: status === 'COMPLETED',
      syncTime: status === 'COMPLETED' ? formatDateTime(currentOrder.value.createTime, 'YYYY-MM-DD HH:mm') : null,
      detail: status === 'COMPLETED' ? '运费已核算' : '待运输完成后核算',
    },
  ]
})

const currentStep = computed(() => {
  if (!currentOrder.value) return 0
  const map = {
    PENDING: 0,
    VALIDATED: 1,
    SPLITTING: 2,
    DISPATCHED: 3,
    PROCESSING: 3,
    IN_TRANSIT: 4,
    DELIVERED: 5,
    COMPLETED: 5,
    EXCEPTION: 4,
    CANCELLED: 0,
  }
  return map[currentOrder.value.status] || 0
})

function getTimelineType(status) {
  const map = {
    CREATED: 'primary',
    VALIDATED: 'primary',
    SPLITTING: 'warning',
    DISPATCHED: 'success',
    PROCESSING: 'warning',
    IN_TRANSIT: 'primary',
    DELIVERED: 'success',
    COMPLETED: 'success',
    EXCEPTION: 'danger',
  }
  return map[status] || 'info'
}

async function fetchData() {
  loading.value = true
  try {
    const res = await getOrderList({
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchForm.orderNo,
      status: searchForm.status,
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

async function viewOrder(row) {
  const res = await getOrderDetail(row.id)
  currentOrder.value = res.data
}

onMounted(async () => {
  // 如果有query参数orderNo，直接查询
  if (route.query.orderNo) {
    searchForm.orderNo = route.query.orderNo
    const res = await getOrderList({ page: 1, pageSize: 1, keyword: route.query.orderNo })
    if (res.data.records.length > 0) {
      await viewOrder(res.data.records[0])
    }
  } else {
    fetchData()
  }
})
</script>

<style scoped>
.collab-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.collab-card {
  background: var(--tms-bg);
  border-radius: 8px;
  padding: 16px;
}
.collab-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.collab-name {
  font-size: 14px;
  font-weight: 600;
}
.collab-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.collab-detail {
  line-height: 1.5;
}
.pagination-wrap {
  padding: 16px 0 0;
  display: flex;
  justify-content: flex-end;
}
.mt-8 {
  margin-top: 8px;
}
</style>
