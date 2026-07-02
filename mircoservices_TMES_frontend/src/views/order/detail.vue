<template>
  <div class="page-container">
    <!-- 顶部信息 -->
    <div class="tms-card mb-16">
      <div class="flex-between mb-16">
        <div class="flex gap-12" style="align-items: center;">
          <el-button :icon="ArrowLeft" @click="$router.back()">返回</el-button>
          <h2 class="font-size-20 font-bold">订单详情</h2>
          <el-tag :type="getOrderStatusTag(order.status).type" size="large">
            {{ getOrderStatusTag(order.status).label }}
          </el-tag>
          <el-tag v-if="order.priority === 'HIGH'" type="danger" effect="dark" size="small">高优先</el-tag>
        </div>
        <div class="flex gap-12">
          <el-button v-if="order.status === 'PENDING'" type="primary" @click="handleSplit">
            <el-icon><Share /></el-icon> 智能拆单
          </el-button>
          <el-button v-if="order.status === 'PENDING' || order.status === 'VALIDATED'" type="success" @click="handleDispatch">
            <el-icon><Promotion /></el-icon> 分拨调度
          </el-button>
          <el-button @click="handlePrint">
            <el-icon><Printer /></el-icon> 打印
          </el-button>
        </div>
      </div>

      <el-descriptions :column="4" border size="default">
        <el-descriptions-item label="订单号">{{ order.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="外部单号">{{ order.externalOrderNo }}</el-descriptions-item>
        <el-descriptions-item label="来源渠道">{{ order.sourceName }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ formatDateTime(order.createTime) }}</el-descriptions-item>
        <el-descriptions-item label="客户名称">{{ order.customerName }}</el-descriptions-item>
        <el-descriptions-item label="客户编码">{{ order.customerCode }}</el-descriptions-item>
        <el-descriptions-item label="联系人">{{ order.contactPerson }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ order.contactPhone }}</el-descriptions-item>
        <el-descriptions-item label="收货地址" :span="2">{{ order.deliveryAddress }}</el-descriptions-item>
        <el-descriptions-item label="配送城市">{{ order.deliveryCity }}</el-descriptions-item>
        <el-descriptions-item label="配送区域">{{ order.deliveryRegion }}</el-descriptions-item>
        <el-descriptions-item label="要求送达时间窗" :span="2">
          {{ formatDateTime(order.requireTimeStart) }} ~ {{ formatDateTime(order.requireTimeEnd) }}
        </el-descriptions-item>
        <el-descriptions-item label="承运商">{{ order.carrierName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="车牌号">{{ order.vehicleNo || '-' }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="4">{{ order.remark || '无' }}</el-descriptions-item>
      </el-descriptions>
    </div>

    <!-- 统计概览 -->
    <div class="stat-row mb-16">
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #409EFF, #66b1ff)">
          <el-icon><Box /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ order.itemCount }}</div>
          <div class="stat-label">货品行数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #67C23A, #95d475)">
          <el-icon><ScaleToOriginal /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ order.totalWeight }}<span class="font-size-14"> kg</span></div>
          <div class="stat-label">总重量</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #E6A23C, #f0c78a)">
          <el-icon><Files /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ order.totalVolume }}<span class="font-size-14"> m³</span></div>
          <div class="stat-label">总体积</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #F56C6C, #f89898)">
          <el-icon><Money /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value" style="font-size: 22px;">{{ formatMoney(order.totalAmount) }}</div>
          <div class="stat-label">订单金额</div>
        </div>
      </div>
    </div>

    <div class="detail-row">
      <!-- 左侧：货品明细 -->
      <div class="tms-card detail-left">
        <div class="desc-section-title">货品明细</div>
        <el-table :data="order.items || []" border size="default" style="width: 100%">
          <el-table-column type="index" label="#" width="50" align="center" />
          <el-table-column prop="productName" label="货品名称" min-width="140" show-overflow-tooltip />
          <el-table-column prop="productCode" label="SKU编码" width="120" />
          <el-table-column label="温区" width="100">
            <template #default="{ row }">
              <el-tag :class="getTempZoneTag(row.tempZone).tagClass" size="small">
                {{ getTempZoneTag(row.tempZone).label }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="packageType" label="包装" width="90" />
          <el-table-column prop="quantity" label="数量" width="80" align="center">
            <template #default="{ row }">{{ row.quantity }} {{ row.unit }}</template>
          </el-table-column>
          <el-table-column label="重量" width="100" align="right">
            <template #default="{ row }">{{ row.weight }} kg</template>
          </el-table-column>
          <el-table-column label="体积" width="100" align="right">
            <template #default="{ row }">{{ row.volume }} m³</template>
          </el-table-column>
          <el-table-column label="单价" width="90" align="right">
            <template #default="{ row }">¥{{ row.unitPrice }}</template>
          </el-table-column>
          <el-table-column label="金额" width="110" align="right">
            <template #default="{ row }">{{ formatMoney(row.totalPrice) }}</template>
          </el-table-column>
          <el-table-column prop="productionBatch" label="生产批号" width="150" />
          <el-table-column label="堆叠限制" width="90" align="center">
            <template #default="{ row }">{{ row.stackLimit }}层</template>
          </el-table-column>
          <el-table-column prop="specialReq" label="特殊要求" width="120" show-overflow-tooltip>
            <template #default="{ row }">{{ row.specialReq || '-' }}</template>
          </el-table-column>
        </el-table>

        <!-- 温区汇总 -->
        <div class="mt-16">
          <div class="desc-section-title">温区汇总</div>
          <div class="temp-zone-summary">
            <div v-for="zone in tempZoneSummary" :key="zone.zone" class="zone-card">
              <el-tag :class="getTempZoneTag(zone.zone).tagClass" size="large">
                {{ getTempZoneTag(zone.zone).label }} {{ getTempZoneTag(zone.zone).temp }}
              </el-tag>
              <div class="zone-info">
                <div>货品行: <span class="font-bold">{{ zone.count }}</span></div>
                <div>总重量: <span class="font-bold">{{ zone.weight }} kg</span></div>
                <div>总体积: <span class="font-bold">{{ zone.volume }} m³</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 混装禁忌检查 -->
        <div v-if="mixingWarnings.length > 0" class="mt-16">
          <el-alert
            v-for="(w, i) in mixingWarnings"
            :key="i"
            :title="`混装禁忌警告: ${w}`"
            type="error"
            :closable="false"
            show-icon
            class="mb-8"
          />
        </div>
      </div>

      <!-- 右侧：订单追踪 -->
      <div class="tms-card detail-right">
        <div class="desc-section-title">订单追踪</div>
        <el-timeline class="order-timeline">
          <el-timeline-item
            v-for="(item, idx) in order.timeline || []"
            :key="idx"
            :timestamp="formatDateTime(item.time)"
            placement="top"
            :type="getTimelineType(item.status)"
            :hollow="idx < (order.timeline?.length - 1)"
          >
            <div class="font-bold">{{ item.title }}</div>
            <div class="font-size-13 text-info mt-8">{{ item.desc }}</div>
            <div class="font-size-12 text-info" style="margin-top: 4px;">操作人: {{ item.operator }}</div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Share, Promotion, Printer } from '@element-plus/icons-vue'
