<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAppStore } from '../../store/app';

const appStore = useAppStore();

onMounted(() => {
  console.log('Performance页面已挂载');
  console.log('当前应用ID:', appStore.appId);
  console.log('当前时间范围:', appStore.timeRange);
  console.log('开始时间:', appStore.startTime);
  console.log('结束时间:', appStore.endTime);
});
</script>

<template>
  <div class="performance-container">
    <h1>性能概览</h1>
    <p>这里将展示核心Web Vitals指标、慢页面列表和资源加载错误列表</p>
  </div>
</template>

<style scoped>
.performance-container {
  padding: 20px;
}
</style>
