<template>
  <div class="error-page">
    <div class="error-content">
      <h1 class="error-code">404</h1>
      <p class="error-text">抱歉，您访问的页面不存在</p>
      <el-button type="primary" @click="$router.push('/dashboard')">返回首页</el-button>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.error-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--tms-bg);
}
.error-content {
  text-align: center;
}
.error-code {
  font-size: 120px;
  font-weight: 700;
  color: var(--tms-primary);
  line-height: 1;
  margin-bottom: 20px;
}
.error-text {
  font-size: 18px;
  color: var(--tms-text-secondary);
  margin-bottom: 30px;
}
</style>
