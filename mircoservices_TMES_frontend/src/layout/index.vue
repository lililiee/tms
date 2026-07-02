<template>
  <div class="app-layout">
    <!-- 侧边栏 -->
    <aside class="app-sidebar" :class="{ collapsed: isCollapsed }">
      <div class="sidebar-logo">
        <img src="/favicon.svg" alt="logo" class="logo-img" />
        <span v-show="!isCollapsed" class="logo-text">预制菜TMS</span>
      </div>
      <el-scrollbar class="sidebar-menu-wrap">
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapsed"
          :unique-opened="true"
          background-color="#001529"
          text-color="rgba(255,255,255,0.7)"
          active-text-color="#fff"
          router
        >
          <el-menu-item index="/dashboard">
            <el-icon><DataBoard /></el-icon>
            <span>数据看板</span>
          </el-menu-item>

          <el-sub-menu index="/order">
            <template #title>
              <el-icon><Document /></el-icon>
              <span>订单管理</span>
            </template>
            <el-menu-item index="/order/list">
              <el-icon><List /></el-icon>
              <span>订单列表</span>
            </el-menu-item>
            <el-menu-item index="/order/create">
              <el-icon><EditPen /></el-icon>
              <span>新建订单</span>
            </el-menu-item>
            <el-menu-item index="/order/dispatch">
              <el-icon><Share /></el-icon>
              <span>自动分单</span>
            </el-menu-item>
            <el-menu-item index="/order/tracking">
              <el-icon><Position /></el-icon>
              <span>订单追踪</span>
            </el-menu-item>
            <el-menu-item index="/order/channel">
              <el-icon><Connection /></el-icon>
              <span>渠道接入</span>
            </el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="/dispatch">
            <template #title>
              <el-icon><SetUp /></el-icon>
              <span>智能调度</span>
            </template>
            <el-menu-item index="/dispatch/vehicle">
              <el-icon><Van /></el-icon>
              <span>运力资源管理</span>
            </el-menu-item>
            <el-menu-item index="/dispatch/loading">
              <el-icon><Box /></el-icon>
              <span>AI智能配载</span>
            </el-menu-item>
            <el-menu-item index="/dispatch/routing">
              <el-icon><MapLocation /></el-icon>
              <span>AI路径规划</span>
            </el-menu-item>
            <el-menu-item index="/dispatch/dynamic">
              <el-icon><RefreshRight /></el-icon>
              <span>实时动态调度</span>
            </el-menu-item>
            <el-menu-item index="/dispatch/collaboration">
              <el-icon><Connection /></el-icon>
              <span>调度任务协同</span>
            </el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="/monitoring">
            <template #title>
              <el-icon><Monitor /></el-icon>
              <span>在途监控</span>
            </template>
            <el-menu-item index="/monitoring/tracking">
              <el-icon><Position /></el-icon>
              <span>车辆货物追踪</span>
            </el-menu-item>
            <el-menu-item index="/monitoring/geofence">
              <el-icon><Place /></el-icon>
              <span>电子围栏</span>
            </el-menu-item>
            <el-menu-item index="/monitoring/alert">
              <el-icon><WarningFilled /></el-icon>
              <span>AI异常预警</span>
            </el-menu-item>
            <el-menu-item index="/monitoring/emergency">
              <el-icon><FirstAidKit /></el-icon>
              <span>在途异常处置</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>
    </aside>

    <!-- 主区域 -->
    <div class="app-main">
      <!-- 顶部栏 -->
      <header class="app-header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="toggleCollapse">
            <Fold v-if="!isCollapsed" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentRoute.meta.title">{{ currentRoute.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-tooltip content="全屏" placement="bottom">
            <el-icon class="header-icon" @click="toggleFullscreen"><FullScreen /></el-icon>
          </el-tooltip>
          <el-tooltip content="消息通知" placement="bottom">
            <el-badge :value="3" class="header-badge">
              <el-icon class="header-icon"><Bell /></el-icon>
            </el-badge>
          </el-tooltip>
          <el-dropdown @command="handleCommand">
            <div class="user-info">
              <el-avatar :size="32" class="user-avatar">调</el-avatar>
              <span class="user-name">调度管理员</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon> 个人中心
                </el-dropdown-item>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon> 系统设置
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon> 退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <!-- 内容区 -->
      <main class="app-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const isCollapsed = ref(false)
const currentRoute = computed(() => route)

const activeMenu = computed(() => route.path)

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

function handleCommand(cmd) {
  if (cmd === 'logout') {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      userStore.logout()
      ElMessage.success('已退出登录')
      router.push('/login')
    }).catch(() => {})
  } else if (cmd === 'profile') {
    ElMessage.info('个人中心功能开发中')
  } else if (cmd === 'settings') {
    ElMessage.info('系统设置功能开发中')
  }
}
</script>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* ===== Sidebar ===== */
.app-sidebar {
  width: var(--tms-sidebar-width);
  background: var(--tms-sidebar-bg);
  transition: width 0.3s;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}
.app-sidebar.collapsed {
  width: var(--tms-sidebar-collapsed-width);
}
.sidebar-logo {
  height: var(--tms-header-height);
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}
.logo-img {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}
.logo-text {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
}
.sidebar-menu-wrap {
  flex: 1;
  overflow-x: hidden;
}
:deep(.el-menu) {
  border-right: none;
}
:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background-color: var(--tms-sidebar-hover) !important;
}
:deep(.el-menu-item.is-active) {
  background-color: var(--tms-sidebar-active) !important;
}

/* ===== Main Area ===== */
.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ===== Header ===== */
.app-header {
  height: var(--tms-header-height);
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
  z-index: 10;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  color: var(--tms-text-regular);
  transition: color 0.2s;
}
.collapse-btn:hover {
  color: var(--tms-primary);
}
.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}
.header-icon {
  font-size: 18px;
  cursor: pointer;
  color: var(--tms-text-regular);
  transition: color 0.2s;
}
.header-icon:hover {
  color: var(--tms-primary);
}
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.user-avatar {
  background: var(--tms-primary);
  color: #fff;
  font-size: 13px;
}
.user-name {
  font-size: 14px;
  color: var(--tms-text-primary);
}

/* ===== Content ===== */
.app-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--tms-bg);
}
</style>
