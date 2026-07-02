<template>
  <div class="page-container">
    <el-tabs v-model="activeTab" class="content-tabs">
      <el-tab-pane label="围栏管理" name="fence">
        <el-card shadow="never" class="filter-card">
          <el-form :inline="true" :model="fenceQuery" size="default">
            <el-form-item label="围栏名称">
              <el-input v-model="fenceQuery.keyword" placeholder="名称/地址" clearable style="width: 180px" @keyup.enter="loadFences" />
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="fenceQuery.type" placeholder="全部" clearable style="width: 130px">
                <el-option v-for="(v, k) in GEOFENCE_TYPE_MAP" :key="k" :label="v.label" :value="k" />
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="fenceQuery.status" placeholder="全部" clearable style="width: 100px">
                <el-option label="启用" value="ACTIVE" />
                <el-option label="停用" value="INACTIVE" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="loadFences"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="resetFenceQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card shadow="never" class="table-card">
          <el-table :data="fenceList" v-loading="loading" border stripe size="default">
            <el-table-column prop="name" label="围栏名称" width="180" fixed="left" />
            <el-table-column label="类型" width="100" align="center">
              <template #default="{ row }">
                <div class="flex-center" style="gap: 4px;">
                  <el-icon :size="14"><component :is="GEOFENCE_TYPE_MAP[row.type]?.icon" /></el-icon>
                  <span>{{ GEOFENCE_TYPE_MAP[row.type]?.label }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="形状" width="80" align="center">
              <template #default="{ row }">
                <el-tag size="small" effect="plain">{{ row.shape === 'CIRCLE' ? '圆形' : '多边形' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="中心坐标" width="200">
              <template #default="{ row }">
                {{ row.centerLng.toFixed(4) }}, {{ row.centerLat.toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column label="半径" width="80" align="center">
              <template #default="{ row }">{{ row.radius ? row.radius + 'm' : '-' }}</template>
            </el-table-column>
            <el-table-column prop="address" label="地址" min-width="200" show-overflow-tooltip />
            <el-table-column label="触发规则" width="150">
              <template #default="{ row }">
                <el-tag v-for="r in row.notifyRules" :key="r" :type="GEOFENCE_TRIGGER_MAP[r]?.type" size="small" class="mr4">{{ GEOFENCE_TRIGGER_MAP[r]?.label }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="triggerCount" label="今日触发" width="90" align="center" />
            <el-table-column prop="lastTrigger" label="最近触发" width="160" />
            <el-table-column label="状态" width="80" align="center">
              <template #default="{ row }">
                <el-switch :model-value="row.status === 'ACTIVE'" @change="toggleFence(row)" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" size="small">编辑</el-button>
                <el-button link type="info" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="触发记录" name="event">
        <el-card shadow="never" class="filter-card">
          <el-form :inline="true" :model="eventQuery" size="default">
            <el-form-item label="围栏">
              <el-input v-model="eventQuery.fenceName" placeholder="围栏名称" clearable style="width: 160px" @keyup.enter="loadEvents" />
            </el-form-item>
            <el-form-item label="车牌">
              <el-input v-model="eventQuery.vehicleNo" placeholder="车牌号" clearable style="width: 120px" @keyup.enter="loadEvents" />
            </el-form-item>
            <el-form-item label="触发类型">
              <el-select v-model="eventQuery.triggerType" placeholder="全部" clearable style="width: 100px">
                <el-option v-for="(v, k) in GEOFENCE_TRIGGER_MAP" :key="k" :label="v.label" :value="k" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="loadEvents"><el-icon><Search /></el-icon> 查询</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card shadow="never" class="table-card">
          <el-table :data="eventList" v-loading="loading2" border stripe size="default">
            <el-table-column label="触发类型" width="80" align="center">
              <template #default="{ row }">
                <el-tag :type="GEOFENCE_TRIGGER_MAP[row.triggerType]?.type" size="small">{{ GEOFENCE_TRIGGER_MAP[row.triggerType]?.label }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="fenceName" label="围栏名称" width="160" />
            <el-table-column prop="vehicleNo" label="车牌号" width="100" />
            <el-table-column prop="driverName" label="司机" width="80" />
            <el-table-column prop="triggerTime" label="触发时间" width="180" />
            <el-table-column label="触发时温度" width="160">
              <template #default="{ row }">
                <span v-if="row.tempAtTrigger.FROZEN" style="color: #409EFF;">冷冻: {{ row.tempAtTrigger.FROZEN }}°C</span>
                <span v-if="row.tempAtTrigger.COLD" style="color: #67C23A; margin-left: 8px;">冷藏: {{ row.tempAtTrigger.COLD }}°C</span>
              </template>
            </el-table-column>
            <el-table-column label="速度" width="70" align="center">
              <template #default="{ row }">{{ row.speedAtTrigger }} km/h</template>
            </el-table-column>
            <el-table-column prop="taskNo" label="关联任务" width="100" />
            <el-table-column prop="action" label="触发动作" min-width="200" show-overflow-tooltip />
            <el-table-column label="通知渠道" width="100">
              <template #default="{ row }">
                <el-tag size="small" effect="plain">{{ row.notified }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-wrap">
            <el-pagination v-model:current-page="eventQuery.page" v-model:page-size="eventQuery.pageSize" :total="eventTotal" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next" @size-change="loadEvents" @current-change="loadEvents" />
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getGeofenceList, getGeofenceEvents, toggleGeofenceStatus } from '@/api/monitoring'
import { GEOFENCE_TYPE_MAP, GEOFENCE_TRIGGER_MAP } from '@/utils/format'

const activeTab = ref('fence')
const loading = ref(false)
const loading2 = ref(false)

const fenceQuery = reactive({ keyword: '', type: '', status: '' })
const fenceList = ref([])

const eventQuery = reactive({ page: 1, pageSize: 20, fenceName: '', vehicleNo: '', triggerType: '' })
const eventList = ref([])
const eventTotal = ref(0)

async function loadFences() {
  loading.value = true
  try {
    const res = await getGeofenceList(fenceQuery)
    fenceList.value = res.data
  } finally {
    loading.value = false
  }
}

async function loadEvents() {
  loading2.value = true
  try {
    const res = await getGeofenceEvents(eventQuery)
    eventList.value = res.data.records
    eventTotal.value = res.data.total
  } finally {
    loading2.value = false
  }
}

function resetFenceQuery() {
  Object.assign(fenceQuery, { keyword: '', type: '', status: '' })
  loadFences()
}

async function toggleFence(row) {
  await toggleGeofenceStatus(row.id)
  ElMessage.success(`围栏已${row.status === 'ACTIVE' ? '停用' : '启用'}`)
  loadFences()
}

onMounted(() => {
  loadFences()
  loadEvents()
})
</script>

<style scoped>
.content-tabs { background: #fff; border-radius: 8px; padding: 0 16px 16px; }
.filter-card { margin-bottom: 12px; border: none; }
.filter-card :deep(.el-card__body) { padding: 16px 16px 0; }
.table-card { border: none; }
.mr4 { margin-right: 4px; }
.pagination-wrap { display: flex; justify-content: flex-end; margin-top: 16px; }
</style>
