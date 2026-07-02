<template>
  <div class="page-container">
    <div class="tms-card">
      <div class="flex-between mb-20">
        <h2 class="font-size-20 font-bold">新建运输订单</h2>
        <el-button :icon="ArrowLeft" @click="$router.back()">返回</el-button>
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" size="default">
        <!-- 基本信息 -->
        <div class="desc-section-title">基本信息</div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="外部单号" prop="externalOrderNo">
              <el-input v-model="form.externalOrderNo" placeholder="请输入外部系统单号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="来源渠道" prop="source">
              <el-select v-model="form.source" placeholder="请选择" style="width: 100%">
                <el-option v-for="(v, k) in ORDER_SOURCE_MAP" :key="k" :label="v" :value="k" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="优先级" prop="priority">
              <el-select v-model="form.priority" placeholder="请选择" style="width: 100%">
                <el-option v-for="(v, k) in PRIORITY_MAP" :key="k" :label="v.label" :value="k" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 客户信息 -->
        <div class="desc-section-title mt-20">客户信息</div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="客户名称" prop="customerName">
              <el-input v-model="form.customerName" placeholder="请输入客户名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户编码" prop="customerCode">
              <el-input v-model="form.customerCode" placeholder="请输入客户编码" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人" prop="contactPerson">
              <el-input v-model="form.contactPerson" placeholder="请输入联系人" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input v-model="form.contactPhone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="配送城市" prop="deliveryCity">
              <el-input v-model="form.deliveryCity" placeholder="请输入配送城市" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="配送区域" prop="deliveryRegion">
              <el-select v-model="form.deliveryRegion" placeholder="请选择" style="width: 100%">
                <el-option label="华东" value="华东" />
                <el-option label="华北" value="华北" />
                <el-option label="华南" value="华南" />
                <el-option label="华中" value="华中" />
                <el-option label="西南" value="西南" />
                <el-option label="西北" value="西北" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="收货地址" prop="deliveryAddress">
              <el-input v-model="form.deliveryAddress" placeholder="请输入详细收货地址" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="要求送达起" prop="requireTimeStart">
              <el-date-picker v-model="form.requireTimeStart" type="datetime" placeholder="选择时间" style="width: 100%" value-format="YYYY-MM-DDTHH:mm:ss" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="要求送达止" prop="requireTimeEnd">
              <el-date-picker v-model="form.requireTimeEnd" type="datetime" placeholder="选择时间" style="width: 100%" value-format="YYYY-MM-DDTHH:mm:ss" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 货品明细 -->
        <div class="desc-section-title mt-20">
          <div class="flex-between">
            <span>货品明细</span>
            <el-button type="primary" size="small" @click="addItem">
              <el-icon><Plus /></el-icon> 添加货品
            </el-button>
          </div>
        </div>
        <el-table :data="form.items" border size="default" style="width: 100%">
          <el-table-column type="index" label="#" width="50" align="center" />
          <el-table-column label="货品名称" min-width="150">
            <template #default="{ row }">
              <el-input v-model="row.productName" placeholder="货品名称" size="small" />
            </template>
          </el-table-column>
          <el-table-column label="SKU编码" width="130">
            <template #default="{ row }">
              <el-input v-model="row.productCode" placeholder="SKU" size="small" />
            </template>
          </el-table-column>
          <el-table-column label="温区" width="130">
            <template #default="{ row }">
              <el-select v-model="row.tempZone" placeholder="选择" size="small" style="width: 100%">
                <el-option v-for="(v, k) in TEMP_ZONE_MAP" :key="k" :label="`${v.label} ${v.temp}`" :value="k" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="包装方式" width="120">
            <template #default="{ row }">
              <el-select v-model="row.packageType" placeholder="选择" size="small" style="width: 100%">
                <el-option label="纸箱" value="纸箱" />
                <el-option label="泡沫箱" value="泡沫箱" />
                <el-option label="真空袋" value="真空袋" />
                <el-option label="塑料筐" value="塑料筐" />
                <el-option label="保温箱" value="保温箱" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="数量" width="90">
            <template #default="{ row }">
              <el-input-number v-model="row.quantity" :min="1" size="small" controls-position="right" style="width: 80px" @change="calcItem(row)" />
            </template>
          </el-table-column>
          <el-table-column label="单位" width="80">
            <template #default="{ row }">
              <el-select v-model="row.unit" size="small" style="width: 70px">
                <el-option label="箱" value="箱" />
                <el-option label="份" value="份" />
                <el-option label="盒" value="盒" />
                <el-option label="袋" value="袋" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="单重(kg)" width="100">
            <template #default="{ row }">
              <el-input-number v-model="row.unitWeight" :min="0.01" :precision="2" size="small" controls-position="right" style="width: 90px" @change="calcItem(row)" />
            </template>
          </el-table-column>
          <el-table-column label="单价(¥)" width="100">
            <template #default="{ row }">
              <el-input-number v-model="row.unitPrice" :min="0" :precision="2" size="small" controls-position="right" style="width: 90px" @change="calcItem(row)" />
            </template>
          </el-table-column>
          <el-table-column label="金额" width="100" align="right">
            <template #default="{ row }">¥{{ row.totalPrice?.toFixed(2) || '0.00' }}</template>
          </el-table-column>
          <el-table-column label="操作" width="80" align="center">
            <template #default="{ $index }">
              <el-button type="danger" link size="small" @click="removeItem($index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 混装禁忌检查 -->
        <div v-if="mixingWarnings.length > 0" class="mt-16">
          <el-alert
            v-for="(w, i) in mixingWarnings"
            :key="i"
            :title="`混装禁忌: ${w}`"
            type="error"
            :closable="false"
            show-icon
          />
        </div>

        <!-- 汇总 -->
        <div class="summary-bar mt-20">
          <div class="summary-item">
            <span class="summary-label">货品行数:</span>
            <span class="summary-value">{{ form.items.length }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">总重量:</span>
            <span class="summary-value">{{ totalWeight }} kg</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">温区数:</span>
            <span class="summary-value">{{ tempZoneCount }}</span>
          </div>
          <div class="summary-item highlight">
            <span class="summary-label">订单金额:</span>
            <span class="summary-value">{{ formatMoney(totalAmount) }}</span>
          </div>
        </div>

        <!-- 备注 -->
        <el-form-item label="备注" class="mt-20">
          <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注信息" />
        </el-form-item>

        <!-- 操作按钮 -->
        <div class="form-actions">
          <el-button @click="$router.back()">取消</el-button>
          <el-button type="info" @click="handleSaveDraft">保存草稿</el-button>
          <el-button type="primary" @click="handleSubmit">提交订单</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Plus } from '@element-plus/icons-vue'
