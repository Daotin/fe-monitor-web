<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { formatDate } from '../../../utils'
import { getEventDetail } from '../../../api'
import type { EventDetail } from '../../../api'

const props = defineProps<{
  visible: boolean
  errorId: string
}>()

const emit = defineEmits(['update:visible'])

// 错误详情数据
const errorDetail = ref<EventDetail | null>(null)
// 加载状态
const loading = ref(false)

// 判断是否有行为栈数据
const hasBehaviorStack = computed(() => {
  return errorDetail.value?.payload.behaviorStack && errorDetail.value.payload.behaviorStack.length > 0
})

// 获取行为栈数据，按时间倒序排列
const behaviorStack = computed(() => {
  if (!hasBehaviorStack.value || !errorDetail.value) return []
  
  return [...errorDetail.value.payload.behaviorStack].sort((a, b) => b.timestamp - a.timestamp)
})

// 关闭弹窗
const handleClose = () => {
  emit('update:visible', false)
}

// 获取错误详情数据
const fetchErrorDetail = async () => {
  if (!props.errorId) return
  
  try {
    loading.value = true
    console.log('获取错误详情数据，错误ID:', props.errorId)

    const data = await getEventDetail(props.errorId)
    errorDetail.value = data
    console.log('错误详情数据:', data)
  } catch (error) {
    console.error('获取错误详情数据失败:', error)
    ElMessage.error('获取错误详情数据失败')
  } finally {
    loading.value = false
  }
}

// 获取行为类型的图标
const getBehaviorIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    click: 'Pointer',
    input: 'Edit',
    navigation: 'Connection',
    api: 'Link',
    pageview: 'Document',
    scroll: 'Sort',
    resize: 'FullScreen',
    keypress: 'Keyboard'
  }
  
  return iconMap[type] || 'InfoFilled'
}

// 获取行为类型的标签类型
const getBehaviorTagType = (type: string) => {
  const typeMap: Record<string, string> = {
    click: 'primary',
    input: 'success',
    navigation: 'warning',
    api: 'danger',
    pageview: 'info',
    scroll: '',
    resize: '',
    keypress: 'success'
  }
  
  return typeMap[type] || ''
}

// 格式化行为时间
const formatBehaviorTime = (timestamp: number) => {
  return formatDate(new Date(timestamp), 'HH:mm:ss.SSS')
}

// 获取行为详情
const getBehaviorDetail = (behavior: any) => {
  switch (behavior.type) {
    case 'click':
      return `点击了 <${behavior.element}> 元素 "${behavior.text || '未知内容'}"`
    case 'input':
      return `在输入框中输入了内容`
    case 'navigation':
      return `从 ${behavior.from} 导航到 ${behavior.to}`
    case 'api':
      return `${behavior.method} 请求 ${behavior.url}，状态码: ${behavior.status}`
    case 'pageview':
      return `访问页面 ${behavior.url}，标题: ${behavior.title}`
    case 'scroll':
      return `滚动到位置 (${behavior.position.x}, ${behavior.position.y})`
    case 'resize':
      return `调整窗口大小`
    case 'keypress':
      return `按下键盘`
    default:
      return `${behavior.type} 行为`
  }
}

// 监听弹窗可见性变化
watch(() => props.visible, (newVal) => {
  if (newVal && props.errorId) {
    fetchErrorDetail()
  }
})
</script>

<template>
  <el-dialog
    title="用户行为栈"
    v-model="props.visible"
    width="80%"
    destroy-on-close
    @close="handleClose"
    class="behavior-stack-dialog"
  >
    <div v-loading="loading">
      <!-- 有行为栈数据 -->
      <template v-if="hasBehaviorStack">
        <div class="behavior-info">
          <el-alert
            title="用户行为栈记录了错误发生前的用户操作序列"
            type="info"
            description="通过分析用户行为，可以更好地理解错误发生的上下文和复现路径"
            show-icon
            :closable="false"
            class="behavior-info-alert"
          />
          
          <div class="behavior-count">
            <el-tag type="info" size="large">共 {{ behaviorStack.length }} 个行为记录</el-tag>
          </div>
        </div>
        
        <el-timeline class="behavior-timeline">
          <el-timeline-item
            v-for="(behavior, index) in behaviorStack"
            :key="index"
            :type="getBehaviorTagType(behavior.type)"
            :icon="getBehaviorIcon(behavior.type)"
            :timestamp="formatBehaviorTime(behavior.timestamp)"
            size="large"
          >
            <div class="behavior-item">
              <div class="behavior-type">
                <el-tag size="small" :type="getBehaviorTagType(behavior.type)">{{ behavior.type }}</el-tag>
              </div>
              <div class="behavior-detail">{{ getBehaviorDetail(behavior) }}</div>
              
              <!-- 行为详情 -->
              <div v-if="behavior.type === 'click' && behavior.position" class="behavior-extra-info">
                <div class="position-info">
                  点击位置: ({{ behavior.position.x }}, {{ behavior.position.y }})
                </div>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </template>
      
      <!-- 无行为栈数据 -->
      <template v-else-if="!loading">
        <el-empty description="暂无用户行为记录">
          <template #description>
            <p>该错误事件未包含用户行为栈数据</p>
            <p class="empty-tip">提示: 确保SDK配置中启用了behaviorStack插件，并设置了适当的记录模式</p>
          </template>
        </el-empty>
      </template>
    </div>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="less">
.behavior-stack-dialog {
  .behavior-info {
    margin-bottom: 20px;
    
    .behavior-info-alert {
      margin-bottom: 15px;
    }
    
    .behavior-count {
      display: flex;
      justify-content: flex-end;
    }
  }
  
  .behavior-timeline {
    max-height: 60vh;
    overflow-y: auto;
    padding: 0 10px;
    
    .behavior-item {
      padding: 5px 0;
      
      .behavior-type {
        margin-bottom: 5px;
      }
      
      .behavior-detail {
        font-size: 14px;
        color: #303133;
        line-height: 1.5;
        margin-bottom: 5px;
      }
      
      .behavior-extra-info {
        font-size: 12px;
        color: #909399;
        background-color: #f5f7fa;
        padding: 5px 10px;
        border-radius: 4px;
        margin-top: 5px;
      }
    }
  }
  
  .empty-tip {
    font-size: 12px;
    color: #909399;
    margin-top: 10px;
  }
  
  :deep(.el-timeline-item__timestamp) {
    font-size: 12px;
    color: #909399;
  }
  
  :deep(.el-timeline-item__node) {
    background-color: transparent;
  }
  
  :deep(.el-timeline-item__wrapper) {
    padding-left: 20px;
  }
}
</style>
