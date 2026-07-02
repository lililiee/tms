import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getOrderList, getOrderDetail, createOrder, dispatchOrders, splitOrder } from '@/api/order'

export const useOrderStore = defineStore('order', () => {
  const list = ref([])
  const total = ref(0)
  const loading = ref(false)
  const currentOrder = ref(null)

  // 统计数据
  const stats = computed(() => {
    const pending = list.value.filter(o => o.status === 'PENDING').length
    const processing = list.value.filter(o => o.status === 'PROCESSING').length
    const dispatched = list.value.filter(o => o.status === 'DISPATCHED').length
    const completed = list.value.filter(o => o.status === 'COMPLETED').length
    return { pending, processing, dispatched, completed, total: total.value }
  })

  async function fetchList(params) {
    loading.value = true
    try {
      const res = await getOrderList(params)
      list.value = res.data.records
      total.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  async function fetchDetail(id) {
    const res = await getOrderDetail(id)
    currentOrder.value = res.data
    return res.data
  }

  async function addOrder(data) {
    return await createOrder(data)
  }

  async function dispatch(data) {
    return await dispatchOrders(data)
  }

  async function split(id) {
    return await splitOrder(id)
  }

  return { list, total, loading, currentOrder, stats, fetchList, fetchDetail, addOrder, dispatch, split }
})
