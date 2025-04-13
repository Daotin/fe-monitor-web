<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAppStore } from '../../store/app';

const appStore = useAppStore();

onMounted(() => {
  console.log('Error页面已挂载');
  console.log('当前应用ID:', appStore.appId);
  console.log('当前时间范围:', appStore.timeRange);
  console.log('开始时间:', appStore.startTime);
  console.log('结束时间:', appStore.endTime);
});
</script>

<template>
  <div class="error-container">
    <h1>错误监控</h1>
    <p>这里将展示聚合后的JS错误列表</p>
  </div>
</template>

<style scoped>
.error-container {
  padding: 20px;
}
</style>
