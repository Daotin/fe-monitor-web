<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const errorId = ref(route.params.id as string);

onMounted(() => {
  console.log('Error Detail页面已挂载');
  console.log('错误ID:', errorId.value);
});
</script>

<template>
  <div class="error-detail-container">
    <h1>错误详情</h1>
    <p>错误ID: {{ errorId }}</p>
    <p>这里将展示错误的详细信息，包括SourceMap还原、用户行为栈和会话录屏回放</p>
  </div>
</template>

<style scoped>
.error-detail-container {
  padding: 20px;
}
</style>
