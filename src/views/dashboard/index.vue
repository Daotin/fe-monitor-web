<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAppStore } from '../../store/app';

const appStore = useAppStore();

onMounted(() => {
  console.log('Dashboard页面已挂载');
  console.log('当前应用ID:', appStore.appId);
  console.log('当前时间范围:', appStore.timeRange);
  console.log('开始时间:', appStore.startTime);
  console.log('结束时间:', appStore.endTime);
});
</script>

<template>
  <div class="dashboard-container">
    <h1>概览页</h1>
    <p>这里将展示应用的核心指标和错误趋势</p>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 20px;
}
</style>
