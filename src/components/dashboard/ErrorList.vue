<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { formatTimeAgo, truncateString } from '../../utils';

// 定义错误项接口
export interface ErrorItem {
  fingerprint: string;
  message: string;
  type: string;
  count: number;
  userCount: number;
  firstSeen: string;
  lastSeen: string;
  sampleEventId: string;
}

// 定义组件属性
interface Props {
  data: ErrorItem[];
  loading?: boolean;
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  title: 'Top 5 JS错误'
});

const router = useRouter();

// 跳转到错误详情页
const goToErrorDetail = (item: ErrorItem) => {
  router.push({
    name: 'ErrorDetail',
    params: { id: item.sampleEventId }
  });
};

// 计算错误类型的标签类型
const getErrorTypeTag = (type: string) => {
  const typeMap: Record<string, string> = {
    'TypeError': 'danger',
    'ReferenceError': 'warning',
    'SyntaxError': 'info',
    'RangeError': 'warning',
    'URIError': 'info'
  };
  
  return typeMap[type] || 'info';
};

// 空数据状态
const isEmpty = computed(() => !props.loading && (!props.data || props.data.length === 0));
</script>

<template>
  <el-card class="error-list" shadow="hover">
    <template #header>
      <div class="card-header">
        <span>{{ title }}</span>
        <el-button class="more-btn" text type="primary" @click="router.push('/error')">
          查看更多
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
    </template>
    
    <el-skeleton v-if="loading" :rows="5" animated />
    
    <el-empty v-else-if="isEmpty" description="暂无错误数据" />
    
    <div v-else class="error-list-content">
      <div
        v-for="(item, index) in data"
        :key="item.fingerprint"
        class="error-item"
        @click="goToErrorDetail(item)"
      >
        <div class="error-item-header">
          <el-tag :type="getErrorTypeTag(item.type)" size="small">{{ item.type }}</el-tag>
          <span class="error-count">{{ item.count }}次</span>
        </div>
        
        <div class="error-message">{{ truncateString(item.message, 80) }}</div>
        
        <div class="error-meta">
          <span>影响{{ item.userCount }}个用户</span>
          <span>最近发生: {{ formatTimeAgo(item.lastSeen) }}</span>
        </div>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.more-btn {
  padding: 0;
  font-size: 14px;
}

.error-list-content {
  max-height: 500px;
  overflow-y: auto;
}

.error-item {
  padding: 12px 0;
  border-bottom: 1px solid #EBEEF5;
  cursor: pointer;
  transition: background-color 0.3s;
}

.error-item:last-child {
  border-bottom: none;
}

.error-item:hover {
  background-color: #F5F7FA;
}

.error-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.error-count {
  font-size: 14px;
  color: #F56C6C;
  font-weight: bold;
}

.error-message {
  font-size: 14px;
  color: #303133;
  margin-bottom: 8px;
  line-height: 1.4;
}

.error-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
}
</style>
