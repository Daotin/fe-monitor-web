<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ResourceError } from '../../api'
import { formatDate } from '../../utils'

interface Props {
  data: ResourceError[]
  loading: boolean
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  loading: false
})

// 格式化URL显示
const formatUrl = (url: string) => {
  // 如果URL过长，截断显示
  const maxLength = 40
  if (url.length > maxLength) {
    return url.substring(0, maxLength) + '...'
  }
  return url
}

// 格式化时间显示
const formatTime = (timestamp: string) => {
  return formatDate(new Date(timestamp), 'YYYY-MM-DD HH:mm:ss')
}

// 获取标签类型的图标
const getTagIcon = (tagName: string) => {
  const iconMap: Record<string, string> = {
    'script': 'Document',
    'link': 'Link',
    'img': 'Picture',
    'video': 'VideoPlay',
    'audio': 'Headset',
    'iframe': 'Monitor'
  }
  
  return iconMap[tagName.toLowerCase()] || 'Document'
}

// 获取错误类型的标签类型
const getErrorTypeTag = (type: string) => {
  if (type.includes('404')) return 'danger'
  if (type.includes('ERR_CONNECTION')) return 'warning'
  if (type.includes('TIMEOUT')) return 'warning'
  if (type.includes('CERT')) return 'info'
  return 'info'
}
</script>

<template>
  <el-card class="resource-errors-card">
    <template #header>
      <div class="card-header">
        <span class="title">资源加载错误</span>
      </div>
    </template>
    
    <div v-if="loading" class="loading-container">
      <el-skeleton animated :rows="5" />
    </div>
    
    <div v-else-if="data.length === 0" class="empty-container">
      <el-empty description="暂无数据" :image-size="80" />
    </div>
    
    <el-table v-else :data="data" style="width: 100%" size="large">
      <el-table-column label="资源类型" width="80">
        <template #default="{ row }">
          <el-tooltip :content="row.tagName" placement="top">
            <el-icon :size="20">
              <component :is="getTagIcon(row.tagName)" />
            </el-icon>
          </el-tooltip>
        </template>
      </el-table-column>
      
      <el-table-column label="资源URL" min-width="200">
        <template #default="{ row }">
          <el-tooltip :content="row.url" placement="top" :show-after="500">
            <span class="url-text">{{ formatUrl(row.url) }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      
      <el-table-column label="错误类型" min-width="180">
        <template #default="{ row }">
          <el-tag :type="getErrorTypeTag(row.type)" size="small">
            {{ row.type }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column label="状态码" width="100" align="center">
        <template #default="{ row }">
          <span v-if="row.status">{{ row.status }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      
      <el-table-column label="发生时间" min-width="180">
        <template #default="{ row }">
          {{ formatTime(row.timestamp) }}
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<style scoped lang="less">
.resource-errors-card {
  height: 100%;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .title {
      font-size: 16px;
      font-weight: 600;
    }
  }
  
  .loading-container, .empty-container {
    min-height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .url-text {
    display: inline-block;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
