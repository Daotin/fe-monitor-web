<template>
	<el-dialog
		title="用户行为记录"
		v-model="dialogVisible"
		width="80%"
		destroy-on-close
		@close="handleClose"
		class="behavior-stack-dialog">
		<div v-loading="loading">
			<!-- 有行为数据 -->
			<template v-if="hasBehaviorData">
				<div class="behavior-header">
					<div class="stack-info">
						<p>行为栈ID: {{ props.error.stackId }}</p>
						<p>关联错误ID: {{ props.error.errorId }}</p>
						<p>行为数量: {{ props.error.count }}</p>
					</div>
				</div>
				<el-timeline>
					<el-timeline-item
						v-for="(action, index) in behaviorData"
						:key="index"
						:type="getBehaviorTagType(action.subType)"
						:icon="getBehaviorIcon(action.subType)"
						:timestamp="formatBehaviorTime(action.timestamp)"
						size="large">
						<div class="behavior-item">
							<div class="behavior-type">
								<el-tag size="small" :type="getBehaviorTagType(action.subType)">{{ action.subType }}</el-tag>
							</div>
							<div class="behavior-detail">{{ getBehaviorDetail(action) }}</div>
						</div>
					</el-timeline-item>
				</el-timeline>
			</template>

			<!-- 无行为数据或格式不匹配 -->
			<template v-else-if="!loading">
				<el-empty description="暂无用户行为记录">
					<template #description>
						<p>{{ emptyMessage }}</p>
						<p class="empty-tip">提示: 确保传入正确格式的用户行为栈数据</p>
					</template>
				</el-empty>
			</template>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Calendar, Mouse, Link, Document, Operation, Pointer, Refresh, Edit } from '@element-plus/icons-vue'

const props = defineProps({
	visible: {
		type: Boolean,
		default: false,
	},
	error: {
		type: Object,
		default: () => ({}),
	},
})

const emit = defineEmits(['update:visible'])

// 对话框可见性
const dialogVisible = computed({
	get: () => props.visible,
	set: value => emit('update:visible', value),
})

// 加载状态
const loading = ref(false)

// 空数据提示信息
const emptyMessage = computed(() => {
	if (!props.error || Object.keys(props.error).length === 0) {
		return '未传入行为栈数据'
	}

	if (props.error.type !== 'behavior' || props.error.subType !== 'stack') {
		return '数据格式不匹配，需要behavior.stack类型的行为栈数据'
	}

	if (!props.error.actions || !Array.isArray(props.error.actions) || props.error.actions.length === 0) {
		return '行为栈中不包含任何行为记录'
	}

	return '暂无用户行为记录'
})

// 是否有行为数据
const hasBehaviorData = computed(() => {
	console.log('接收到的数据:', props.error)

	// 格式验证：必须是behavior.stack类型，且包含actions数组
	return (
		props.error &&
		props.error.type === 'behavior' &&
		props.error.subType === 'stack' &&
		props.error.actions &&
		Array.isArray(props.error.actions) &&
		props.error.actions.length > 0
	)
})

// 行为数据，按时间正序排列（从早到晚）
const behaviorData = computed(() => {
	if (!hasBehaviorData.value) return []

	// 复制数组并排序
	const actions = [...props.error.actions]
	console.log('处理行为数据，数量:', actions.length)

	return actions.sort((a, b) => a.timestamp - b.timestamp)
})

// 获取行为类型对应的标签类型
const getBehaviorTagType = (subType: string) => {
	const typeMap: Record<string, string> = {
		click: 'primary',
		input: 'success',
		pageChange: 'warning',
		navigation: 'warning',
		api: 'danger',
		pageview: 'info',
		scroll: '',
		resize: '',
		keypress: 'success',
		error: 'danger',
	}

	return typeMap[subType] || ''
}

// 获取行为类型对应的图标
const getBehaviorIcon = (subType: string) => {
	const iconMap: Record<string, any> = {
		click: Mouse,
		input: Edit,
		pageChange: Link,
		navigation: Link,
		api: Operation,
		pageview: Document,
		scroll: Pointer,
		resize: Refresh,
		keypress: Edit,
		error: 'CircleClose',
	}

	return iconMap[subType] || Calendar
}

// 格式化行为时间
const formatBehaviorTime = (timestamp: number) => {
	if (!timestamp) return ''

	const date = new Date(timestamp)
	return date.toLocaleString()
}

// 获取行为详情
const getBehaviorDetail = (action: any) => {
	console.log('获取行为详情:', action)

	// 尝试从data中获取详细信息
	const behavior = action.data || action

	const type = action.type === 'behavior' ? action.subType : action.type

	switch (type) {
		case 'click':
			return `点击了 ${behavior.target || '元素'} ${behavior.content ? `"${behavior.content}"` : ''} ${
				behavior.position ? `位置(${behavior.position.x}, ${behavior.position.y})` : ''
			}`
		case 'input':
			return `在 ${behavior.target || '输入框'} 中输入内容 ${behavior.content ? `"${behavior.content}"` : ''}`
		case 'pageChange':
		case 'navigation':
			return `从 ${behavior.from || behavior.fromPath || '未知页面'} 导航到 ${
				behavior.to || behavior.toPath || '未知页面'
			} ${behavior.changeType ? `(${behavior.changeType})` : ''}`
		case 'api':
			return `${behavior.method || 'GET'} 请求 ${behavior.url || '未知接口'} ${
				behavior.status ? `状态码: ${behavior.status}` : ''
			}`
		case 'pageview':
			return `访问页面 ${behavior.pageUrl || '未知页面'}`
		case 'scroll':
			return `滚动到位置 ${behavior.position ? `(${behavior.position.x}, ${behavior.position.y})` : '未知位置'}`
		case 'keypress':
			return `按键 ${behavior.key || '未知按键'}`
		case 'error':
			return `发生错误: ${behavior.message || '未知错误'} ${behavior.stack ? '（详细堆栈信息已记录）' : ''}`
		default:
			return JSON.stringify(behavior)
	}
}

// 关闭弹窗
const handleClose = () => {
	dialogVisible.value = false
}
</script>

<style scoped>
.behavior-stack-dialog :deep(.el-dialog__body) {
	padding-top: 10px;
}

.behavior-header {
	margin-bottom: 20px;
	padding: 10px;
	background-color: #f5f7fa;
	border-radius: 4px;
}

.stack-info {
	font-size: 14px;
	color: #606266;
}

.stack-info p {
	margin: 5px 0;
}

.behavior-item {
	display: flex;
	flex-direction: column;
	gap: 5px;
}

.behavior-type {
	margin-bottom: 5px;
}

.behavior-detail {
	color: #606266;
}

.empty-tip {
	color: #909399;
	font-size: 14px;
	margin-top: 10px;
}
</style>
