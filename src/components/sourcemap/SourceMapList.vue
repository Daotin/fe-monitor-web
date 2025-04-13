<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { deleteSourceMap } from '../../api'
import type { SourceMapFile } from '../../api'

interface Props {
  data: SourceMapFile[]
  loading: boolean
  onDelete?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  loading: false
})

// 删除中的文件ID
const deletingId = ref<string | null>(null)

// 格式化文件大小
const formatFileSize = (size: number): string => {
  if (size < 1024) {
    return size + ' B'
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + ' KB'
  } else if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + ' MB'
  } else {
    return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
  }
}

// 处理删除文件
const handleDelete = async (file: SourceMapFile) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除文件 ${file.fileName} 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    deletingId.value = file.id
    console.log('删除文件:', file.id, file.fileName)
    
    const response = await deleteSourceMap(file.id)
    console.log('删除结果:', response)
    
    if (response.success) {
      ElMessage.success('文件删除成功')
      
      // 调用删除成功回调
      if (props.onDelete) {
        props.onDelete()
      }
    } else {
      ElMessage.error('文件删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除文件失败:', error)
      ElMessage.error('删除文件失败，请重试')
    }
  } finally {
    deletingId.value = null
  }
}

// 获取状态标签类型
const getStatusType = (status: string): '' | 'success' | 'warning' | 'info' | 'danger' => {
  switch (status) {
    case 'active':
      return 'success'
    case 'inactive':
      return 'info'
    default:
      return ''
  }
}

// 获取状态标签文本
const getStatusText = (status: string): string => {
  switch (status) {
    case 'active':
      return '活跃'
    case 'inactive':
      return '未使用'
    default:
      return status
  }
}
</script>

<template>
  <el-card class="sourcemap-list">
    <template #header>
      <div class="card-header">
        <span class="title">已上传的SourceMap文件</span>
      </div>
    </template>
    
    <div v-if="loading" class="loading-container">
      <el-skeleton animated :rows="5" />
    </div>
    
    <div v-else-if="data.length === 0" class="empty-container">
      <el-empty description="暂无上传的SourceMap文件" :image-size="80" />
    </div>
    
    <el-table v-else :data="data" style="width: 100%" size="large">
      <el-table-column label="文件名" min-width="200" show-overflow-tooltip>
        <template #default="{ row }">
          <div class="file-name">
            <el-icon><Document /></el-icon>
            <span>{{ row.fileName }}</span>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column label="原始文件" min-width="180" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.originalFileName }}
        </template>
      </el-table-column>
      
      <el-table-column label="版本" width="100">
        <template #default="{ row }">
          {{ row.version }}
        </template>
      </el-table-column>
      
      <el-table-column label="大小" width="100">
        <template #default="{ row }">
          {{ formatFileSize(row.size) }}
        </template>
      </el-table-column>
      
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)" size="small">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column label="上传时间" min-width="180">
        <template #default="{ row }">
          {{ row.uploadTime }}
        </template>
      </el-table-column>
      
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="{ row }">
          <el-button
            type="danger"
            size="small"
            :loading="deletingId === row.id"
            @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<style scoped lang="less">
.sourcemap-list {
  .card-header {
    .title {
      font-size: 16px;
      font-weight: 600;
    }
  }
  
  .loading-container,
  .empty-container {
    min-height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .file-name {
    display: flex;
    align-items: center;
    gap: 5px;
  }
}
</style>
