<template>
  <div class="page-container">
    <!-- 说明 -->
    <el-alert
      title="多渠道订单接入"
      description="支持ERP、WMS、电商平台、B端客户等多渠道订单自动接入，通过标准化接口统一同步至TMS系统，转化为统一格式的运输任务单。"
      type="info"
      show-icon
      :closable="false"
      class="mb-16"
    />

    <!-- 渠道卡片 -->
    <div class="channel-grid mb-16">
      <div v-for="ch in channels" :key="ch.id" class="channel-card">
        <div class="channel-header">
          <div class="channel-icon" :style="{ background: getChannelColor(ch.code) }">
            <el-icon :size="24"><component :is="getChannelIcon(ch.code)" /></el-icon>
          </div>
          <div class="channel-info">
            <div class="channel-name">{{ ch.name }}</div>
            <div class="channel-code font-size-12 text-info">{{ ch.code }} · {{ ch.type }}</div>
          </div>
          <el-switch v-model="ch.status" :active-value="'ACTIVE'" :inactive-value="'INACTIVE'" @change="toggleChannel(ch)" />
        </div>
        <div class="channel-stats">
          <div class="channel-stat">
            <div class="stat-num">{{ ch.total }}</div>
            <div class="stat-label">累计接入</div>
          </div>
          <div class="channel-stat">
            <div class="stat-num">{{ ch.syncFreq }}</div>
            <div class="stat-label">同步频率</div>
          </div>
          <div class="channel-stat">
            <div class="stat-num font-size-13">{{ formatRelativeTime(ch.lastSync) }}</div>
            <div class="stat-label">最近同步</div>
          </div>
        </div>
        <div class="channel-footer">
          <el-tag :type="ch.status === 'ACTIVE' ? 'success' : 'info'" size="small" effect="plain">
            {{ ch.status === 'ACTIVE' ? '运行中' : '已停用' }}
          </el-tag>
          <el-button type="primary" link size="small" @click="showConfig(ch)">
            <el-icon><Setting /></el-icon> 配置
          </el-button>
        </div>
      </div>
    </div>

    <!-- 接入流程 -->
    <div class="tms-card mb-16">
      <div class="desc-section-title">订单接入流程</div>
      <div class="flow-steps">
        <div class="flow-step">
          <div class="flow-icon" style="background: #409EFF;">
            <el-icon><Download /></el-icon>
          </div>
          <div class="flow-title">1. 多渠道接入</div>
          <div class="flow-desc">ERP/WMS/电商/B端<br/>标准化API自动同步</div>
        </div>
        <div class="flow-arrow"><el-icon><ArrowRight /></el-icon></div>
        <div class="flow-step">
          <div class="flow-icon" style="background: #67C23A;">
            <el-icon><CircleCheck /></el-icon>
          </div>
          <div class="flow-title">2. 数据校验</div>
          <div class="flow-desc">温区/时效/规格<br/>核心字段标准化校验</div>
        </div>
        <div class="flow-arrow"><el-icon><ArrowRight /></el-icon></div>
        <div class="flow-step">
          <div class="flow-icon" style="background: #E6A23C;">
            <el-icon><Share /></el-icon>
          </div>
          <div class="flow-title">3. 自动分拨</div>
          <div class="flow-desc">温区/区域/时效<br/>自动分单与拆单</div>
        </div>
        <div class="flow-arrow"><el-icon><ArrowRight /></el-icon></div>
        <div class="flow-step">
          <div class="flow-icon" style="background: #F56C6C;">
            <el-icon><Connection /></el-icon>
          </div>
          <div class="flow-title">4. 协同流转</div>
          <div class="flow-desc">状态实时同步<br/>上下游全链路可追溯</div>
        </div>
      </div>
    </div>

    <!-- 接入日志 -->
    <div class="tms-card">
      <div class="flex-between mb-16">
        <div class="desc-section-title" style="margin-bottom: 0;">接入日志</div>
        <el-button @click="loadData">
          <el-icon><Refresh /></el-icon> 刷新
        </el-button>
      </div>
      <el-table :data="accessLogs" border stripe size="default">
        <el-table-column prop="time" label="时间" width="180">
          <template #default="{ row }">{{ formatDateTime(row.time) }}</template>
        </el-table-column>
        <el-table-column prop="channel" label="渠道" width="140" />
        <el-table-column prop="orderNo" label="订单号" width="200" />
        <el-table-column prop="customer" label="客户" min-width="160" show-overflow-tooltip />
        <el-table-column label="结果" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.success ? 'success' : 'danger'" size="small">
              {{ row.success ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="msg" label="说明" min-width="200" show-overflow-tooltip />
      </el-table>
    </div>

    <!-- 配置对话框 -->
    <el-dialog v-model="configVisible" title="渠道配置" width="560px">
      <el-form :model="configForm" label-width="120px" size="default">
        <el-form-item label="渠道名称">
          <el-input v-model="configForm.name" disabled />
        </el-form-item>
        <el-form-item label="接口地址">
          <el-input v-model="configForm.apiUrl" placeholder="https://..." />
        </el-form-item>
        <el-form-item label="认证方式">
          <el-select v-model="configForm.authType" style="width: 100%">
            <el-option label="API Key" value="API_KEY" />
            <el-option label="OAuth2" value="OAUTH2" />
            <el-option label="Basic Auth" value="BASIC" />
            <el-option label="签名认证" value="SIGNATURE" />
          </el-select>
        </el-form-item>
        <el-form-item label="同步频率">
          <el-select v-model="configForm.syncFreq" style="width: 100%">
            <el-option label="实时" value="实时" />
            <el-option label="每5分钟" value="每5分钟" />
            <el-option label="每小时" value="每小时" />
            <el-option label="手动" value="手动" />
          </el-select>
        </el-form-item>
        <el-form-item label="数据加密">
          <el-switch v-model="configForm.encrypt" />
          <span class="font-size-12 text-info ml-12">API接口签名加密传输</span>
        </el-form-item>
        <el-form-item label="幂等校验">
          <el-switch v-model="configForm.idempotent" />
          <span class="font-size-12 text-info ml-12">订单数据幂等校验机制</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="configVisible = false">取消</el-button>
        <el-button type="primary" @click="saveConfig">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  OfficeBuilding, Box, ShoppingCart, User, Connection,
  Setting, Download, CircleCheck, Share, ArrowRight, Refresh,
} from '@element-plus/icons-vue'
import { getChannels } from '@/api/order'
import { formatDateTime } from '@/utils/format'

const channels = ref([])
const configVisible = ref(false)
const configForm = reactive({})
const accessLogs = ref([])

function getChannelIcon(code) {
  const map = {
    ERP: 'OfficeBuilding',
    WMS: 'Box',
    ECOMMERCE: 'ShoppingCart',
    B2B: 'User',
    EDI: 'Connection',
  }
  return map[code] || 'Connection'
}

function getChannelColor(code) {
  const map = {
    ERP: '#409EFF',
    WMS: '#67C23A',
    ECOMMERCE: '#E6A23C',
    B2B: '#F56C6C',
    EDI: '#909399',
  }
  return map[code] || '#409EFF'
}

function formatRelativeTime(time) {
  if (!time) return '-'
  const diff = Date.now() - new Date(time).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}小时前`
  return `${Math.floor(hours / 24)}天前`
}

function toggleChannel(ch) {
  ElMessage.success(`${ch.name} 已${ch.status === 'ACTIVE' ? '启用' : '停用'}`)
}

function showConfig(ch) {
  Object.assign(configForm, {
    name: ch.name,
    apiUrl: `https://api.tms.com/${ch.code.toLowerCase()}/orders`,
    authType: 'API_KEY',
    syncFreq: ch.syncFreq,
    encrypt: true,
    idempotent: true,
  })
  configVisible.value = true
}

