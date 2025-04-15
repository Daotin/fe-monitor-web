<template>
	<el-dialog
		title="用户行为记录"
		v-model="dialogVisible"
		width="80%"
		destroy-on-close
		@close="handleClose"
		class="behavior-stack-dialog">
		<div v-loading="loading">
			<!-- 有行为栈数据 -->
			<template v-if="hasBehaviorStack">
				<el-timeline>
					<el-timeline-item
						v-for="(behavior, index) in behaviorStack"
						:key="index"
						:type="getBehaviorTagType(behavior.type)"
						:icon="getBehaviorIcon(behavior.type)"
						:timestamp="formatBehaviorTime(behavior.timestamp)"
						size="large">
						<div class="behavior-item">
							<div class="behavior-type">
								<el-tag size="small" :type="getBehaviorTagType(behavior.type)">{{ behavior.type }}</el-tag>
							</div>
							<div class="behavior-detail">{{ getBehaviorDetail(behavior) }}</div>
						</div>
					</el-timeline-item>
				</el-timeline>
			</template>

			<!-- 无行为栈数据 -->
			<template v-else-if="!loading">
				<el-empty description="暂无用户行为记录">
					<template #description>
						<p>该错误事件未包含用户行为记录</p>
						<p class="empty-tip">提示: 确保SDK配置中启用了behaviorStack插件</p>
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

// 是否有行为栈数据
const hasBehaviorStack = computed(() => {
	return props.error?.behaviorStack && props.error.behaviorStack.length > 0
})

// 行为栈数据，按时间倒序排列
const behaviorStack = computed(() => {
	if (!hasBehaviorStack.value || !props.error) return []

	return [...props.error.behaviorStack].sort((a, b) => b.timestamp - a.timestamp)
})

// 获取行为类型对应的标签类型
const getBehaviorTagType = (type: string) => {
	const typeMap: Record<string, string> = {
		click: 'primary',
		input: 'success',
		navigation: 'warning',
		api: 'danger',
		pageview: 'info',
		scroll: '',
		resize: '',
		keypress: 'success',
		error: 'danger',
	}

	return typeMap[type] || ''
}

// 获取行为类型对应的图标
const getBehaviorIcon = (type: string) => {
	const iconMap: Record<string, any> = {
		click: Mouse,
		input: Edit,
		navigation: Link,
		api: Operation,
		pageview: Document,
		scroll: Pointer,
		resize: Refresh,
		keypress: Edit,
		error: 'CircleClose',
	}

	return iconMap[type] || Calendar
}

// 格式化行为时间
const formatBehaviorTime = (timestamp: number) => {
	if (!timestamp) return ''

	const date = new Date(timestamp)
	return date.toLocaleString()
}

// 获取行为详情
const getBehaviorDetail = (behavior: any) => {
	switch (behavior.type) {
		case 'click':
			return `点击了 ${behavior.element || '元素'} ${behavior.text ? `"${behavior.text}"` : ''} ${
				behavior.position ? `位置(${behavior.position.x}, ${behavior.position.y})` : ''
			}`
		case 'input':
			return `在 ${behavior.element || '输入框'} 中输入内容`
		case 'navigation':
			return `从 ${behavior.from || '未知页面'} 导航到 ${behavior.to || '未知页面'}`
		case 'api':
			return `${behavior.method || 'GET'} 请求 ${behavior.url || '未知接口'} ${
				behavior.status ? `状态码: ${behavior.status}` : ''
			}`
		case 'pageview':
			return `访问页面 ${behavior.url || '未知页面'} ${behavior.title ? `"${behavior.title}"` : ''}`
		case 'scroll':
			return `滚动到位置 ${behavior.position ? `(${behavior.position.x}, ${behavior.position.y})` : '未知位置'}`
		case 'keypress':
			return `按键 ${behavior.key || '未知按键'}`
		case 'error':
			return `发生错误: ${behavior.message || '未知错误'}`
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