import { createOrder } from '@/api/order'
import {
  formatMoney,
  ORDER_SOURCE_MAP, PRIORITY_MAP, TEMP_ZONE_MAP,
  checkMixingTaboo,
} from '@/utils/format'

const router = useRouter()
const formRef = ref()

const form = reactive({
  externalOrderNo: '',
  source: 'MANUAL',
  priority: 'NORMAL',
  customerName: '',
  customerCode: '',
  contactPerson: '',
  contactPhone: '',
  deliveryCity: '',
  deliveryRegion: '',
  deliveryAddress: '',
  requireTimeStart: '',
  requireTimeEnd: '',
  remark: '',
  items: [createEmptyItem()],
})

const rules = {
  customerName: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
  deliveryAddress: [{ required: true, message: '请输入收货地址', trigger: 'blur' }],
  contactPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  source: [{ required: true, message: '请选择来源渠道', trigger: 'change' }],
  requireTimeStart: [{ required: true, message: '请选择要求送达起时间', trigger: 'change' }],
  requireTimeEnd: [{ required: true, message: '请选择要求送达止时间', trigger: 'change' }],
}

function createEmptyItem() {
  return {
    productName: '',
    productCode: '',
    tempZone: 'FROZEN',
    packageType: '纸箱',
    quantity: 1,
    unit: '箱',
    unitWeight: 1.0,
    unitVolume: 0.01,
    unitPrice: 0,
    weight: 1.0,
    volume: 0.01,
    totalPrice: 0,
    stackLimit: 5,
    specialReq: '',
  }
}

function addItem() {
  form.items.push(createEmptyItem())
}

function removeItem(index) {
  form.items.splice(index, 1)
}

function calcItem(row) {
  row.weight = parseFloat((row.quantity * row.unitWeight).toFixed(2))
  row.volume = parseFloat((row.quantity * row.unitVolume).toFixed(3))
  row.totalPrice = parseFloat((row.quantity * row.unitPrice).toFixed(2))
}

const totalWeight = computed(() => {
  return form.items.reduce((s, i) => s + (i.weight || 0), 0).toFixed(2)
})

const totalAmount = computed(() => {
  return form.items.reduce((s, i) => s + (i.totalPrice || 0), 0)
})

const tempZoneCount = computed(() => {
  return new Set(form.items.map(i => i.tempZone)).size
})

const mixingWarnings = computed(() => {
  return checkMixingTaboo(form.items)
})

async function handleSubmit() {
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    if (form.items.length === 0) {
      ElMessage.warning('请至少添加一条货品明细')
      return
    }
    if (mixingWarnings.value.length > 0) {
      ElMessage.warning('存在混装禁忌，请检查货品明细')
      return
    }
    const data = {
      ...form,
      totalWeight: parseFloat(totalWeight.value),
      totalAmount: totalAmount.value,
      tempZones: [...new Set(form.items.map(i => i.tempZone))],
      itemCount: form.items.length,
    }
    await createOrder(data)
    ElMessage.success('订单创建成功')
    router.push('/order/list')
  })
}

function handleSaveDraft() {
  ElMessage.success('草稿已保存')
}
</script>

<style scoped>
.desc-section-title {
  margin-bottom: 16px;
}
.summary-bar {
  background: var(--tms-bg);
  border-radius: 8px;
  padding: 16px 24px;
  display: flex;
  gap: 40px;
  align-items: center;
}
.summary-item {
  display: flex;
  align-items: center;
  gap: 8px;
}
.summary-label {
  font-size: 13px;
  color: var(--tms-text-secondary);
}
.summary-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--tms-text-primary);
}
.summary-item.highlight .summary-value {
  color: var(--tms-danger);
  font-size: 22px;
}
.form-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--tms-border-color);
}
</style>
