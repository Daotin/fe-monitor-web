<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { Fold, Expand } from '@element-plus/icons-vue';
import { useAppStore, TimeRange } from '../../store/app';
import TimeRangeSelector from '../common/TimeRangeSelector.vue';

// 定义事件
const emit = defineEmits(['toggle-sidebar']);

const route = useRoute();
const appStore = useAppStore();

// 侧边栏折叠状态
const isCollapse = ref(false);

// 切换侧边栏折叠状态
const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value;
  emit('toggle-sidebar');
};

// 获取当前页面标题
const pageTitle = computed(() => {
  return route.meta.title || '前端监控数据大屏';
});

// 设置时间范围
const handleTimeRangeChange = (timeRange: TimeRange) => {
  appStore.setTimeRange(timeRange);
};
</script>

<template>
  <div class="header-container">
    <!-- 左侧区域 -->
    <div class="header-left">
      <!-- 折叠按钮 -->
      <div class="fold-btn" @click="toggleSidebar">
        <el-icon v-if="isCollapse"><Expand /></el-icon>
        <el-icon v-else><Fold /></el-icon>
      </div>
      
      <!-- 页面标题 -->
      <h2 class="page-title">{{ pageTitle }}</h2>
    </div>
    
    <!-- 中间区域 - 时间范围选择器 -->
    <div class="header-center">
      <TimeRangeSelector @change="handleTimeRangeChange" />
    </div>
    
    <!-- 右侧区域 -->
    <div class="header-right">
      <!-- 应用ID显示 -->
      <div class="app-id">
        <span>应用ID: {{ appStore.appId }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-container {
  height: 60px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

.fold-btn {
  font-size: 20px;
  cursor: pointer;
  margin-right: 15px;
  color: #606266;
}

.page-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.header-right {
  display: flex;
  align-items: center;
}

.app-id {
  margin-left: 15px;
  font-size: 14px;
  color: #606266;
}
</style>
