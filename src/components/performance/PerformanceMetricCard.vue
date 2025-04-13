<script setup lang="ts">
import { computed } from 'vue'
import { formatPerformanceTime } from '../../utils'

interface Props {
  title: string
  avgValue: number
  p75Value: number
  icon?: string
  color?: string
  loading?: boolean
  threshold?: {
    good: number
    needsImprovement: number
  }
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'Timer',
  color: '#409EFF',
  loading: false,
  threshold: () => ({
    good: 1000,
    needsImprovement: 2500
  })
})

// 格式化显示值
const formatValue = (value: number) => {
  return formatPerformanceTime(value)
}

// 根据阈值判断性能状态
const getStatusColor = (value: number) => {
  if (value <= props.threshold.good) {
    return '#67C23A' // 绿色 - 良好
  } else if (value <= props.threshold.needsImprovement) {
    return '#E6A23C' // 黄色 - 需要改进
  } else {
    return '#F56C6C' // 红色 - 较差
  }
}

const avgStatusColor = computed(() => getStatusColor(props.avgValue))
const p75StatusColor = computed(() => getStatusColor(props.p75Value))
</script>

<template>
  <el-card class="metric-card" :body-style="{ padding: '15px' }">
    <div class="card-header">
      <div class="title">
        <el-icon :size="20" :color="color">
          <component :is="icon" />
        </el-icon>
        <span>{{ title }}</span>
      </div>
    </div>
    
    <div v-if="loading" class="loading-container">
      <el-skeleton animated :rows="2" />
    </div>
    
    <div v-else class="metrics-container">
      <div class="metric-item">
        <div class="metric-label">平均值</div>
        <div class="metric-value" :style="{ color: avgStatusColor }">
          {{ formatValue(avgValue) }}
        </div>
      </div>
      
      <div class="metric-item">
        <div class="metric-label">P75</div>
        <div class="metric-value" :style="{ color: p75StatusColor }">
          {{ formatValue(p75Value) }}
        </div>
      </div>
    </div>
  </el-card>
</template>

<style scoped lang="less">
.metric-card {
  height: 100%;
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
  
  .card-header {
    margin-bottom: 15px;
    
    .title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }
  }
  
  .loading-container {
    min-height: 80px;
    display: flex;
    align-items: center;
  }
  
  .metrics-container {
    display: flex;
    justify-content: space-between;
    
    .metric-item {
      text-align: center;
      flex: 1;
      
      .metric-label {
        font-size: 14px;
        color: #909399;
        margin-bottom: 5px;
      }
      
      .metric-value {
        font-size: 22px;
        font-weight: 600;
      }
    }
  }
}
</style>
