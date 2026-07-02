<template>
  <div class="page-container">
    <!-- 统计卡片 -->
    <div class="stat-row">
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #409EFF, #66b1ff)">
          <el-icon><Document /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.total || 0 }}</div>
          <div class="stat-label">订单总数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #E6A23C, #f0c78a)">
          <el-icon><Clock /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.pending || 0 }}</div>
          <div class="stat-label">待处理</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #67C23A, #95d475)">
          <el-icon><Van /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.inTransit || 0 }}</div>
          <div class="stat-label">运输中</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #F56C6C, #f89898)">
          <el-icon><Warning /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.exception || 0 }}</div>
          <div class="stat-label">异常订单</div>
        </div>
      </div>
    </div>

    <!-- 图表区域 第一行 -->
    <div class="chart-row">
      <div class="tms-card chart-card-large">
        <div class="card-header">
          <span class="card-title">近7天订单趋势</span>
          <el-radio-group v-model="trendType" size="small">
            <el-radio-button label="total">总数</el-radio-button>
            <el-radio-button label="completed">完成</el-radio-button>
            <el-radio-button label="exception">异常</el-radio-button>
          </el-radio-group>
        </div>
        <div ref="trendChartRef" class="chart-box"></div>
      </div>
      <div class="tms-card chart-card-small">
        <div class="card-header">
          <span class="card-title">温区分布</span>
        </div>
        <div ref="tempZoneChartRef" class="chart-box"></div>
      </div>
    </div>

    <!-- 图表区域 第二行 -->
    <div class="chart-row">
      <div class="tms-card chart-card-small">
        <div class="card-header">
          <span class="card-title">订单来源渠道</span>
        </div>
        <div ref="sourceChartRef" class="chart-box"></div>
      </div>
      <div class="tms-card chart-card-small">
        <div class="card-header">
          <span class="card-title">配送区域分布</span>
        </div>
        <div ref="regionChartRef" class="chart-box"></div>
      </div>
      <div class="tms-card chart-card-small">
        <div class="card-header">
          <span class="card-title">优先级分布</span>
        </div>
        <div ref="priorityChartRef" class="chart-box"></div>
      </div>
    </div>

    <!-- 最近订单 -->
    <div class="tms-card mt-16">
      <div class="card-header">
        <span class="card-title">最近订单</span>
        <el-button type="primary" link @click="$router.push('/order/list')">
          查看全部 <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
      <el-table :data="recentOrders" stripe size="default">
        <el-table-column prop="orderNo" label="订单号" width="200" />
        <el-table-column prop="customerName" label="客户" min-width="180" show-overflow-tooltip />
        <el-table-column prop="sourceName" label="来源" width="120" />
        <el-table-column label="温区" width="160">
          <template #default="{ row }">
            <el-tag
              v-for="zone in row.tempZones"
              :key="zone"
              :class="getTempZoneTag(zone).tagClass"
              size="small"
              class="mr-4"
            >
              {{ getTempZoneTag(zone).label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getOrderStatusTag(row.status).type" size="small">
              {{ getOrderStatusTag(row.status).label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template #default="{ row }">{{ formatDateTime(row.createTime) }}</template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import { getOrderStats, getOrderList } from '@/api/order'
import { formatDateTime, getTempZoneTag, getOrderStatusTag, TEMP_ZONE_MAP, ORDER_SOURCE_MAP } from '@/utils/format'

const stats = ref({})
const recentOrders = ref([])
const trendType = ref('total')

// Chart refs
const trendChartRef = ref()
const tempZoneChartRef = ref()
const sourceChartRef = ref()
const regionChartRef = ref()
const priorityChartRef = ref()

// Chart instances
let trendChart, tempZoneChart, sourceChart, regionChart, priorityChart

async function loadData() {
  const [statsRes, listRes] = await Promise.all([
    getOrderStats(),
    getOrderList({ page: 1, pageSize: 8 }),
  ])
  stats.value = statsRes.data
  recentOrders.value = listRes.data.records
  await nextTick()
  renderCharts()
}

function renderTrendChart() {
  if (!trendChartRef.value) return
  trendChart = echarts.init(trendChartRef.value)
  updateTrendChart()
}

function updateTrendChart() {
  if (!trendChart || !stats.value.trend7d) return
  const data = stats.value.trend7d
  trendChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['总数', '完成', '异常'], bottom: 0 },
    grid: { top: 20, left: 50, right: 20, bottom: 40 },
    xAxis: { type: 'category', data: data.map(d => d.date), boundaryGap: false },
    yAxis: { type: 'value' },
    series: [
      {
        name: '总数',
        type: 'line',
        smooth: true,
        data: data.map(d => d.total),
        itemStyle: { color: '#409EFF' },
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(64,158,255,0.3)' },
          { offset: 1, color: 'rgba(64,158,255,0.02)' },
        ])},
      },
      {
        name: '完成',
        type: 'line',
        smooth: true,
        data: data.map(d => d.completed),
        itemStyle: { color: '#67C23A' },
      },
      {
        name: '异常',
        type: 'line',
        smooth: true,
        data: data.map(d => d.exception),
        itemStyle: { color: '#F56C6C' },
      },
    ],
  })
}

