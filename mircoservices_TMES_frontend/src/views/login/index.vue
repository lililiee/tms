<template>
  <div class="login-container">
    <div class="login-bg">
      <div class="bg-circle bg-circle-1"></div>
      <div class="bg-circle bg-circle-2"></div>
      <div class="bg-circle bg-circle-3"></div>
    </div>
    <div class="login-box">
      <div class="login-left">
        <div class="login-brand">
          <img src="/favicon.svg" alt="logo" class="brand-logo" />
          <h1 class="brand-title">预制菜TMS</h1>
          <p class="brand-subtitle">运输管理系统 · 订单管理服务(OMS)</p>
        </div>
        <div class="login-features">
          <div class="feature-item">
            <el-icon class="feature-icon"><Connection /></el-icon>
            <span>多渠道订单统一归集</span>
          </div>
          <div class="feature-item">
            <el-icon class="feature-icon"><Share /></el-icon>
            <span>AI智能分单与拆单</span>
          </div>
          <div class="feature-item">
            <el-icon class="feature-icon"><Position /></el-icon>
            <span>全链路订单协同追踪</span>
          </div>
          <div class="feature-item">
            <el-icon class="feature-icon"><DataAnalysis /></el-icon>
            <span>业财一体化数据分析</span>
          </div>
        </div>
      </div>
      <div class="login-right">
        <h2 class="login-title">欢迎登录</h2>
        <p class="login-desc">请输入您的账号信息</p>
        <el-form ref="formRef" :model="form" :rules="rules" size="large" @submit.prevent="handleLogin">
          <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名" :prefix-icon="User" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="form.password" type="password" placeholder="请输入密码" :prefix-icon="Lock" show-password />
          </el-form-item>
          <div class="login-options">
            <el-checkbox v-model="form.remember">记住密码</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
          <el-button type="primary" class="login-btn" :loading="loading" @click="handleLogin">
            登 录
          </el-button>
        </el-form>
        <div class="login-tip">
          <el-icon><InfoFilled /></el-icon>
          <span>演示账号: admin / 123456</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, InfoFilled } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref()
const loading = ref(false)

const form = reactive({
  username: 'admin',
  password: '123456',
  remember: true,
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function handleLogin() {
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    setTimeout(() => {
      userStore.login({
        token: 'mock_token_' + Date.now(),
        username: form.username,
        role: 'dispatcher',
        name: '调度管理员',
      })
      ElMessage.success('登录成功')
      router.push('/dashboard')
      loading.value = false
    }, 800)
  })
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

/* 背景装饰 */
.login-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.bg-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
}
.bg-circle-1 {
  width: 500px;
  height: 500px;
  background: #fff;
  top: -200px;
  right: -100px;
}
.bg-circle-2 {
  width: 400px;
  height: 400px;
  background: #409EFF;
  bottom: -150px;
  left: -100px;
}
.bg-circle-3 {
  width: 300px;
  height: 300px;
  background: #67C23A;
  top: 50%;
  left: 60%;
}

.login-box {
  width: 880px;
  height: 520px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  overflow: hidden;
  z-index: 1;
}

/* 左侧品牌区 */
.login-left {
  width: 440px;
  background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
  padding: 48px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #fff;
}
.login-brand {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.brand-logo {
  width: 48px;
  height: 48px;
}
.brand-title {
  font-size: 28px;
  font-weight: 700;
}
.brand-subtitle {
  font-size: 14px;
  opacity: 0.7;
}
.login-features {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  opacity: 0.9;
}
.feature-icon {
  font-size: 20px;
  color: #64b5f6;
}

/* 右侧表单区 */
.login-right {
  flex: 1;
  padding: 60px 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.login-title {
  font-size: 26px;
  font-weight: 700;
  color: var(--tms-text-primary);
  margin-bottom: 8px;
}
.login-desc {
  font-size: 14px;
  color: var(--tms-text-secondary);
  margin-bottom: 32px;
}
.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.login-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
}
.login-tip {
  margin-top: 24px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--tms-text-secondary);
  justify-content: center;
}
</style>
