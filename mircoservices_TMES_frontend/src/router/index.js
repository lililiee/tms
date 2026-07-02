import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', hidden: true },
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '数据看板', icon: 'DataBoard' },
      },
    ],
  },
  {
    path: '/order',
    component: () => import('@/layout/index.vue'),
    redirect: '/order/list',
    meta: { title: '订单管理', icon: 'Document' },
    children: [
      {
        path: 'list',
        name: 'OrderList',
        component: () => import('@/views/order/list.vue'),
        meta: { title: '订单列表', icon: 'List' },
      },
      {
        path: 'create',
        name: 'OrderCreate',
        component: () => import('@/views/order/create.vue'),
        meta: { title: '新建订单', icon: 'EditPen', hidden: false },
      },
      {
        path: 'detail/:id',
        name: 'OrderDetail',
        component: () => import('@/views/order/detail.vue'),
        meta: { title: '订单详情', hidden: true },
      },
      {
        path: 'dispatch',
        name: 'OrderDispatch',
        component: () => import('@/views/order/dispatch.vue'),
        meta: { title: '自动分单', icon: 'Share' },
      },
      {
        path: 'tracking',
        name: 'OrderTracking',
        component: () => import('@/views/order/tracking.vue'),
        meta: { title: '订单追踪', icon: 'Position' },
      },
      {
        path: 'channel',
        name: 'OrderChannel',
        component: () => import('@/views/order/channel.vue'),
        meta: { title: '渠道接入', icon: 'Connection' },
      },
    ],
  },
  {
    path: '/dispatch',
    component: () => import('@/layout/index.vue'),
    redirect: '/dispatch/vehicle',
    meta: { title: '智能调度', icon: 'SetUp' },
    children: [
      {
        path: 'vehicle',
        name: 'DispatchVehicle',
        component: () => import('@/views/dispatch/vehicle.vue'),
        meta: { title: '运力资源管理', icon: 'Van' },
      },
      {
        path: 'loading',
        name: 'DispatchLoading',
        component: () => import('@/views/dispatch/loading.vue'),
        meta: { title: 'AI智能配载', icon: 'Box' },
      },
      {
        path: 'routing',
        name: 'DispatchRouting',
        component: () => import('@/views/dispatch/routing.vue'),
        meta: { title: 'AI路径规划', icon: 'MapLocation' },
      },
      {
        path: 'dynamic',
        name: 'DispatchDynamic',
        component: () => import('@/views/dispatch/dynamic.vue'),
        meta: { title: '实时动态调度', icon: 'RefreshRight' },
      },
      {
        path: 'collaboration',
        name: 'DispatchCollaboration',
        component: () => import('@/views/dispatch/collaboration.vue'),
        meta: { title: '调度任务协同', icon: 'Connection' },
      },
    ],
  },
  {
    path: '/monitoring',
    component: () => import('@/layout/index.vue'),
    redirect: '/monitoring/tracking',
    meta: { title: '在途监控', icon: 'Monitor' },
    children: [
      {
        path: 'tracking',
        name: 'MonitoringTracking',
        component: () => import('@/views/monitoring/tracking.vue'),
        meta: { title: '车辆货物追踪', icon: 'Position' },
      },
      {
        path: 'geofence',
        name: 'MonitoringGeofence',
        component: () => import('@/views/monitoring/geofence.vue'),
        meta: { title: '电子围栏', icon: 'Place' },
      },
      {
        path: 'alert',
        name: 'MonitoringAlert',
        component: () => import('@/views/monitoring/alert.vue'),
        meta: { title: 'AI异常预警', icon: 'WarningFilled' },
      },
      {
        path: 'emergency',
        name: 'MonitoringEmergency',
        component: () => import('@/views/monitoring/emergency.vue'),
        meta: { title: '在途异常处置', icon: 'FirstAidKit' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '404', hidden: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || '首页'} - 预制菜TMS`
  const token = localStorage.getItem('tms_token')
  if (to.path === '/login') {
    next()
  } else if (!token) {
    next('/login')
  } else {
    next()
  }
})

export default router