function renderTempZoneChart() {
  if (!tempZoneChartRef.value) return
  tempZoneChart = echarts.init(tempZoneChartRef.value)
  const dist = stats.value.tempZoneDist || {}
  tempZoneChart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0 },
    series: [{
      type: 'pie',
      radius: ['40%', '65%'],
      center: ['50%', '45%'],
      data: [
        { value: dist.FROZEN || 0, name: '冷冻(≤-18℃)', itemStyle: { color: '#409EFF' } },
        { value: dist.COLD || 0, name: '冷藏(0~4℃)', itemStyle: { color: '#67C23A' } },
        { value: dist.CONSTANT || 0, name: '恒温(10~15℃)', itemStyle: { color: '#E6A23C' } },
      ],
      label: { show: true, formatter: '{b}\n{c}单' },
    }],
  })
}

function renderSourceChart() {
  if (!sourceChartRef.value) return
  sourceChart = echarts.init(sourceChartRef.value)
  const dist = stats.value.sourceDist || {}
  sourceChart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { top: 20, left: 80, right: 20, bottom: 20 },
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: Object.keys(dist).map(k => ORDER_SOURCE_MAP[k] || k) },
    series: [{
      type: 'bar',
      data: Object.values(dist),
      barWidth: 18,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: '#409EFF' },
          { offset: 1, color: '#66b1ff' },
        ]),
        borderRadius: [0, 4, 4, 0],
      },
      label: { show: true, position: 'right' },
    }],
  })
}

function renderRegionChart() {
  if (!regionChartRef.value) return
  regionChart = echarts.init(regionChartRef.value)
  const dist = stats.value.regionDist || {}
  regionChart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c}单 ({d}%)' },
    legend: { bottom: 0, type: 'scroll' },
    series: [{
      type: 'pie',
      radius: '60%',
      center: ['50%', '45%'],
      data: Object.entries(dist).map(([k, v]) => ({ name: k, value: v })),
      label: { formatter: '{b}: {c}' },
    }],
  })
}

function renderPriorityChart() {
  if (!priorityChartRef.value) return
  priorityChart = echarts.init(priorityChartRef.value)
  const dist = stats.value.priorityDist || {}
  priorityChart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { top: 20, left: 50, right: 20, bottom: 30 },
    xAxis: { type: 'category', data: ['高优先', '普通', '低优先'] },
    yAxis: { type: 'value' },
    series: [{
      type: 'bar',
      data: [
        { value: dist.HIGH || 0, itemStyle: { color: '#F56C6C' } },
        { value: dist.NORMAL || 0, itemStyle: { color: '#409EFF' } },
        { value: dist.LOW || 0, itemStyle: { color: '#909399' } },
      ],
      barWidth: 30,
      label: { show: true, position: 'top' },
      itemStyle: { borderRadius: [4, 4, 0, 0] },
    }],
  })
}

function renderCharts() {
  renderTrendChart()
  renderTempZoneChart()
  renderSourceChart()
  renderRegionChart()
  renderPriorityChart()
}

function handleResize() {
  trendChart?.resize()
  tempZoneChart?.resize()
  sourceChart?.resize()
  regionChart?.resize()
  priorityChart?.resize()
}

watch(trendType, () => updateTrendChart())

onMounted(() => {
  loadData()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  trendChart?.dispose()
  tempZoneChart?.dispose()
  sourceChart?.dispose()
  regionChart?.dispose()
  priorityChart?.dispose()
})
</script>

<style scoped>
.stat-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}
.chart-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}
.chart-card-large {
  flex: 2;
}
.chart-card-small {
  flex: 1;
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.card-title {
  font-size: 16px;
  font-weight: 600;
}
.chart-box {
  height: 300px;
}
.mr-4 {
  margin-right: 4px;
}
</style>
