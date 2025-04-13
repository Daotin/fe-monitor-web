<script setup lang="ts">
import { computed } from 'vue';
import { formatPerformanceTime } from '../../utils';

// 定义组件属性
interface Props {
  title: string;
  value: number | string;
  icon?: string;
  color?: string;
  prefix?: string;
  suffix?: string;
  isPerformance?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'DataLine',
  color: '#409EFF',
  prefix: '',
  suffix: '',
  isPerformance: false,
  loading: false
});

// 格式化显示值
const displayValue = computed(() => {
  if (props.loading) return '-';
  
  if (props.isPerformance && typeof props.value === 'number') {
    return formatPerformanceTime(props.value);
  }
  
  return props.prefix + props.value + props.suffix;
});
</script>

<template>
  <el-card class="stat-card" shadow="hover">
    <div class="stat-card-content">
      <div class="stat-card-icon" :style="{ backgroundColor: color }">
        <el-icon>
          <component :is="icon" />
        </el-icon>
      </div>
      <div class="stat-card-info">
        <div class="stat-card-title">{{ title }}</div>
        <div class="stat-card-value">
          <el-skeleton v-if="loading" :rows="1" animated />
          <template v-else>{{ displayValue }}</template>
        </div>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.stat-card {
  height: 100%;
}

.stat-card-content {
  display: flex;
  align-items: center;
}

.stat-card-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
}

.stat-card-icon .el-icon {
  font-size: 28px;
  color: white;
}

.stat-card-info {
  flex: 1;
}

.stat-card-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-card-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}
</style>
