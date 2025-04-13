<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAppStore } from '../../store/app';

const appStore = useAppStore();

onMounted(() => {
  console.log('Sourcemap页面已挂载');
  console.log('当前应用ID:', appStore.appId);
});
</script>

<template>
  <div class="sourcemap-container">
    <h1>SourceMap管理</h1>
    <p>这里将提供SourceMap文件上传功能</p>
  </div>
</template>

<style scoped>
.sourcemap-container {
  padding: 20px;
}
</style>