import { getOrderDetail, splitOrder, dispatchOrders } from '@/api/order'
import {
  formatDateTime, formatMoney,
  getOrderStatusTag, getTempZoneTag,
  checkMixingTaboo,
} from '@/utils/format'

const route = useRoute()
const router = useRouter()

const order = ref({})

const tempZoneSummary = computed(() => {
  if (!order.value.items) return []
  const zones = {}
  order.value.items.forEach(item => {
    if (!zones[item.tempZone]) {
      zones[item.tempZone] = { zone: item.tempZone, count: 0, weight: 0, volume: 0 }
    }
    zones[item.tempZone].count++
    zones[item.tempZone].weight += item.weight
    zones[item.tempZone].volume += item.volume
  })
  return Object.values(zones).map(z => ({
    ...z,
    weight: z.weight.toFixed(2),
    volume: z.volume.toFixed(3),
  }))
})

const mixingWarnings = computed(() => {
  if (!order.value.items) return []
  return checkMixingTaboo(order.value.items)
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

async function loadData() {
  const res = await getOrderDetail(route.params.id)
  order.value = res.data
}

async function handleSplit() {
  const res = await splitOrder(order.value.id)
  if (res.data.splitResults?.length > 0) {
    ElMessageBox.alert(
      res.data.splitResults.map(s => `子单号: ${s.subOrderNo} | 温区: ${getTempZoneTag(s.tempZone).label} | 货品: ${s.itemCount}件 | 重量: ${s.weight}kg`).join('\n'),
      '拆单完成',
      { confirmButtonText: '确定', type: 'success' }
    )
  } else {
    ElMessage.info('该订单为单温区，无需拆单')
  }
  loadData()
}

async function handleDispatch() {
  await dispatchOrders({ orderIds: [order.value.id] })
  ElMessage.success('已提交分拨调度')
  loadData()
}

function handlePrint() {
  ElMessage.info('打印功能开发中')
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.stat-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.detail-row {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.detail-left {
  flex: 1;
  min-width: 0;
}
.detail-right {
  width: 360px;
  flex-shrink: 0;
}
.temp-zone-summary {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.zone-card {
  background: var(--tms-bg);
  border-radius: 8px;
  padding: 16px;
  min-width: 200px;
}
.zone-info {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: var(--tms-text-regular);
}
.mt-8 {
  margin-top: 8px;
}
</style>