function saveConfig() {
  ElMessage.success('配置已保存')
  configVisible.value = false
}

function genLogs() {
  const channelNames = { ERP: 'ERP系统', WMS: 'WMS系统', ECOMMERCE: '电商平台', B2B: 'B端客户', EDI: 'EDI接入' }
  const customers = ['海底捞中央厨房', '盒马鲜生华东仓', '美团优选上海站', '叮咚买菜前置仓', '永辉超市物流中心']
  const logs = []
  for (let i = 0; i < 15; i++) {
    const ch = Object.keys(channelNames)[Math.floor(Math.random() * 5)]
    logs.push({
      time: new Date(Date.now() - i * rand(3, 15) * 60000).toISOString(),
      channel: channelNames[ch],
      orderNo: `TMS20260630${rand(100000, 999999)}`,
      customer: customers[Math.floor(Math.random() * customers.length)],
      success: Math.random() > 0.1,
      msg: Math.random() > 0.1 ? '订单数据校验通过，已转化为运输任务单' : '温区字段缺失，已标记异常待人工处理',
    })
  }
  return logs
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

async function loadData() {
  const res = await getChannels()
  channels.value = res.data
  accessLogs.value = genLogs()
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.channel-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.channel-card {
  background: #fff;
  border-radius: var(--tms-radius);
  box-shadow: var(--tms-shadow);
  padding: 20px;
}
.channel-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.channel-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}
.channel-info {
  flex: 1;
}
.channel-name {
  font-size: 16px;
  font-weight: 600;
}
.channel-stats {
  display: flex;
  justify-content: space-around;
  padding: 12px 0;
  border-top: 1px solid var(--tms-border-color);
  border-bottom: 1px solid var(--tms-border-color);
  margin-bottom: 12px;
}
.channel-stat {
  text-align: center;
}
.stat-num {
  font-size: 18px;
  font-weight: 700;
  color: var(--tms-text-primary);
}
.stat-label {
  font-size: 12px;
  color: var(--tms-text-secondary);
  margin-top: 4px;
}
.channel-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Flow Steps */
.flow-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.flow-step {
  text-align: center;
  min-width: 160px;
}
.flow-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px;
  margin: 0 auto 12px;
}
.flow-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}
.flow-desc {
  font-size: 12px;
  color: var(--tms-text-secondary);
  line-height: 1.5;
}
.flow-arrow {
  color: var(--tms-text-secondary);
  font-size: 20px;
}
.ml-12 {
  margin-left: 12px;
}
</style>
